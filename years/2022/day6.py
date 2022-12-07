#%%
from aocd.models import Puzzle

puzzle = Puzzle(year=2022, day=6)

# data = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"  # q1 7 q2 19
# data = "bvwbjplbgvbhsrlpgdmjqwftvncz"  # q1 5 q2 23
# data = "nppdvjthqldpwncqszvftbrmjlhg"  # q1 6 q2 23
# data = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"  # q1 10 q2 29
# data = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"  # q1 11 q2 26
data = puzzle.input_data


def find_marker(length: int):
    i = 0
    while i < len(data) - length:
        chunk = data[i : i + length]
        # print(f"chunk {chunk}, {set(chunk)}")
        i += 1
        if len(set(chunk)) == length:
            break
    return i + length - 1


#%% Question1
print(f"Question1 {find_marker(4)}")
#%% Question2
print(f"Question2 {find_marker(14)}")
