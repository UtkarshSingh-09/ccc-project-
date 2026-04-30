/**
 * Dynamic Programming - 0/1 Knapsack implementation
 * 
 * Goal: Maximize total impact (peopleAffected * severity)
 * Constraint: Total resources allocated cannot exceed total available resources.
 * 
 * @param {Array} locations - List of location objects
 * @param {number} totalResources - Total available resources (capacity)
 * @returns {Object} { selectedLocations, maxImpact, resourcesUsed }
 */
const optimizeResources = (locations, totalResources) => {
  const n = locations.length;
  
  // Calculate impact for each location
  const items = locations.map(loc => ({
    ...loc,
    impact: loc.peopleAffected * loc.severity,
    weight: loc.resourcesRequired
  }));

  // Create DP table: dp[i][w] represents max impact using first i items and max weight w
  const dp = Array(n + 1).fill(0).map(() => Array(totalResources + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= totalResources; w++) {
      if (item.weight <= w) {
        // Option 1: Include current item
        // Option 2: Exclude current item
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - item.weight] + item.impact
        );
      } else {
        // Item is too heavy, exclude it
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected locations
  const selectedLocations = [];
  let w = totalResources;
  let maxImpact = dp[n][totalResources];
  let resourcesUsed = 0;

  for (let i = n; i > 0 && maxImpact > 0; i--) {
    if (maxImpact !== dp[i - 1][w]) {
      // This item was included
      const selectedItem = items[i - 1];
      selectedLocations.push(selectedItem);
      maxImpact -= selectedItem.impact;
      w -= selectedItem.weight;
      resourcesUsed += selectedItem.weight;
    }
  }

  return {
    selectedLocations: selectedLocations.reverse(), // Maintain original relative order
    maxImpact: dp[n][totalResources],
    resourcesUsed
  };
};

module.exports = { optimizeResources };
