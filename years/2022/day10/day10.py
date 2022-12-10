#%%
from __future__ import annotations
import os


from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse
import numpy as np

dir_path = os.path.dirname(os.path.realpath(__file__))


example1 = os.path.join(dir_path, "example1.txt")
example2 = os.path.join(dir_path, "example2.txt")
input_data = os.path.join(dir_path, "input_data.txt")


data = []
with open(input_data, "r") as f:
    data = f.read().splitlines()

X_reg = 1
instuction_count = 0

save_instructions = {}


for l in data:
    if "noop" in l:
        instuction_count += 1
        save_instructions[instuction_count] = X_reg
    else:
        command, val = l.split(" ")
        instuction_count += 1
        save_instructions[instuction_count] = X_reg
        instuction_count += 1
        save_instructions[instuction_count] = X_reg
        X_reg += int(val)

# %%
cycles = [20, 60, 100, 140, 180, 220]

print(
    f"Question 1 {sum(list(map(lambda cycle: save_instructions[cycle]*cycle,cycles)))}"
)

print()
ordered_keys = list(save_instructions.keys())
ordered_keys.sort()
draw_pos = 0
for cycle in ordered_keys:
    sprite_mid = save_instructions[cycle]
    sprite = [sprite_mid - 1, sprite_mid, sprite_mid + 1]
    if draw_pos in sprite:
        print("#", end="")
    else:
        print(" ", end="")
    draw_pos += 1
    if draw_pos == 40:
        draw_pos = 0
        print()
