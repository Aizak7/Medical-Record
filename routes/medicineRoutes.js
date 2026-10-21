
const express = require("express");
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");

const router = express.Router();

// GET: Retrieve all medicines or search medicines
// Example: /api/medicines?search=paracetamol
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter = {
        $or: [
          { name: regex },
          { category: regex },
          { manufacturer: regex },
          { dosage: regex },
        ],
      };
    }

    const medicines = await Medicine.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medicines",
    });
  }
});

// GET: Retrieve one medicine by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medicine",
    });
  }
});

// POST: Add a new medicine
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      dosage,
      quantity,
      expiryDate,
      manufacturer,
    } = req.body;

    if (
      !name?.trim() ||
      !category?.trim() ||
      !dosage?.trim() ||
      quantity === undefined ||
      quantity === null ||
      quantity === "" ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) < 0 ||
      !expiryDate ||
      !Number.isFinite(Date.parse(expiryDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid required medicine fields",
      });
    }

    const medicine = await Medicine.create({
      name,
      category,
      dosage,
      quantity: Number(quantity),
      expiryDate,
      manufacturer,
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add medicine",
    });
  }
});

// PUT: Update a medicine by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "dosage",
      "quantity",
      "expiryDate",
      "manufacturer",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (
      "quantity" in updates &&
      (updates.quantity === "" ||
        !Number.isFinite(Number(updates.quantity)) ||
        Number(updates.quantity) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number",
      });
    }

    if (
      "expiryDate" in updates &&
      (!updates.expiryDate ||
        !Number.isFinite(Date.parse(updates.expiryDate)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid expiry date",
      });
    }

    for (const field of ["name", "category", "dosage"]) {
      if (field in updates &&
          (typeof updates[field] !== "string" ||
           !updates[field].trim())) {
        return res.status(400).json({
          success: false,
          message: `${field} must not be empty`,
        });
      }
    }

    if ("quantity" in updates) {
      updates.quantity = Number(updates.quantity);
    }

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update medicine",
    });
  }
});

// DELETE: Remove a medicine by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await Medicine.findByIdAndDelete(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete medicine",
    });
  }
});

module.exports = router;
