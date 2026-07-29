import cv2
import numpy as np
import json

img = cv2.imread('Screenshot 2026-06-20 alle 11.03.12.png')
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Define color ranges
# Green
lower_green = np.array([35, 50, 50])
upper_green = np.array([85, 255, 255])
mask_green = cv2.inRange(hsv, lower_green, upper_green)

# Yellow
lower_yellow = np.array([20, 50, 50])
upper_yellow = np.array([35, 255, 255])
mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)

# Red
lower_red1 = np.array([0, 50, 50])
upper_red1 = np.array([10, 255, 255])
mask_red1 = cv2.inRange(hsv, lower_red1, upper_red1)
lower_red2 = np.array([170, 50, 50])
upper_red2 = np.array([180, 255, 255])
mask_red2 = cv2.inRange(hsv, lower_red2, upper_red2)
mask_red = cv2.bitwise_or(mask_red1, mask_red2)

# Combine masks
mask = cv2.bitwise_or(mask_green, mask_yellow)
mask = cv2.bitwise_or(mask, mask_red)

# Find contours
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

paths = []
for cnt in contours:
    area = cv2.contourArea(cnt)
    if area < 100:
        continue
        
    epsilon = 0.005 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    path_data = []
    for i, pt in enumerate(approx):
        x, y = pt[0]
        if i == 0:
            path_data.append(f"M{x},{y}")
        else:
            path_data.append(f"L{x},{y}")
    path_data.append("Z")
    
    M = cv2.moments(cnt)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
    else:
        cx, cy = 0, 0
        
    paths.append({"path": " ".join(path_data), "cx": cx, "cy": cy, "area": area})

print(f"Found {len(paths)} muscle regions via HSV colors")
with open('muscle_paths_color.json', 'w') as f:
    json.dump(paths, f)

