#%%
from __future__ import annotations
from aocd.models import Puzzle
from typing import Dict, List, Optional
import copy
from parse import parse

puzzle = Puzzle(year=2022, day=7)

# data = puzzle.example_data.splitlines()
data = puzzle.input_data.splitlines()


class Directory:
    directories: Dict[str, Directory] = {}
    parent: Optional[Directory]
    size: int = 0

    def __init__(self, name: str, parent: Optional[Directory]) -> Directory:
        self.parent = parent
        self.name = name
        self.directories = {}

    def add_file_size(self, size: int):
        self.size += size
        if self.parent != None:
            self.parent.add_file_size(size)

    def get_flat_dir_size(self, dirs: List[Directory]):

        dirs.append(self.size)
        for dir in self.directories.values():
            dir.get_flat_dir_size(dirs)
        return dirs


# Create the top level directory
top = Directory("top", None)
# Set initial directory to top
current_dir: Directory = top
# Read in the commands and form te data structure
for l in data[2:]:
    if "dir" in l:
        command, dir_name = l.split(" ")
        current_dir.directories[dir_name] = Directory(dir_name, current_dir)
    elif l[0] == "$":
        if l[2:4] == "cd":
            cd, command = l[2:].split(" ")
            if command == "..":
                current_dir = current_dir.parent
            else:
                current_dir = current_dir.directories[command]
        else:
            pass
    else:
        size_st, f_name = l.split(" ")
        current_dir.add_file_size(int(size_st))


# Evaluate the size of all directories
complete_size = top.size
# Get a list of the size of all the directories
flat_dirs = top.get_flat_dir_size([])
#%% Question 1
print(f"Question1  {sum(filter(lambda x:x<=100000,flat_dirs))}")
#%% Question2
full_space = 70000000
unused_space = full_space - complete_size

needed_space = 30000000 - unused_space
print(f"Question2  {min(filter(lambda x: x >= needed_space, flat_dirs))}")
