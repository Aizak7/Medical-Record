
require("dotenv").config();
const mongoose = require("mongoose");
const Medicine = require("./models/Medicine");

const medicines = [
  {
    name: "Paracetamol",
    category: "Pain Reliever",
    dosage: "500 mg",
    quantity: 100,
    expiryDate: new Date("2027-06-30"),
    manufacturer: "Pharmatech",
  },
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    dosage: "250 mg",
    quantity: 50,
    expiryDate: new Date("2027-03-15"),
    manufacturer: "MedCare",
  },
  {
    name: "Cetirizine",
    category: "Antihistamine",
    dosage: "10 mg",
    quantity: 75,
    expiryDate: new Date("2028-01-20"),
    manufacturer: "HealthPlus",
  },
  {
    name: "Vitamin C",
    category: "Vitamins",
    dosage: "500 mg",
    quantity: 120,
    expiryDate: new Date("2028-05-10"),
    manufacturer: "NutriLife",
  },
  {
    name: "Ibuprofen",
    category: "Pain Reliever",
    dosage: "200 mg",
    quantity: 80,
    expiryDate: new Date("2027-11-25"),
    manufacturer: "Wellness Pharma",
  },
];

async function seedDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Replace existing medicine records with these samples.
    await Medicine.deleteMany({});
    const inserted = await Medicine.insertMany(medicines);

    console.log(`${inserted.length} medicine records inserted successfully`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
