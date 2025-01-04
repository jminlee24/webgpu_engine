export class UnsupportedError extends Error {
  constructor(msg: string = "webgpu not supported on this device") {
    super(msg);

    Object.setPrototypeOf(this, UnsupportedError.prototype);
  }
}
