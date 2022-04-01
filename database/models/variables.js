import {model, mongo, Schema} from "mongoose";

let VariablesSchema = new Schema(
  {
    type: {type: String, unique: true, required: true},
    value: {type: Number, required: true},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

DB.Variables.model = model(DB.Variables.MODEL_NAME, VariablesSchema, DB.Variables.MODEL_NAME);

DB.Variables.incrementSearchCount = async () => {
  let variable = await DB.Variables.model.findOneAndUpdate({type: "searchCount"}, {$inc: {"value": 1}}).catch((e) => DB.utils.showIDCastError(e));
  if (!variable) throw new Error("variable searchCount not found and update failed");
};

DB.Variables.checkAndCreateBackboneData = async () => {
  await DB.Variables.model
    .create({
      _id: new mongo.ObjectId("011b91bdc3464f14678934ca"),
      type: "searchCount",
      value: 0,
    })
    .catch((e) => {
      //console.log(e)
    });
}