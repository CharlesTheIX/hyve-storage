import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    //auto assigned fields (_id, __v)
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide a name"],
    },
    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide an array of user ids"],
      },
    ],
    bucketIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bucket",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

schema.pre("save", async function (next: any) {
  try {
    if (this.userIds.length === 0) throw new Error("A company requires at least one user");
    next();
  } catch (err: any) {
    console.error(`Mongo company pre save error: ${err.message}`);
    next(err);
  }
});

const Company = model("Company", schema);
export default Company;
