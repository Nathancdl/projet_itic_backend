
async function add(req, res) {
  await DB.Shield.check(req.clientIp, DB.Shield.ADD_SUBSCRIBER);
  let payload = {};
  if (!validateEmail.validator(req.body.email)) throw new CustomError(400, "bad-params", validateEmail.message(req.body.email));
  payload.email = req.body.email;
  let subscribers = await DB.Subscribers.model.find(payload);
  if(subscribers.length > 0) throw new CustomError(400, "email-already-used", "email already used");
  let result = await DB.Subscribers.model.create(payload);
  await DB.Shield.save(req.clientIp, DB.Shield.ADD_SUBSCRIBER);
  res.status(200).json(SYSTEM.DONE);
}

let validateEmail = {
  validator: (value) => typeof value === "string" && value.length >= 1 && value.length <= 100,
  message: (value) => (value === undefined ? "no email provided" : "email must be a valid string"),
};

export default {
  add
};
