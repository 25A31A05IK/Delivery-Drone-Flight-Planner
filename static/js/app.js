
const gridElement = document.getElementById("grid");
const modeElement = document.getElementById("mode");
const selectionInfo = document.getElementById("selection-info");

const planButton = document.getElementById("plan-button");
const resetButton = document.getElementById("reset-button");
const statusElement = document.getElementById("status");
const tourElement = document.getElementById("tour");
const distanceElement = document.getElementById("distance");
const algorithmUsedElement = document.getElementById("algorithm-used");
const routeDetailsElement = document.getElementById("route-details");
const comparisonElement = document.getElementById("comparison");

const deliveryCountElement = document.getElementById("delivery-count");
const blockedCountElement = document.getElementById("blocked-count");

const summaryDeliveriesElement =
    document.getElementById("summary-deliveries");
const summaryDistanceElement =
    document.getElementById("summary-distance");
const summarySegmentsElement =
    document.getElementById("summary-segments");

// Energy settings: academic simulation assumptions.
const ENERGY_PER_MOVE_WH = 0.8;
const BATTERY_CAPACITY_WH = 100;
const BATTERY_RESERVE_PERCENT = 20;

const USABLE_BATTERY_WH =
    BATTERY_CAPACITY_WH * (1 - BATTERY_RESERVE_PERCENT / 100);

const energyConsumedElement =
    document.getElementById("energy-consumed");
const batteryUsedElement =
    document.getElementById("battery-used");
const batteryRemainingElement =
    document.getElementById("battery-remaining");
const batteryStatusElement =
    document.getElementById("battery-status");

const startAnimationButton =
    document.getElementById("start-animation");
const pauseAnimationButton =
    document.getElementById("pause-animation");
const replayAnimationButton =
    document.getElementById("replay-animation");
const simulationStatusElement =
    document.getElementById("simulation-status");

const ROWS = 8;
const COLS = 8;
const ANIMATION_SPEED = 500;

let depot = null;
let deliveries = [];
let blockedCells = new Set();

// Retains both algorithms' results for the same grid.
let previousResults = {};

let simulationPath = [];
let simulationIndex = 0;
let simulationTimer = null;
let simulationRunning = false;
let simulationPaused = false;
let plannedRouteCells = new Set();

function cellKey(row, col) {
    return `${row},${col}`;
}

function stopSimulation() {
    if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }

    simulationRunning = false;
    simulationPaused = false;

    startAnimationButton.textContent = "▶ Start Simulation";
    startAnimationButton.disabled = simulationPath.length === 0;
    pauseAnimationButton.disabled = true;
    replayAnimationButton.disabled = simulationPath.length === 0;
}

function clearRouteResults(clearComparisonHistory = true) {
    stopSimulation();

    simulationPath = [];
    simulationIndex = 0;
    plannedRouteCells = new Set();

    if (clearComparisonHistory) {
        previousResults = {};
    }

    algorithmUsedElement.textContent = "Algorithm used: —";
    tourElement.textContent = "Delivery order: —";
    distanceElement.textContent = "Total distance: —";
    comparisonElement.textContent = "";

    summaryDeliveriesElement.textContent = "—";
    summaryDistanceElement.textContent = "—";
    summarySegmentsElement.textContent = "—";

    energyConsumedElement.textContent = "—";
    batteryUsedElement.textContent = "—";
    batteryRemainingElement.textContent = "—";

    batteryStatusElement.textContent =
        "Plan a route to estimate energy and battery feasibility.";
    batteryStatusElement.className = "battery-status";

    routeDetailsElement.innerHTML =
        "<p>Plan a route to see the details.</p>";

    simulationStatusElement.textContent =
        "Simulation ready. Plan a route to begin.";
}

