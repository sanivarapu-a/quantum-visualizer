"""
FastAPI app.

Routes stay thin: parse input (handled automatically by the Pydantic
model in the signature), call a service function, return a response.
No Qiskit logic lives in this file.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.circuit import Circuit, ToQiskitResponse
from app.services.translator import build_qiskit_circuit, qiskit_circuit_to_code
from app.db.session import init_db
from app.routes.circuits import router as circuits_router

app = FastAPI(title="QuantumVisualizer API")
app.include_router(circuits_router)


@app.on_event("startup")
def on_startup():
    init_db()


# Allow the Next.js dev server to call this API. Tighten this to your
# real frontend origin(s) before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/circuits/to-qiskit", response_model=ToQiskitResponse)
def to_qiskit(circuit: Circuit):
    """
    Accepts a Circuit JSON body (validated automatically by the Circuit
    model above) and returns the equivalent Qiskit Python code as text.
    """
    try:
        qc = build_qiskit_circuit(circuit)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    code = qiskit_circuit_to_code(qc)
    return ToQiskitResponse(code=code)