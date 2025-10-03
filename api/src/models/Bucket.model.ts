import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    //auto assigned fields (_id, __v)
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide a username"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Please provide a companyId"],
    },
    maxSize_bytes: {
      type: Number,
      default: 1000000000,
    },
    consumption_bytes: {
      type: Number,
      default: 0,
    },
    objectCount: {
      type: Number,
      default: 0,
    },
    permissions: {
      type: [Number],
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      default: [],
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next: any) {
  try {
    next();
  } catch (err: any) {
    console.error(`Mongo bucket pre save error: ${err.message}`);
    next(err);
  }
});

const Bucket = model("Bucket", schema);
export default Bucket;
