#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional, Tuple, Set, Callable
from collections import deque, namedtuple
import copy
from parse import parse
import numpy as np
import math
from functools import cmp_to_key, reduce
import Polygon

puzzle = Puzzle(year=2022, day=15)

# data = puzzle.example_data
data = puzzle.input_data

test_row_pos = {}
test_row = 2000000
# test_row = 10

SensorBecon = namedtuple("sensor_becon", ["s_x", "s_y", "b_x", "b_y", "dist"])


sensor_becon_list: List[SensorBecon] = []

positions = {}


min_x = 1000000000
min_y = 1000000000
max_x = -100000000
max_y = -100000000


def display():

    print("----------------------------------")
    for i in range(min_y, max_y):
        for j in range(min_x, max_x):
            if (j, i) in positions:
                print(positions[(j, i)], end="")
            else:
                print(" ", end="")
        print()


for l in data.splitlines():
    template = (
        "Sensor at x={s_x:d}, y={s_y:d}: closest beacon is at x={b_x:d}, y={b_y:d}"
    )
    result = parse(template, l).named
    m_dist = abs(result["s_x"] - result["b_x"]) + abs(result["s_y"] - result["b_y"])
    val = SensorBecon(**{**result, "dist": m_dist})

    min_x = min(min_x, val.s_x - val.dist)
    max_x = max(max_x, val.s_x + val.dist)
    min_y = min(min_y, val.s_y - val.dist)
    max_y = max(max_y, val.s_y + val.dist)

    sensor_becon_list.append(val)


def check_val(sb: SensorBecon, y: int):
    return sb.s_y - sb.dist <= y <= sb.s_y + sb.dist


def get_x_positions_from_row(row: int, sb: SensorBecon):
    dist_x = sb.dist - abs(sb.s_y - row)
    return (sb.s_x - dist_x, sb.s_x + dist_x)


filtered_sensor_positions = list(
    filter(lambda sb: check_val(sb, test_row), sensor_becon_list)
)
print(filtered_sensor_positions)
x_positions = list(
    map(lambda sb: get_x_positions_from_row(test_row, sb), filtered_sensor_positions)
)
x_positions.sort(key=lambda x: x[0])
intersected_ranges = []
x_deque = deque(x_positions)


def intersection(r1: Tuple[int, int], r2: Tuple[int, int]):
    return r2[0] <= r1[1]


max_intersect = -10000000000
while x_deque:
    r2 = x_deque.popleft()

    if len(intersected_ranges) == 0:
        intersected_ranges.append(r2)
    else:
        intersected = False
        for i, r1 in enumerate(intersected_ranges):

            if intersection(r1, r2):
                r1 = min(r1[0], r2[0]), max(r1[1], r2[1])
                intersected_ranges[i] = r1
                max_intersect = max(max_intersect, r1[1])
                intersected = True

        if not intersected:
            intersected_ranges.append(r2)


# Now sum intersected ranges
sum_ranges = 0
for i in intersected_ranges:
    sum_ranges += i[1] - i[0]

print(f"Question 1 {sum_ranges}")


def get_perimeter_polygon_from_point(sb: SensorBecon) -> Polygon.Polygon:

    return Polygon.Polygon(
        (
            (sb.s_x, sb.s_y + sb.dist),
            (sb.s_x + sb.dist, sb.s_y),
            (sb.s_x, sb.s_y - sb.dist),
            (sb.s_x - sb.dist, sb.s_y),
        )
    )


# Turn the becon list into polygons
polygons = list(map(get_perimeter_polygon_from_point, sensor_becon_list))
# Add all of them together, will return a list of contours
shapes = list(reduce(lambda x, y: x + y, polygons))

# Hack for hole contour as it will be the only one with only 4 elements
shape = list(filter(lambda x: len(x) == 4, shapes))[0]

hole_top = -10000000000
hole_bottom = 1000000000
hole_left = 10000000000
hole_right = -1000000000

for i in shape:
    x, y = i
    hole_top = max(hole_top, y)
    hole_bottom = min(hole_bottom, y)
    hole_left = min(hole_left, x)
    hole_right = max(hole_right, x)

hole_y, hole_x = int(hole_bottom + (hole_top - hole_bottom) / 2), int(
    hole_left + (hole_right - hole_left) / 2
)

tuning_frequency = 4000000 * hole_x + hole_y
print(f"Question 2 {tuning_frequency}")
