import { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, MapPin, AlertTriangle, Users, Database, Play, Plus, X, Box, Info, ArrowRight, CheckCircle, XCircle, Activity, ChevronRight, BarChart2 } from 'lucide-react';

// Default sample data
const initialLocations = [
  { id: 'loc-1', name: 'Downtown City Center', resourcesRequired: 40, severity: 8, peopleAffected: 500, distance: 15 },
  { id: 'loc-2', name: 'Northside Suburbs', resourcesRequired: 30, severity: 6, peopleAffected: 300, distance: 25 },
  { id: 'loc-3', name: 'East River Slums', resourcesRequired: 50, severity: 9, peopleAffected: 800, distance: 40 },
  { id: 'loc-4', name: 'West End Medical Camp', resourcesRequired: 20, severity: 10, peopleAffected: 200, distance: 5 },
  { id: 'loc-5', name: 'South Valley Villages', resourcesRequired: 35, severity: 7, peopleAffected: 400, distance: 60 },
];

function App() {
  const [locations, setLocations] = useState(initialLocations);
  const [totalResources, setTotalResources] = useState(100);
  const [deliveryStrategy, setDeliveryStrategy] = useState('severity');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // New states for enhancements
  const [skippedLocations, setSkippedLocations] = useState([]);
  const [naiveImpact, setNaiveImpact] = useState(0);
  const [showSimulation, setShowSimulation] = useState(false);

  // New location form state
  const [newLoc, setNewLoc] = useState({
    name: '', resourcesRequired: '', severity: '', peopleAffected: '', distance: ''
  });

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLoc.name || !newLoc.resourcesRequired) return;
    
    setLocations([...locations, {
      id: `loc-${Date.now()}`,
      name: newLoc.name,
      resourcesRequired: Number(newLoc.resourcesRequired),
      severity: Number(newLoc.severity) || 1,
      peopleAffected: Number(newLoc.peopleAffected) || 1,
      distance: Number(newLoc.distance) || 1
    }]);
    
    setNewLoc({ name: '', resourcesRequired: '', severity: '', peopleAffected: '', distance: '' });
  };

  const handleRemoveLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const calculateNaiveImpact = (locs, capacity) => {
    // Naive approach: just pick the first ones that fit
    let impact = 0;
    let used = 0;
    for (const loc of locs) {
      if (used + loc.resourcesRequired <= capacity) {
        impact += loc.peopleAffected * loc.severity;
        used += loc.resourcesRequired;
      }
    }
    return impact;
  };

  const handleOptimize = async () => {
    if (locations.length === 0) {
      setError("Please add at least one location.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5005/api/optimize', {
        totalResources: Number(totalResources),
        locations,
        deliveryStrategy
      });
      const data = response.data.data;
      setResult(data);
      
      // Calculate skipped locations
      const selectedIds = new Set(data.selectedLocations.map(l => l.id));
      setSkippedLocations(locations.filter(l => !selectedIds.has(l.id)));
      
      // Calculate naive random/first-fit impact
      setNaiveImpact(calculateNaiveImpact(locations, Number(totalResources)));
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'badge-high';
    if (severity >= 5) return 'badge-medium';
    return 'badge-low';
  };

  const getSeverityLabel = (severity) => {
    if (severity >= 8) return 'High';
    if (severity >= 5) return 'Medium';
    return 'Low';
  };

  return (
    <div className="app-container">
      <header>
        <h1>Disaster Relief Resource Optimizer</h1>
        <p>Using Dynamic Programming & Greedy Algorithms to maximize impact with limited resources.</p>
      </header>

      <main className="main-content">
        {/* Left Column: Input Form */}
        <div className="input-section">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title tooltip-container">
              <Database size={20} /> Optimization Settings
              <Info size={16} className="info-icon" title="Configure resources and strategy for the algorithms" />
            </h2>
            
            <div className="form-group">
              <label>Total Available Resources (Capacity)</label>
              <input 
                type="number" 
                value={totalResources} 
                onChange={(e) => setTotalResources(e.target.value)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="tooltip-container">
                Delivery Prioritization Strategy (Greedy)
                <Info size={16} className="info-icon" title="Greedy Algorithm: Chooses the best immediate option for route delivery based on selected criteria." />
              </label>
              <select 
                value={deliveryStrategy} 
                onChange={(e) => setDeliveryStrategy(e.target.value)}
              >
                <option value="severity">Highest Severity First</option>
                <option value="distance">Nearest Distance First</option>
              </select>
            </div>

            <button 
              className="btn" 
              onClick={handleOptimize} 
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : <><Play size={18} /> Optimize Resources</>}
            </button>

            {result && (
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '0.75rem' }}
                onClick={() => setShowSimulation(true)}
              >
                <Activity size={18} /> Show Optimization Steps
              </button>
            )}
            
            {error && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '0.5rem' }}>
                {error}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title tooltip-container">
              <MapPin size={20} /> Affected Locations
              <Info size={16} className="info-icon" title="Dynamic Programming: Finds the optimal combination of these locations to maximize impact without exceeding resource capacity." />
            </h2>
            
            <form onSubmit={handleAddLocation} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div className="form-group">
                <input placeholder="Location Name" value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} required />
              </div>
              <div className="flex-row">
                <input type="number" placeholder="Need (Resources)" value={newLoc.resourcesRequired} onChange={e => setNewLoc({...newLoc, resourcesRequired: e.target.value})} required />
                <input type="number" placeholder="Severity (1-10)" value={newLoc.severity} onChange={e => setNewLoc({...newLoc, severity: e.target.value})} min="1" max="10" required />
              </div>
              <div className="flex-row" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <input type="number" placeholder="People" value={newLoc.peopleAffected} onChange={e => setNewLoc({...newLoc, peopleAffected: e.target.value})} required />
                <input type="number" placeholder="Distance (km)" value={newLoc.distance} onChange={e => setNewLoc({...newLoc, distance: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-secondary"><Plus size={16} /> Add Location</button>
            </form>

            <div className="locations-list">
              {locations.map(loc => (
                <div key={loc.id} className="location-item">
                  <button className="remove-btn" onClick={() => handleRemoveLocation(loc.id)}><X size={16}/></button>
                  <h4>{loc.name}</h4>
                  <div className="stat">Need: <span>{loc.resourcesRequired}</span></div>
                  <div className="stat">Severity: <span className={`badge ${getSeverityColor(loc.severity)}`}>{getSeverityLabel(loc.severity)} ({loc.severity}/10)</span></div>
                  <div className="stat">People: <span>{loc.peopleAffected}</span></div>
                  <div className="stat">Distance: <span>{loc.distance}km</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="results-section">
          <div className="card" style={{ height: '100%' }}>
            <h2 className="card-title">
              <BarChart2 size={20} /> Optimization Results
            </h2>

            {!result ? (
              <div className="empty-state">
                <Box size={48} />
                <p>Run the optimizer to see the optimal resource allocation and delivery order.</p>
              </div>
            ) : (
              <div className="results-content">
                
                {/* Comparison Section */}
                <div className="comparison-box">
                  <div className="comp-stat">
                    <span className="label">Unoptimized Selection</span>
                    <span className="value text-muted">{naiveImpact.toLocaleString()}</span>
                  </div>
                  <div className="comp-icon"><ChevronRight size={24}/></div>
                  <div className="comp-stat highlight">
                    <span className="label">DP Optimized Impact</span>
                    <span className="value">{result.maxImpact.toLocaleString()}</span>
                  </div>
                </div>

                {/* Resource Usage Progress Bar */}
                <div className="resource-usage">
                  <div className="usage-header">
                    <span className="label">Resource Utilization</span>
                    <span className="value">{result.resourcesUsed} / {result.totalAvailableResources} used</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, (result.resourcesUsed / result.totalAvailableResources) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="usage-text">{Math.round((result.resourcesUsed / result.totalAvailableResources) * 100)}% of resources utilized</p>
                </div>

                {/* Why These Locations Were Selected */}
                <h3 className="section-subtitle"><CheckCircle size={18}/> Selection Breakdown (DP Output)</h3>
                
                <div className="selection-panel">
                  <div className="selected-list">
                    <h4 className="text-success"><CheckCircle size={14}/> Selected ({result.selectedCount})</h4>
                    <ul className="impact-list">
                      {result.selectedLocations.map(loc => (
                        <li key={loc.id}>
                          <div className="loc-name">{loc.name}</div>
                          <div className="loc-calc text-muted text-sm">
                            People ({loc.peopleAffected}) × Severity ({loc.severity}) = <strong>{loc.peopleAffected * loc.severity} Impact</strong>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {skippedLocations.length > 0 && (
                    <div className="skipped-list">
                      <h4 className="text-danger"><XCircle size={14}/> Skipped ({skippedLocations.length})</h4>
                      <ul className="impact-list">
                        {skippedLocations.map(loc => (
                          <li key={loc.id}>
                            <div className="loc-name text-muted">{loc.name}</div>
                            <div className="loc-reason text-muted text-sm">
                              Skipped due to resource constraints or lower relative impact.
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <h3 className="section-subtitle" style={{ marginTop: '2rem' }}><Truck size={18}/> Delivery Route (Greedy Output)</h3>
                
                {result.selectedLocations.length === 0 ? (
                  <p style={{ color: 'var(--danger)' }}>No locations could be served with the available resources.</p>
                ) : (
                  <>
                    <div className="route-visualization">
                      <div className="route-node base">Base</div>
                      {result.deliveryOrder.map((loc, index) => (
                        <div key={loc.id} className="route-step">
                          <ArrowRight size={16} className="route-arrow" />
                          <div className="route-node">
                            <span className="step-num">{index + 1}</span>
                            {loc.name}
                          </div>
                        </div>
                      ))}
                    </div>

                    <ol className="order-list">
                      {result.deliveryOrder.map((loc, index) => (
                        <li key={loc.id} className="order-item">
                          <div className="order-number">{index + 1}</div>
                          <div className="order-details">
                            <h4>{loc.name}</h4>
                            <div className="order-meta">
                              <span className={`badge ${getSeverityColor(loc.severity)}`}>
                                <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                {getSeverityLabel(loc.severity)}
                              </span>
                              <span><Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> {loc.peopleAffected}</span>
                              <span><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {loc.distance} km</span>
                              <span><Box size={12} style={{ display: 'inline', marginRight: '4px' }} /> Need: {loc.resourcesRequired}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Step-by-Step Simulation Modal */}
      {showSimulation && result && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Algorithm Simulation</h2>
              <button className="close-btn" onClick={() => setShowSimulation(false)}><X size={24}/></button>
            </div>
            <div className="modal-body">
              <div className="sim-step">
                <h3>1. Calculating Impact Values</h3>
                <p>First, we calculate the potential impact for every location based on people affected and incident severity.</p>
                <div className="sim-box">
                  {locations.map(l => (
                    <div key={l.id} className="sim-item">
                      <span>{l.name}</span>
                      <span>{l.peopleAffected} × {l.severity} = <strong>{l.peopleAffected * l.severity}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sim-step">
                <h3>2. Dynamic Programming (Selection)</h3>
                <p>We find the combination of locations that yields the maximum total impact without exceeding {result.totalAvailableResources} resources.</p>
                <div className="sim-box success">
                  <p><strong>Selected Locations:</strong> {result.selectedLocations.map(l => l.name).join(', ')}</p>
                  <p><strong>Total Impact:</strong> {result.maxImpact}</p>
                  <p><strong>Resources Used:</strong> {result.resourcesUsed} / {result.totalAvailableResources}</p>
                </div>
              </div>

              <div className="sim-step">
                <h3>3. Greedy Algorithm (Routing)</h3>
                <p>Finally, we sort the selected locations into a delivery order using the <strong>{deliveryStrategy === 'severity' ? 'Highest Severity First' : 'Nearest Distance First'}</strong> strategy.</p>
                <div className="sim-box info">
                  <div className="route-flow">
                    {result.deliveryOrder.map((l, i) => (
                      <span key={l.id}>
                        {l.name}
                        {i < result.deliveryOrder.length - 1 && <ArrowRight size={14} style={{ margin: '0 8px', display: 'inline' }} />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
