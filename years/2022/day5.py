#%%
from aocd.models import Puzzle
from typing import Dict, List
import copy
from parse import parse

puzzle = Puzzle(year=2022, day=5)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()

stacks: Dict[int, List[str]] = {}

end_stacks = 0
for pos, line in enumerate(data):
    if line.startswith(" 1"):
        end_stacks = pos
        break

    # Loop through each line and split by the 4th element
    for i in range(0, len(line), 4):
        char = line[int(i) : int(i + 4)]
        if "[" in char:
            if (int(i / 4) + 1) in stacks:
                stacks[int(i / 4) + 1].insert(0, char[1])
            else:
                stacks[int(i / 4) + 1] = [char[1]]

stacks2 = copy.deepcopy(stacks)

instructions_start = end_stacks + 2
#%% Question 1
for i in range(instructions_start, len(data)):
    num_crates, crate_from, crate_to = parse(
        "move {:d} from {:d} to {:d}", data[i]
    ).fixed
    stacks[crate_to].extend(stacks[crate_from][-1 * num_crates :][::-1])
    del stacks[crate_from][-1 * num_crates :]

    # print(stacks)

# Get output
stack_keys: List[str] = list(stacks.keys())
stack_keys.sort()

stack_str = ""
for key in stack_keys:
    stack_str += stacks[key][-1]

print(f"Question 1 Output:\n{stack_str}")

# %% Question2
for i in range(instructions_start, len(data)):

    num_crates, crate_from, crate_to = parse(
        "move {:d} from {:d} to {:d}", data[i]
    ).fixed

    stacks2[crate_to].extend(stacks2[crate_from][-1 * num_crates :])
    del stacks2[crate_from][-1 * num_crates :]

stack_keys: List[str] = list(stacks2.keys())
stack_keys.sort()

stack_str = ""
for key in stack_keys:
    stack_str += stacks2[key][-1]

print(f"Question 2 Output:\n{stack_str}")
