import mongoose from "mongoose";

const magazineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    issueNumber: {
      type: Number,
      required: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Magazine = mongoose.model("Magazine", magazineSchema);

export default Magazine;
