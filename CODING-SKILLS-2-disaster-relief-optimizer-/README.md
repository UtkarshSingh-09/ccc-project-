# 🚨 Disaster Relief Resource Optimizer

A full-stack algorithmic web application designed to maximize the impact of limited relief resources during disaster response scenarios. By leveraging **Dynamic Programming** and **Greedy Algorithms**, this tool mathematically determines the optimal distribution of supplies to affected locations and generates the most efficient delivery route.

---

## 📖 Table of Contents
1. [About The Project](#about-the-project)
2. [Why This is Beneficial](#why-this-is-beneficial)
3. [How The Algorithms Work](#how-the-algorithms-work)
4. [Input and Output](#input-and-output)
5. [Features & UI](#features--ui)
6. [Getting Started](#getting-started)

---

## 🌍 About The Project

In disaster relief (earthquakes, floods, etc.), emergency teams face a critical challenge: **How do we distribute a limited amount of resources (food, water, medicine) across multiple locations with varying severities and populations?**

Human intuition often fails to find the mathematically optimal combination when dealing with dozens of locations. This MERN-based application solves this complex problem instantly, ensuring that the maximum possible "impact" is achieved with the given resource budget, and then providing a logical delivery sequence for the trucks to follow.

---

## 💡 Why This is Beneficial

- **Maximizes Lives Saved:** Guarantees that the chosen combination of locations results in the absolute highest impact possible for the given resources. No resources are wasted.
- **Eliminates Human Error:** Removes the cognitive load from emergency commanders during high-stress situations.
- **Actionable Logistics:** Doesn't just tell you *where* to go, but tells you the *order* in which to go based on real-world strategies (Distance vs. Severity).
- **Transparent Decision Making:** The app explicitly breaks down *why* locations were selected and why others were skipped, which is crucial for post-disaster auditing and accountability.

---

## 🧠 How The Algorithms Work

The application uses a two-step algorithmic pipeline to process the data:

### 1. Dynamic Programming (The Selection Phase)
*What it does:* Solves the 0/1 Knapsack Problem.
* **Mechanism:** It evaluates every possible combination of locations against the `Total Available Resources` limit. For every location, it calculates an `Impact Score` (`People Affected × Severity`). 
* **Result:** It finds the exact subset of locations that yields the absolute maximum total impact without exceeding the resource capacity. It ensures that skipping a high-cost/low-impact location in favor of three low-cost/medium-impact locations is calculated perfectly.

### 2. Greedy Algorithm (The Routing Phase)
*What it does:* Determines the delivery sequence for the locations selected by the DP algorithm.
* **Mechanism:** It builds the route step-by-step by making the locally optimal choice at each stage. The user can toggle the Greedy strategy:
  * **Highest Severity First:** The algorithm sorts the selected locations to visit the most severely affected areas first, regardless of distance.
  * **Nearest Distance First:** The algorithm sorts the selected locations by closest distance to the base, prioritizing speed of delivery.

---

## 📥 Input and Output

### Input
The user configures the simulation by providing:
1. **Total Available Resources:** The strict capacity limit (e.g., 100 supply crates).
2. **Delivery Strategy:** The Greedy heuristic (Distance vs Severity).
3. **Affected Locations:** A list of zones. Each zone requires:
   - `Name`
   - `Need` (How many resources it consumes)
   - `Severity` (Scale of 1-10)
   - `People Affected` (Population size)
   - `Distance` (km from base)

### Output
Upon running the optimization, the system outputs:
1. **Maximized Total Impact:** The total numerical value of impact achieved.
2. **Resource Utilization:** How many resources were used out of the total capacity.
3. **Selected & Skipped Locations:** A breakdown of which locations receive aid and which do not.
4. **Delivery Route:** A mapped sequence (e.g., Base → Location B → Location A) showing the exact order trucks should follow.

---

## ✨ Features & UI

The application features a sleek, intuitive frontend designed to demystify complex algorithms:
- **Interactive Simulation Modal:** A step-by-step visualizer that walks the user through Impact Calculation → DP Selection → Greedy Routing.
- **Transparent Impact Math:** UI explicitly shows the `People × Severity` calculation for every node.
- **Color-Coded Severity Badges:** Visual indicators (Red = High, Yellow = Medium, Green = Low) for quick triage assessment.
- **Unoptimized vs Optimized Comparison:** Directly compares the DP algorithm's impact against a naive/random selection to prove the algorithm's efficiency.
- **Live Progress Bars:** Visualizes resource capacity and utilization.

---

## 🚀 Getting Started

To run this project locally, you will need two terminal windows.

### 1. Start the Backend Server
Navigate to the server directory and start the Node.js API:
```bash
cd server
node app.js
```

### 2. Start the Frontend Client
Open a second terminal, navigate to the client directory, and start the React application:
```bash
cd client
npm run dev
```

The application will run locally, and you can view it in your browser (typically at `http://localhost:5173`).
