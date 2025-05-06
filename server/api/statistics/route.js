const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const [sosCount, merchCount] = await Promise.all([
      prisma.sOSForm.count({
        where: {
          deleted: false, 
        },
      }),
      prisma.user.count({
        where: {
          role: "MERCHANDISER",
          deleted: false, 
        },
      }),
    ]);

    res.json({ sosCount, merchCount });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
