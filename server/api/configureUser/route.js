const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { format } = require("date-fns"); // Import format from date-fns

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { deleted: false },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const formattedUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt ? format(user.createdAt, 'MMMM dd, yyyy HH:mm:ss') : null, // Applying date-fns formatting
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/:id/role", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newRole = user.role === "ADMIN" ? "MERCHANDISER" : "ADMIN";

    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    res.status(200).json({ success: true, newRole });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
});

router.put("/:id/soft-delete", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error soft deleting user:", err);
    res.status(500).json({ error: "Failed to soft delete user" });
  }
});

module.exports = router;
