import { Schema, model } from "mongoose";
import * as crypto from "crypto";

DB.Shield.SEARCH_COUNT = "searchCount";
DB.Shield.ADD_SUBSCRIBER = "addSubscriber";
DB.Shield.FILM_SEARCH = "filmSearch";

let ShieldSchema = new Schema(
  {
    eventType: { type: String },
    eventIdentifier: { type: String },
    eventDateToSecond: { type: Number },
    eventDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

ShieldSchema.index({ eventDate: 1 }, { expireAfterSeconds: 3600 * 24 * 7 });

DB.Shield.model = model(DB.Shield.MODEL_NAME, ShieldSchema, DB.Shield.MODEL_NAME);

const encryptIP = (ip) =>
  crypto
    .createHash("sha256")
    .update(ip + "evian")
    .digest("base64");

DB.Shield.check = async (ip, action) => {
  let encryptedIP = encryptIP(ip);

  switch (action) {
    case DB.Shield.SEARCH_COUNT:
      await shieldVerification(encryptedIP, action, [
        { maxNumber: 1, durationInSec: 2 }, //2 sec
      ]);
      break;
    case DB.Shield.FILM_SEARCH:
      await shieldVerification(encryptedIP, action, [
        { maxNumber: 100, durationInSec: 60 * 5 }, //5 min
        { maxNumber: 500, durationInSec: 3600 }, // 1 heure
        { maxNumber: 5000, durationInSec: 86400 }, //24 heures
      ]);
      break;
    case DB.Shield.ADD_SUBSCRIBER:
      await shieldVerification(encryptedIP, action, [
        { maxNumber: 5, durationInSec: 60 * 5 }, //5 min
        { maxNumber: 20, durationInSec: 3600 }, // 1 heure
        { maxNumber: 40, durationInSec: 86400 }, //24 heures
      ]);
      break;
    default:
      throw new CustomError(400, "not-handled", "action not handled");
  }
};

DB.Shield.save = async (ip, action) => {
  let encryptedIP = encryptIP(ip);
  return await DB.Shield.model.create({
    eventType: action,
    eventIdentifier: encryptedIP,
    eventDateToSecond: Date.now(),
    eventDate: new Date(),
  });
};

let shieldVerification = async (encryptedIP, action, limitations) => {
  let authorization = "initial";
  for (const limitation of limitations) {
    if (authorization && limitation?.maxNumber && limitation?.durationInSec) {
      let date = new Date();
      date.setSeconds(date.getSeconds() - limitation.durationInSec);
      let countEvents = await DB.Shield.model.countDocuments({
        eventType: action,
        eventIdentifier: encryptedIP,
        eventDate: { $gte: date },
      });
      if (countEvents >= limitation.maxNumber) throw new CustomError(403, "too-many-calls", "Too many calls");
    }
  }
};
