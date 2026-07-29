import cv2
import numpy as np

# Load original image
img = cv2.imread('Screenshot 2026-06-20 alle 11.03.12.png')
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Create a desaturated base image
# We can just convert to grayscale and back to BGR, but maybe we want to keep some blueish background tint?
# Let's just make it grayscale to be clean.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

# Dim it slightly so the colored overlays pop more
base_img = cv2.convertScaleAbs(gray_bgr, alpha=0.6, beta=0)
cv2.imwrite('public/muscle-map.png', base_img)

# Now, extract contours of the glowing regions (green, yellow, red)
# Let's use a threshold on the saturation and value to find the colored glowing areas
# Or even better, threshold on the original grayscale if the glowing parts are the brightest
_, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

svg_paths = []
for cnt in contours:
    # Ignore small noise
    if cv2.contourArea(cnt) < 100:
        continue
        
    # Simplify contour
    epsilon = 0.005 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    # Create SVG path
    path_data = []
    for i, pt in enumerate(approx):
        x, y = pt[0]
        if i == 0:
            path_data.append(f"M{x},{y}")
        else:
            path_data.append(f"L{x},{y}")
    path_data.append("Z")
    
    # Calculate center to help identify the muscle
    M = cv2.moments(cnt)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
    else:
        cx, cy = 0, 0
        
    svg_paths.append({
        "path": " ".join(path_data),
        "cx": cx,
        "cy": cy,
        "area": cv2.contourArea(cnt)
    })

print(f"Found {len(svg_paths)} muscle regions")
import json
with open('muscle_paths.json', 'w') as f:
    json.dump(svg_paths, f)

