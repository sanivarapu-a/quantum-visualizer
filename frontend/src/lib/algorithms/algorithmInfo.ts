export interface AlgorithmInfo {
  id: string;
  label: string;
  summary: string;
  howItWorks: string[];
  useCases: string[];
  supported: boolean;
  unsupportedReason?: string;
}

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: "bell-state",
    label: "Bell State",
    summary:
      "The simplest entangled quantum state possible. Two qubits become correlated so that measuring one instantly determines the other, no matter how far apart they are.",
    howItWorks: [
      "Apply H to the first qubit, putting it into superposition.",
      "Apply CNOT with the first qubit as control and the second as target — this entangles them.",
      "Measure both qubits: their outcomes are now perfectly correlated (or anti-correlated, depending on the variant).",
    ],
    useCases: [
      "The foundational building block for teleportation, superdense coding, and many other protocols",
      "Demonstrating entanglement and violations of Bell inequalities",
      "Quantum key distribution (QKD) protocols like E91",
    ],
    supported: true,
  },
  {
    id: "deutsch-jozsa",
    label: "Deutsch-Jozsa",
    summary:
      "Determines whether a hidden function is 'constant' (same output for every input) or 'balanced' (different outputs half the time) using a single query — a classical computer needs up to 2^(n-1)+1 queries in the worst case.",
    howItWorks: [
      "Set an ancilla qubit to |1⟩ and put all qubits into superposition with H gates.",
      "Apply the oracle, which encodes the hidden function as a phase kickback onto the input qubits.",
      "Apply H gates again to the input qubits to interfere the phases.",
      "Measure the input qubits: all-zero means constant, anything else means balanced.",
    ],
    useCases: [
      "Historically the first algorithm to prove a quantum speedup over classical computation",
      "Teaching tool for phase kickback and quantum interference",
      "Building block for understanding more complex oracle-based algorithms (Grover's, Simon's)",
    ],
    supported: true,
  },
  {
    id: "grover",
    label: "Grover's Search",
    summary:
      "A quantum algorithm for finding a specific item in an unsorted list of N items in roughly √N steps, instead of the N/2 steps a classical search needs on average.",
    howItWorks: [
      "Put all qubits into equal superposition, so every possible answer is represented at once.",
      "Apply an 'oracle' that flips the sign of the target state, marking it without revealing it.",
      "Apply a 'diffuser' that amplifies the marked state's probability while suppressing the rest.",
      "Repeat the oracle + diffuser step the optimal number of times, then measure — the target state is now the most likely outcome.",
    ],
    useCases: [
      "Searching unstructured databases faster than classical brute force",
      "Cracking symmetric-key cryptography (e.g. halving effective AES key strength)",
      "Solving NP-complete problems via brute-force search (SAT, graph coloring)",
      "Speeding up subroutines inside larger quantum algorithms (amplitude amplification)",
    ],
    supported: true,
  },
  {
    id: "qft",
    label: "Quantum Fourier Transform",
    summary:
      "The quantum analog of the discrete Fourier transform. Converts a state encoding amplitudes into one encoding frequencies, and is the core subroutine behind Shor's algorithm and quantum phase estimation.",
    howItWorks: [
      "Apply a Hadamard to the first qubit, splitting it into superposition.",
      "Apply controlled-phase rotations between each pair of qubits, with angles that halve for each additional qubit of separation.",
      "Repeat for every qubit, then reverse the qubit order with SWAP gates at the end.",
    ],
    useCases: [
      "Core subroutine in Shor's factoring algorithm",
      "Quantum phase estimation, used in chemistry and eigenvalue problems",
      "Period-finding problems that underlie several cryptographic attacks",
    ],
    supported: true,
  },
  {
    id: "superdense-coding",
    label: "Superdense Coding",
    summary:
      "Sends 2 classical bits of information by physically transmitting only 1 qubit, by exploiting a pre-shared entangled pair.",
    howItWorks: [
      "Sender and receiver start with an entangled Bell pair, one qubit each.",
      "The sender encodes 2 classical bits by applying I, X, Z, or XZ to their own qubit only.",
      "The sender's qubit is physically sent to the receiver.",
      "The receiver applies CNOT then H across both qubits and measures — recovering the original 2 bits.",
    ],
    useCases: [
      "Doubling classical channel capacity when entanglement is pre-shared",
      "Foundational protocol in quantum networking, alongside teleportation",
      "Demonstrating that entanglement is a genuine communication resource",
    ],
    supported: true,
  },
];