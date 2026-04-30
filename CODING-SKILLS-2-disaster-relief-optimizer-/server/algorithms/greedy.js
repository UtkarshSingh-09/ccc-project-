/**
 * Greedy Algorithm implementation
 * 
 * Goal: Determine the delivery priority of selected locations.
 * Strategy: 
 *   - 'severity': Sort by severity descending. If equal, by peopleAffected descending.
 *   - 'distance': Sort by distance ascending.
 * 
 * @param {Array} locations - List of selected location objects to deliver to
 * @param {string} strategy - 'severity' or 'distance'
 * @returns {Array} Ordered list of locations
 */
const prioritizeDelivery = (locations, strategy = 'severity') => {
  // Create a copy to avoid mutating the original array
  const locationsCopy = [...locations];

  return locationsCopy.sort((a, b) => {
    if (strategy === 'severity') {
      // Highest severity first
      if (b.severity !== a.severity) {
        return b.severity - a.severity;
      }
      // Tie-breaker: Highest people affected first
      return b.peopleAffected - a.peopleAffected;
    } else if (strategy === 'distance') {
      // Nearest distance first
      return a.distance - b.distance;
    }
    return 0;
  });
};

module.exports = { prioritizeDelivery };
