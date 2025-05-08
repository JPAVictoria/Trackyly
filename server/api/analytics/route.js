const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/quarter", async (req, res) => {
  try {
    const now = new Date();
    const quarter = Math.floor((now.getMonth() + 1) / 3) + 1;
    const startMonth = (quarter - 1) * 3;
    const quarterStart = new Date(now.getFullYear(), startMonth, 1);
    const quarterEnd = new Date(now.getFullYear(), startMonth + 3, 0);

    const forms = await prisma.sOSForm.findMany({
      where: {
        deleted: false, // Ensure only non-deleted forms are considered
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

    // Group the data by outlet
    const outletData = forms.reduce((acc, form) => {
      if (!acc[form.outlet]) {
        acc[form.outlet] = { wine: 0, beer: 0, juice: 0 };
      }
      acc[form.outlet].wine += form.wine;
      acc[form.outlet].beer += form.beer;
      acc[form.outlet].juice += form.juice;
      return acc;
    }, {});

    // Convert the grouped data into an array of results for each outlet
    const results = Object.keys(outletData).map((outlet) => ({
      outlet,
      wine: outletData[outlet].wine,
      beer: outletData[outlet].beer,
      juice: outletData[outlet].juice,
    }));

    console.log(results); // Log the final grouped results

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error getting quarterly product distribution:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});


module.exports = router;