function renderGrid(routeCells = new Set()) {
    gridElement.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const key = cellKey(row, col);
            const cell = document.createElement("button");

            cell.type = "button";
            cell.className = "grid-cell";
            cell.dataset.row = String(row);
            cell.dataset.col = String(col);

            cell.textContent = key;
            cell.style.background = "";
            cell.style.color = "";
            cell.setAttribute("aria-label", `Cell ${key}`);

            if (depot && key === cellKey(...depot)) {
                cell.textContent = "D";
                cell.style.background = "#16a34a";
                cell.style.color = "white";
            } else {
                const deliveryIndex = deliveries.findIndex(
                    point => cellKey(...point) === key
                );

                if (deliveryIndex !== -1) {
                    cell.textContent = `P${deliveryIndex + 1}`;
                    cell.style.background = "#2563eb";
                    cell.style.color = "white";
                } else if (blockedCells.has(key)) {
                    cell.textContent = "X";
                    cell.style.background = "#dc2626";
                    cell.style.color = "white";
                } else if (routeCells.has(key)) {
                    cell.textContent = "•";
                    cell.style.background = "#bae6fd";
                    cell.style.color = "#172033";
                }
            }

            cell.dataset.originalLabel = cell.textContent;
            cell.dataset.originalBackground = cell.style.background;
            cell.dataset.originalColor = cell.style.color;

            cell.addEventListener("click", () => {
                handleCellClick(row, col);
            });

            gridElement.appendChild(cell);
        }
    }

    selectionInfo.textContent =
        `Depot: ${depot ? depot.join(",") : "not set"} | ` +
        `Deliveries: ${deliveries.length} | ` +
        `No-fly zones: ${blockedCells.size}`;

    deliveryCountElement.textContent = deliveries.length;
    blockedCountElement.textContent = blockedCells.size;
}

function handleCellClick(row, col) {
    const key = cellKey(row, col);
    const mode = modeElement.value;

    if (mode === "depot") {
        if (
            deliveries.some(point => cellKey(...point) === key) ||
            blockedCells.has(key)
        ) {
            statusElement.textContent =
                "Choose a free cell that is not a delivery point.";
            return;
        }

        depot = [row, col];

    } else if (mode === "delivery") {
        if (
            (depot && cellKey(...depot) === key) ||
            blockedCells.has(key) ||
            deliveries.some(point => cellKey(...point) === key)
        ) {
            statusElement.textContent = "Choose a different free cell.";
            return;
        }

        deliveries.push([row, col]);

    } else if (mode === "blocked") {
        if (
            (depot && cellKey(...depot) === key) ||
            deliveries.some(point => cellKey(...point) === key)
        ) {
            statusElement.textContent =
                "Remove the depot or delivery point first.";
            return;
        }

        if (blockedCells.has(key)) {
            blockedCells.delete(key);
        } else {
            blockedCells.add(key);
        }

    } else if (mode === "erase") {
        if (depot && cellKey(...depot) === key) {
            depot = null;
        }

        deliveries = deliveries.filter(
            point => cellKey(...point) !== key
        );

        blockedCells.delete(key);
    }

    clearRouteResults();

    statusElement.textContent =
        "Grid updated. Plan your route again.";

    renderGrid();
}

