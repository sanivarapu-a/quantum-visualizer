"""
FastAPI app.
"""

from dotenv import load_dotenv
load_dotenv()

from typing import Optional

from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from jose import JWTError

from circuit import (
    Circuit, ToQiskitResponse, ToQasmResponse, BlochResponse,
    ExportRequest, RunOptionsRequest,
    RegisterRequest, LoginRequest, TokenResponse,
)
from translator import (
    build_qiskit_circuit, qiskit_circuit_to_code,
    qiskit_circuit_to_qasm, run_simulation, compute_bloch_vectors,
)
from db.session import get_session
from db.models import CircuitRecord, RunRecord, User
from auth import hash_password, verify_password, create_access_token, decode_access_token

app = FastAPI(title="QuantumVisualizer API")
router = APIRouter(prefix="/circuits", tags=["circuits"])
auth_router = APIRouter(prefix="/auth", tags=["auth"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

# --- Auth ---

@auth_router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token)


@auth_router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token)


def get_current_user(
    authorization: str = Header(...),
    session: Session = Depends(get_session),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.removeprefix("Bearer ")
    try:
        user_id = decode_access_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# --- Circuit translation (stateless — no ownership concept, left open) ---

@app.post("/circuits/to-qiskit", response_model=ToQiskitResponse)
def to_qiskit(circuit: Circuit):
    try:
        qc = build_qiskit_circuit(circuit)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    return ToQiskitResponse(code=qiskit_circuit_to_code(qc))


@app.post("/circuits/to-qasm", response_model=ToQasmResponse)
def to_qasm(circuit: Circuit):
    try:
        qc = build_qiskit_circuit(circuit)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    return ToQasmResponse(code=qiskit_circuit_to_qasm(qc))


@app.post("/circuits/bloch", response_model=BlochResponse)
def get_bloch_vectors(circuit: Circuit):
    try:
        vectors = compute_bloch_vectors(circuit)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    return BlochResponse(vectors=vectors)


# --- Circuit persistence / versioning (now auth-gated) ---

@router.post("/export", response_model=CircuitRecord)
def export_circuit(
    payload: ExportRequest,
    root_id: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    try:
        qc = build_qiskit_circuit(payload.circuit)
        qasm = qiskit_circuit_to_qasm(qc)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=422, detail=str(e))

    if root_id is not None:
        latest = session.exec(
            select(CircuitRecord)
            .where(
                CircuitRecord.root_id == root_id,
                CircuitRecord.owner_id == current_user.id,
            )
            .order_by(CircuitRecord.version.desc())
        ).first()
        if not latest:
            # Either the circuit doesn't exist, or it exists but belongs
            # to someone else — same 404 either way, so we don't leak
            # which circuits exist under other accounts.
            raise HTTPException(status_code=404, detail="Circuit not found")
        next_version = latest.version + 1
    else:
        next_version = 1

    record = CircuitRecord(
        name=payload.name,
        data=payload.circuit.model_dump(),
        qasm=qasm,
        root_id=root_id,
        version=next_version,
        owner_id=current_user.id,
    )
    session.add(record)
    session.commit()
    session.refresh(record)

    if record.root_id is None:
        record.root_id = record.id
        session.add(record)
        session.commit()
        session.refresh(record)

    return record


@router.get("/{root_id}/versions", response_model=list[CircuitRecord])
def list_versions(
    root_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    versions = session.exec(
        select(CircuitRecord)
        .where(
            CircuitRecord.root_id == root_id,
            CircuitRecord.owner_id == current_user.id,
        )
        .order_by(CircuitRecord.version.asc())
    ).all()
    if not versions:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return versions


@router.get("/{root_id}/versions/{version}", response_model=CircuitRecord)
def get_version(
    root_id: int,
    version: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    record = session.exec(
        select(CircuitRecord)
        .where(
            CircuitRecord.root_id == root_id,
            CircuitRecord.version == version,
            CircuitRecord.owner_id == current_user.id,
        )
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Version not found")
    return record


@router.get("/{root_id}/latest", response_model=CircuitRecord)
def get_latest_version(
    root_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    record = session.exec(
        select(CircuitRecord)
        .where(
            CircuitRecord.root_id == root_id,
            CircuitRecord.owner_id == current_user.id,
        )
        .order_by(CircuitRecord.version.desc())
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return record


@router.post("/versions/{circuit_id}/run", response_model=RunRecord)
def run_and_save(
    circuit_id: int,
    options: RunOptionsRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    record = session.get(CircuitRecord, circuit_id)
    if not record or record.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Circuit version not found")

    circuit = Circuit.model_validate(record.data)

    run = RunRecord(circuit_id=record.id, shots=options.shots, status="running")
    session.add(run)
    session.commit()
    session.refresh(run)

    try:
        counts = run_simulation(circuit, options.shots)
        run.status = "complete"
        run.result = {"counts": counts}
    except (KeyError, ValueError) as e:
        run.status = "failed"
        run.error = str(e)

    session.add(run)
    session.commit()
    session.refresh(run)
    return run


@router.get("/versions/{circuit_id}/runs", response_model=list[RunRecord])
def list_runs_for_version(
    circuit_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Confirm this circuit version actually belongs to the caller before
    # returning any runs against it.
    record = session.get(CircuitRecord, circuit_id)
    if not record or record.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Circuit version not found")

    return session.exec(select(RunRecord).where(RunRecord.circuit_id == circuit_id)).all()


@router.get("/runs/{run_id}", response_model=RunRecord)
def get_run(
    run_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    run = session.get(RunRecord, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    # RunRecord has no owner_id of its own — ownership is inherited from
    # the circuit it belongs to, so check that instead.
    record = session.get(CircuitRecord, run.circuit_id)
    if not record or record.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Run not found")

    return run


app.include_router(router)
app.include_router(auth_router)