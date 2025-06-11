const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");

const prisma = new PrismaClient();

router.get("/summary", async (req, res) => {
  const { fromDate, toDate } = req.query;
  
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

    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false,
        createdAt: {
          gte: startDate.toDate(),
          lte: endDate.toDate(),
        },
      },
      select: {
        outlet: true,
        wine: true,
        beer: true,
        juice: true,
      },
    });

    const outletData = forms.reduce((acc, form) => {
      if (!acc[form.outlet]) {
        acc[form.outlet] = { wine: 0, beer: 0, juice: 0 };
      }
      acc[form.outlet].wine += form.wine;
      acc[form.outlet].beer += form.beer;
      acc[form.outlet].juice += form.juice;
      return acc;
    }, {});

    const results = Object.entries(outletData).map(([outlet, totals]) => ({
      outlet,
      ...totals,
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error getting product distribution summary:", err);
    return res.status(500).json({ 
      error: "Internal server error", 
      details: err.message 
    });
  }
});

router.get("/outlet", async (req, res) => {
  const outlet = req.query.outlet;

  if (!outlet) {
    return res.status(400).json({ error: "Outlet query parameter is required" });
  }

  try {
    const totals = await prisma.sOSForm.aggregate({
      where: {
        outlet,
        deleted: false,
      },
      _sum: {
        wine: true,
        beer: true,
        juice: true,
      },
    });

    res.json([{
      outlet,
      wine: totals._sum.wine || 0,
      beer: totals._sum.beer || 0,
      juice: totals._sum.juice || 0,
    }]);
  } catch (error) {
    console.error("Error fetching outlet data:", error);
    res.status(500).json({ error: "Failed to fetch outlet data" });
  }
});

module.exports = router;