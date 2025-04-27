export class CRDTError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "CRDTError";
  }
}
