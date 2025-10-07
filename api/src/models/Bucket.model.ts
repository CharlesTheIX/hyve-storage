import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    //auto assigned fields (_id, __v)
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide a username"],
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Please provide a company_id"],
    },
    max_size_bytes: {
      type: Number,
      default: 1000000000,
    },
    consumption_bytes: {
      type: Number,
      default: 0,
    },
    object_count: {
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
    //TODO: handle error
    console.error(`Mongo bucket pre save error: ${err.message}`);
    next(err);
  }
});

const Bucket = model("Bucket", schema);
export default Bucket;
