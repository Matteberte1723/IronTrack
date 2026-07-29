import cv2
import numpy as np
import json

img = cv2.imread('Screenshot 2026-06-20 alle 11.03.12.png')
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
s = hsv[:,:,1]

# Threshold saturation to find colored regions
_, thresh = cv2.threshold(s, 50, 255, cv2.THRESH_BINARY)

# Morphological operations to clean up
kernel = np.ones((5,5), np.uint8)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

# Save the threshold image to check
cv2.imwrite('public/thresh.png', thresh)

contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

paths = []
for cnt in contours:
    area = cv2.contourArea(cnt)
    if area < 500:
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

print(f"Found {len(paths)} muscle regions via saturation")
with open('muscle_paths_sat.json', 'w') as f:
    json.dump(paths, f)
    
