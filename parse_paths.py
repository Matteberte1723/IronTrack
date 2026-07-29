import json

with open('muscle_paths.json', 'r') as f:
    data = json.load(f)

# Sort by x coordinate, then y coordinate
filtered = [
    (i, d['cx'], d['cy'], int(d['area']))
    for i, d in enumerate(data)
    if d['area'] > 200  # filter out text and lines
]

for i, cx, cy, area in filtered:
    side = "FRONT (Left)" if cx < 312 else "BACK (Right)"
    print(f"Index {i:2d}: {side:12s} | Center: ({cx:3d}, {cy:3d}) | Area: {area}")

