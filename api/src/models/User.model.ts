import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    //auto assigned fields (_id, __v)
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    surname: {
      type: String,
      required: [true, "Please provide a surname"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide a username"],
    },
    permissions: {
      type: [Number],
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      default: [],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Please provide a companyId"],
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next: any) {
  try {
    next();
  } catch (err: any) {
    console.error(`Mongo user pre save error: ${err.message}`);
    next(err);
  }
});

const User = model("User", schema);
export default User;
