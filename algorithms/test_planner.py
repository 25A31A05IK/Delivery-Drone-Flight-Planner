
from algorithms.planner import plan_delivery


def test_held_karp_plan():
    grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    locations = [
        [0, 0],  # Depot
        [0, 2],  # Delivery 1
        [2, 2]   # Delivery 2
    ]

    result = plan_delivery(grid, locations, "held_karp")

    assert result["status"] == "success"
    assert result["total_distance"] == 8
    assert result["tour"][0] == 0
    assert result["tour"][-1] == 0
    assert len(result["route_paths"]) == 3


def test_greedy_plan():
    grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    locations = [
        [0, 0],
        [0, 2],
        [2, 2]
    ]

    result = plan_delivery(grid, locations, "greedy")

    assert result["status"] == "success"
    assert result["total_distance"] == 8


if __name__ == "__main__":
    test_held_karp_plan()
    test_greedy_plan()

    print("All planner tests passed!")
