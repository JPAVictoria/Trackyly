const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all non-deleted users
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
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Toggle user role
router.patch("/:id/role", async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user?.id; // Assuming you have authentication middleware that sets req.user

  try {
    // Prevent admin from changing their own role
    if (id === currentUserId) {
      return res.status(400).json({ error: "You cannot change your own role" });
    }

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
  const currentUserId = req.user?.id; // Assuming you have authentication middleware

  try {
    // Prevent user from deleting themselves
    if (id === currentUserId) {
      return res.status(400).json({ error: "You cannot delete yourself" });
    }

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