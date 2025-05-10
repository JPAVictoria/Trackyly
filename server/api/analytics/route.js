const express = require("express");
const router = express.Router();
const {
  PrismaClient
} = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/quarter", async (req, res) => {
  try {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    const startMonth = (quarter - 1) * 3;
    const quarterStart = new Date(now.getFullYear(), startMonth, 1);
    const quarterEnd = new Date(now.getFullYear(), startMonth + 3, 0);

    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false,
        createdAt: {
          gte: quarterStart,
          lte: quarterEnd,
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
        acc[form.outlet] = {
          wine: 0,
          beer: 0,
          juice: 0
        };
      }
      acc[form.outlet].wine += form.wine;
      acc[form.outlet].beer += form.beer;
      acc[form.outlet].juice += form.juice;
      return acc;
    }, {});


    const results = Object.keys(outletData).map((outlet) => ({
      outlet,
      wine: outletData[outlet].wine,
      beer: outletData[outlet].beer,
      juice: outletData[outlet].juice,
    }));

    console.log(results);

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error getting quarterly product distribution:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

router.get("/outlet", async (req, res) => {
  const outlet = req.query.outlet;

  if (!outlet) {
    return res.status(400).json({
      error: "Outlet query parameter is required"
    });
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
    res.status(500).json({
      error: "Failed to fetch outlet data"
    });
  }
});

router.get("/custom", async (req, res) => {
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: "Both fromDate and toDate are required" });
  }

  const startDate = new Date(fromDate);
  startDate.setUTCHours(0, 0, 0, 0); 

  const endDate = new Date(toDate);
  endDate.setUTCHours(23, 59, 59, 999); 

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false,
        createdAt: {
          gte: startDate,
          lte: endDate,
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

    const results = Object.keys(outletData).map((outlet) => ({
      outlet,
      wine: outletData[outlet].wine,
      beer: outletData[outlet].beer,
      juice: outletData[outlet].juice,
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;