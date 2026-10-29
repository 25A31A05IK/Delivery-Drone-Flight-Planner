
from algorithms.distance_matrix import build_distance_matrix


def test_open_grid():
    grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    locations = [(0, 0), (0, 2), (2, 2)]
    distances = build_distance_matrix(grid, locations)

    assert distances == [
        [0, 2, 4],
        [2, 0, 2],
        [4, 2, 0]
    ]


def test_unreachable_location():
    grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]

    locations = [(0, 0), (0, 2)]
    distances = build_distance_matrix(grid, locations)

    assert distances[0][0] == 0
    assert distances[1][1] == 0
    assert distances[0][1] is None
    assert distances[1][0] is None


if __name__ == "__main__":
    test_open_grid()
    test_unreachable_location()

    print("All distance matrix tests passed!")
