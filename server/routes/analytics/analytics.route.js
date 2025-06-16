const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");

const prisma = new PrismaClient();

router.get("/distribution", async (req, res) => {
  const { fromDate, toDate, outlet } = req.query;

  try {
    let startDate, endDate;

    if (!fromDate || !toDate) {
      const now = moment();
      const quarter = now.quarter();
      startDate = moment().quarter(quarter).startOf("quarter").startOf("day");
      endDate = moment().quarter(quarter).endOf("quarter").endOf("day");
    } else {
      startDate = moment(fromDate).startOf("day");
      endDate = moment(toDate).endOf("day");

      if (!startDate.isValid() || !endDate.isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
      }
    }

    const commonFilter = {
      deleted: false,
      createdAt: {
        gte: startDate.toDate(),
        lte: endDate.toDate(),
      },
    };

    if (outlet) {
      // Single outlet - return product breakdown as separate entries
      const result = await prisma.sOSForm.aggregate({
        where: {
          ...commonFilter,
          outlet,
        },
        _sum: {
          wine: true,
          beer: true,
          juice: true,
        },
      });

      return res.json([
        { outlet: "Wine", wine: result._sum.wine || 0, beer: 0, juice: 0 },
        { outlet: "Beer", wine: 0, beer: result._sum.beer || 0, juice: 0 },
        { outlet: "Juice", wine: 0, beer: 0, juice: result._sum.juice || 0 },
      ]);
    } else {
      const grouped = await prisma.sOSForm.groupBy({
        by: ["outlet"],
        where: commonFilter,
        _sum: {
          wine: true,
          beer: true,
          juice: true,
        },
      });

      const formatted = grouped.map((group) => ({
        outlet: group.outlet,
        wine: group._sum.wine || 0,
        beer: group._sum.beer || 0,
        juice: group._sum.juice || 0,
      }));

      return res.json(formatted);
    }
  } catch (error) {
    console.error("Error fetching distribution data:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