async function planRoute() {
    if (!depot) {
        statusElement.textContent = "Please set a depot first.";
        return;
    }

    if (deliveries.length === 0) {
        statusElement.textContent =
            "Please add at least one delivery point.";
        return;
    }

    planButton.disabled = true;
    statusElement.textContent = "Calculating the best route...";

    // Clear the displayed route but preserve the other algorithm's result.
    clearRouteResults(false);

    try {
        const grid = Array.from(
            { length: ROWS },
            (_, row) =>
                Array.from(
                    { length: COLS },
                    (_, col) =>
                        blockedCells.has(cellKey(row, col)) ? 1 : 0
                )
        );

        const locations = [depot, ...deliveries];
        const algorithm = document.getElementById("algorithm").value;

        const gridSnapshot = JSON.stringify(grid);
        const locationsSnapshot = JSON.stringify(locations);

        // Never compare results calculated for different grids or locations.
        for (const savedAlgorithm of Object.keys(previousResults)) {
            const saved = previousResults[savedAlgorithm];

            if (
                saved.grid !== gridSnapshot ||
                saved.locations !== locationsSnapshot
            ) {
                previousResults = {};
                break;
            }
        }

        const response = await fetch("/api/plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ grid, locations, algorithm })
        });

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message || "Unable to calculate the route."
            );
        }

        plannedRouteCells = new Set();

        result.route_paths.forEach(path => {
            path.forEach(cell => {
                plannedRouteCells.add(cellKey(cell[0], cell[1]));
            });
        });

        // Build the drone's continuous route without duplicating segment joins.
        simulationPath = [];

        result.route_paths.forEach((path, index) => {
            path.forEach((cell, cellIndex) => {
                if (index === 0 || cellIndex > 0) {
                    simulationPath.push(cell);
                }
            });
        });

        simulationIndex = 0;

        startAnimationButton.textContent = "▶ Start Simulation";
        startAnimationButton.disabled = simulationPath.length === 0;
        pauseAnimationButton.disabled = true;
        replayAnimationButton.disabled = simulationPath.length === 0;

        simulationStatusElement.textContent =
            "Route ready. Click Start Simulation.";

        renderGrid(plannedRouteCells);

        algorithmUsedElement.textContent =
            `Algorithm used: ${
                result.algorithm === "held_karp"
                    ? "Held–Karp (Optimal)"
                    : "Greedy (Fast)"
            }`;

        tourElement.textContent =
            "Delivery order: " +
            result.tour.map(index =>
                index === 0 ? "Depot" : `Delivery ${index}`
            ).join(" → ");

        distanceElement.textContent =
            `Total distance: ${result.total_distance} grid moves`;

        summaryDeliveriesElement.textContent = deliveries.length;
        summaryDistanceElement.textContent =
            `${result.total_distance} moves`;
        summarySegmentsElement.textContent = result.tour.length - 1;

        // ENERGY ESTIMATION
        // total_distance includes the journey back to the depot.
        const energyConsumedWh =
            result.total_distance * ENERGY_PER_MOVE_WH;

        const batteryUsedPercent =
            (energyConsumedWh / BATTERY_CAPACITY_WH) * 100;

        const batteryRemainingPercent =
            Math.max(0, 100 - batteryUsedPercent);

        energyConsumedElement.textContent =
            `${energyConsumedWh.toFixed(2)} Wh`;

        batteryUsedElement.textContent =
            `${batteryUsedPercent.toFixed(1)}%`;

        batteryRemainingElement.textContent =
            `${batteryRemainingPercent.toFixed(1)}%`;

        if (energyConsumedWh <= USABLE_BATTERY_WH) {
            batteryStatusElement.textContent =
                `Feasible under this estimate. ` +
                `${BATTERY_RESERVE_PERCENT}% reserve is preserved.`;

            batteryStatusElement.className =
                "battery-status battery-ok";
        } else {
            batteryStatusElement.textContent =
                `Battery limit exceeded: estimated use is above ` +
                `${USABLE_BATTERY_WH.toFixed(1)} Wh usable energy.`;

            batteryStatusElement.className =
                "battery-status battery-warning";
        }

        // Display each route segment.
        routeDetailsElement.innerHTML = "";

        result.route_paths.forEach((path, index) => {
            const fromIndex = result.tour[index];
            const toIndex = result.tour[index + 1];

            const from = fromIndex === 0
                ? "Depot"
                : `Delivery ${fromIndex}`;

            const to = toIndex === 0
                ? "Depot"
                : `Delivery ${toIndex}`;

            const paragraph = document.createElement("p");
            const heading = document.createElement("strong");

            heading.textContent = `${from} → ${to}: `;
            paragraph.appendChild(heading);

            paragraph.appendChild(
                document.createTextNode(
                    path.map(cell => `(${cell[0]}, ${cell[1]})`).join(" → ")
                )
            );

            routeDetailsElement.appendChild(paragraph);
        });

        // Preserve the result for comparing both algorithms on this same grid.
        previousResults[result.algorithm] = {
            distance: result.total_distance,
            locations: locationsSnapshot,
            grid: gridSnapshot
        };

        const heldKarpResult = previousResults.held_karp;
        const greedyResult = previousResults.greedy;

        if (
            heldKarpResult &&
            greedyResult &&
            heldKarpResult.locations === locationsSnapshot &&
            greedyResult.locations === locationsSnapshot &&
            heldKarpResult.grid === gridSnapshot &&
            greedyResult.grid === gridSnapshot
        ) {
            const difference =
                greedyResult.distance - heldKarpResult.distance;

            let comparisonMessage;

            if (difference > 0) {
                comparisonMessage =
                    `Greedy used ${difference} more grid moves than Held–Karp.`;
            } else if (difference < 0) {
                comparisonMessage =
                    `Greedy used ${Math.abs(difference)} fewer grid moves than Held–Karp.`;
            } else {
                comparisonMessage =
                    "Both algorithms found routes with the same distance.";
            }

            const heldKarpEnergy =
                heldKarpResult.distance * ENERGY_PER_MOVE_WH;

            const greedyEnergy =
                greedyResult.distance * ENERGY_PER_MOVE_WH;

            comparisonElement.textContent =
                `Held–Karp: ${heldKarpResult.distance} moves ` +
                `(${heldKarpEnergy.toFixed(2)} Wh) | ` +
                `Greedy: ${greedyResult.distance} moves ` +
                `(${greedyEnergy.toFixed(2)} Wh). ` +
                comparisonMessage;
        } else {
            comparisonElement.textContent =
                "Run the other algorithm on the same grid to compare results.";
        }

        statusElement.textContent = "Route planned successfully!";

    } catch (error) {
        // Do not erase an earlier successful result if the other algorithm fails.
        clearRouteResults(false);
        renderGrid();

        statusElement.textContent = `Error: ${error.message}`;
    } finally {
        planButton.disabled = false;
    }
}

