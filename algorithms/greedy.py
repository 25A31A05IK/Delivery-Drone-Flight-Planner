
def greedy_tour(distances):
    """
    Build a delivery tour using the nearest-neighbor greedy strategy.

    Location 0 is the depot.
    None means that two locations have no safe path.

    Returns:
        (total_cost, tour), or (None, None) if no complete
        tour is possible.
    """

    n = len(distances)

    if n == 0:
        return None, None

    if any(len(row) != n for row in distances):
        raise ValueError("Distance matrix must be square")

    if any(distances[i][i] != 0 for i in range(n)):
        raise ValueError("Diagonal distances must be zero")

    if n == 1:
        return 0, [0, 0]

    visited = {0}
    tour = [0]
    current = 0
    total_cost = 0

    while len(visited) < n:
        nearest = None
        nearest_distance = None

        for location in range(1, n):
            if location in visited:
                continue

            distance = distances[current][location]

            if distance is None:
                continue

            if (
                nearest_distance is None
                or distance < nearest_distance
            ):
                nearest = location
                nearest_distance = distance

        # No unvisited location is reachable from here.
        if nearest is None:
            return None, None

        visited.add(nearest)
        tour.append(nearest)
        total_cost += nearest_distance
        current = nearest

    # The drone must return to the depot.
    return_distance = distances[current][0]

    if return_distance is None:
        return None, None

    total_cost += return_distance
    tour.append(0)

    return total_cost, tour
