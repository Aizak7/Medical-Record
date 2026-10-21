
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturer: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
