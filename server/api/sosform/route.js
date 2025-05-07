const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/all", async (req, res) => {
  try {
    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false,
      },
      include: {
        merchandiser: {
          select: {
            email: true, 
          },
        },
      },
    });

    const formsWithEmail = forms.map(form => ({
      ...form,
      email: form.merchandiser?.email || "",
    }));

    return res.status(200).json(formsWithEmail);
  } catch (err) {
    console.error("Error fetching all SOSForms:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { merchandiserId } = req.query; 

    if (!merchandiserId) {
      return res.status(400).json({ error: "merchandiserId is required" });
    }

    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false,
        merchandiserId: merchandiserId, 
      },
      orderBy: { createdAt: "desc" },
    });
    
    return res.status(200).json(forms);
  } catch (err) {
    console.error("Error fetching SOSForms:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure that id is a valid UUID string
    const formId = id;

    if (!formId) {
      return res.status(400).json({ error: "Form ID is required" });
    }

    const form = await prisma.sOSForm.findUnique({
      where: { id: formId },  // Use formId directly as it's a UUID string
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json(form);
  } catch (err) {
    console.error("Error fetching form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

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
        deleted: false, // Explicitly set deleted flag
      },
    });

    return res.status(201).json({ message: "Form created", data: newForm });
  } catch (err) {
    console.error("Error creating SOSForm:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// PUT /user/sosform/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { outlet, wine, beer, juice } = req.body;

  try {
    const updatedForm = await prisma.sOSForm.update({
      where: { id },
      data: {
        outlet,
        wine: Number(wine),
        beer: Number(beer),
        juice: Number(juice),
      },
    });

    return res.status(200).json({ message: "Form updated", data: updatedForm });
  } catch (err) {
    console.error("Error updating SOSForm:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


router.put("/softDelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedForm = await prisma.sOSForm.update({
      where: { id },
      data: { 
        deleted: true,
      },
    });

    return res.status(200).json({ message: "Form soft deleted", data: updatedForm });
  } catch (err) {
    console.error("Error soft deleting SOSForm:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});




module.exports = router;


