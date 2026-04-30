const express = require('express');
const router = express.Router();
const { optimizeResources } = require('../algorithms/dp');
const { prioritizeDelivery } = require('../algorithms/greedy');

// POST /api/optimize
router.post('/optimize', (req, res) => {
  try {
    const { totalResources, locations, deliveryStrategy } = req.body;

    if (totalResources === undefined || !locations || !Array.isArray(locations)) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    // Step 1: Use DP to find optimal set of locations
    const optimizationResult = optimizeResources(locations, totalResources);

    // Step 2: Use Greedy to prioritize delivery order
    const priorityStrategy = deliveryStrategy || 'severity';
    const deliveryOrder = prioritizeDelivery(optimizationResult.selectedLocations, priorityStrategy);

    res.json({
      success: true,
      data: {
        maxImpact: optimizationResult.maxImpact,
        resourcesUsed: optimizationResult.resourcesUsed,
        totalAvailableResources: totalResources,
        selectedCount: optimizationResult.selectedLocations.length,
        selectedLocations: optimizationResult.selectedLocations,
        deliveryOrder: deliveryOrder,
        strategyUsed: priorityStrategy
      }
    });

  } catch (error) {
    console.error('Error in optimization:', error);
    res.status(500).json({ error: 'Internal server error processing optimization.' });
  }
});

module.exports = router;
