
from algorithms.held_karp import held_karp


def test_three_locations():
    distances = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0]
    ]

    cost, tour = held_karp(distances)

    assert cost == 80
    assert tour[0] == 0
    assert tour[-1] == 0
    assert sorted(tour[1:-1]) == [1, 2, 3]


def test_unreachable_tour():
    distances = [
        [0, 2, None],
        [2, 0, None],
        [None, None, 0]
    ]

    cost, tour = held_karp(distances)

    assert cost is None
    assert tour is None


def test_depot_only():
    cost, tour = held_karp([[0]])

    assert cost == 0
    assert tour == [0, 0]


if __name__ == "__main__":
    test_three_locations()
    test_unreachable_tour()
    test_depot_only()

    print("All Held-Karp tests passed!")
