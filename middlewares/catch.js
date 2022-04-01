
export default function (err, req, res, next) {
  console.log(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  } else {
    res.status(500).json({ status: "internal-server-error", message: "An error has occured" });
  }
}