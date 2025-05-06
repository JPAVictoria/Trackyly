const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { outlet, wine, beer, juice, createdAt, merchandiserId } = req.body;

    if (!outlet || !wine || !beer || !juice || !merchandiserId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newForm = await prisma.sOSForm.create({
      data: {
        outlet,
        wine: Number(wine),
        beer: Number(beer),
        juice: Number(juice),
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        merchandiserId, 
      },
    });

    return res.status(201).json({ message: "Form created", data: newForm });
  } catch (err) {
    console.error("Error creating SOSForm:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const forms = await prisma.sOSForm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(forms);
  } catch (err) {
    console.error("Error fetching SOSForms:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


module.exports = router;
