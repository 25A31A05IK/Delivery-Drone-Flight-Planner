
def held_karp(distances):
    """
    Find the shortest tour starting and ending at location 0.

    distances[i][j] is the travel distance from i to j.
    Location 0 is the depot.

    Returns:
        (minimum_cost, tour)
        tour is a list of location indices.
        Returns (None, None) if no complete tour exists.
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

    # A state is (visited_mask, last_location).
    # The value stores the minimum cost to reach that state.
    dp = {(1, 0): 0}

    # Store previous locations to reconstruct the optimal tour.
    parent = {}

    # Iterate through all subsets of locations.
    for mask in range(1 << n):

        # The depot must be included in every valid state.
        if not (mask & 1):
            continue

        for last in range(n):

            state = (mask, last)

            if state not in dp:
                continue

            current_cost = dp[state]

            # Try visiting every unvisited location.
            for nxt in range(1, n):

                if mask & (1 << nxt):
                    continue

                distance = distances[last][nxt]

                # None means no safe path exists.
                if distance is None:
                    continue

                new_mask = mask | (1 << nxt)
                new_state = (new_mask, nxt)
                new_cost = current_cost + distance

                if (
                    new_state not in dp
                    or new_cost < dp[new_state]
                ):
                    dp[new_state] = new_cost
                    parent[new_state] = last

    # All locations must have been visited.
    full_mask = (1 << n) - 1
    best_cost = None
    best_last = None

    # Return from the final location to the depot.
    for last in range(1, n):
        state = (full_mask, last)

        if state not in dp:
            continue

        return_distance = distances[last][0]

        if return_distance is None:
            continue

        total_cost = dp[state] + return_distance

        if best_cost is None or total_cost < best_cost:
            best_cost = total_cost
            best_last = last

    if best_last is None:
        return None, None

    # Reconstruct the route backwards.
    reverse_tour = []
    mask = full_mask
    last = best_last

    while last != 0:
        reverse_tour.append(last)
        previous = parent[(mask, last)]
        mask ^= (1 << last)
        last = previous

    reverse_tour.append(0)
    tour = list(reversed(reverse_tour))
    tour.append(0)

    return best_cost, tour
