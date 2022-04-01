class CustomError extends Error {
  constructor(statusCode, status, message) {
    super();
    if (typeof statusCode === "object") {
      let jso = statusCode;
      this.statusCode = jso.statusCode;
      this.status = jso.status;
      this.message = jso.message;
    } else {
      this.statusCode = statusCode;
      this.status = status;
      this.message = message;
    }
  }
}

global.CustomError = CustomError;