function moveDrone() {
    if (simulationIndex >= simulationPath.length) {
        if (simulationTimer !== null) {
            clearInterval(simulationTimer);
            simulationTimer = null;
        }

        simulationRunning = false;
        simulationPaused = false;

        startAnimationButton.textContent = "▶ Start Simulation";
        startAnimationButton.disabled = true;
        pauseAnimationButton.disabled = true;
        replayAnimationButton.disabled = false;

        simulationStatusElement.textContent =
            "Simulation complete! The drone returned to the depot.";
        return;
    }

    renderGrid(plannedRouteCells);

    const [row, col] = simulationPath[simulationIndex];

    const currentCell = gridElement.querySelector(
        `.grid-cell[data-row="${row}"][data-col="${col}"]`
    );

    if (currentCell) {
        currentCell.classList.add("drone-current");
        currentCell.textContent =
            `${currentCell.dataset.originalLabel} 🚁`;

        currentCell.setAttribute(
            "aria-label",
            `Drone at row ${row}, column ${col}`
        );
    }

    simulationStatusElement.textContent =
        `Drone position: row ${row}, column ${col} ` +
        `(${simulationIndex + 1} of ${simulationPath.length})`;

    simulationIndex++;
}

function startSimulation() {
    if (simulationPath.length === 0) {
        simulationStatusElement.textContent =
            "Please plan a route first.";
        return;
    }

    if (simulationRunning) {
        return;
    }

    if (simulationIndex >= simulationPath.length) {
        simulationIndex = 0;
    }

    simulationRunning = true;
    simulationPaused = false;

    startAnimationButton.textContent = "▶ Start Simulation";
    startAnimationButton.disabled = true;
    pauseAnimationButton.disabled = false;
    replayAnimationButton.disabled = true;

    moveDrone();
    simulationTimer = setInterval(moveDrone, ANIMATION_SPEED);
}

function pauseSimulation() {
    if (!simulationRunning) {
        return;
    }

    if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }

    simulationRunning = false;
    simulationPaused = true;

    startAnimationButton.textContent = "▶ Resume Simulation";
    startAnimationButton.disabled = false;
    pauseAnimationButton.disabled = true;
    replayAnimationButton.disabled = false;

    simulationStatusElement.textContent =
        "Simulation paused. Click Resume Simulation to continue.";
}

function replaySimulation() {
    if (simulationPath.length === 0) {
        simulationStatusElement.textContent =
            "Please plan a route first.";
        return;
    }

    if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }

    simulationIndex = 0;
    simulationRunning = false;
    simulationPaused = false;

    renderGrid(plannedRouteCells);

    simulationStatusElement.textContent = "Replaying route...";
    startSimulation();
}

function resetGrid() {
    if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }

    depot = null;
    deliveries = [];
    blockedCells.clear();
    previousResults = {};

    simulationPath = [];
    simulationIndex = 0;
    plannedRouteCells = new Set();
    simulationRunning = false;
    simulationPaused = false;

    algorithmUsedElement.textContent = "Algorithm used: —";
    tourElement.textContent = "Delivery order: —";
    distanceElement.textContent = "Total distance: —";
    comparisonElement.textContent = "";

    summaryDeliveriesElement.textContent = "—";
    summaryDistanceElement.textContent = "—";
    summarySegmentsElement.textContent = "—";

    energyConsumedElement.textContent = "—";
    batteryUsedElement.textContent = "—";
    batteryRemainingElement.textContent = "—";

    batteryStatusElement.textContent =
        "Plan a route to estimate energy and battery feasibility.";
    batteryStatusElement.className = "battery-status";

    routeDetailsElement.innerHTML =
        "<p>Plan a route to see the details.</p>";

    statusElement.textContent =
        "Grid reset. Ready to plan a new route.";

    simulationStatusElement.textContent =
        "Simulation ready. Plan a route to begin.";

    startAnimationButton.textContent = "▶ Start Simulation";
    startAnimationButton.disabled = true;
    pauseAnimationButton.disabled = true;
    replayAnimationButton.disabled = true;

    renderGrid();
}

planButton.addEventListener("click", planRoute);
resetButton.addEventListener("click", resetGrid);
startAnimationButton.addEventListener("click", startSimulation);
pauseAnimationButton.addEventListener("click", pauseSimulation);
replayAnimationButton.addEventListener("click", replaySimulation);

startAnimationButton.disabled = true;
pauseAnimationButton.disabled = true;
replayAnimationButton.disabled = true;

renderGrid();
