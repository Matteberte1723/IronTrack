import cv2
import json
import numpy as np

img = cv2.imread('Screenshot 2026-06-20 alle 11.03.12.png')

with open('muscle_paths.json', 'r') as f:
    data = json.load(f)

for i, region in enumerate(data):
    if region['area'] < 500: # Filter small noise
        continue
    cx, cy = region['cx'], region['cy']
    cv2.putText(img, str(i), (cx, cy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
cv2.imwrite('public/debug_map.png', img)
