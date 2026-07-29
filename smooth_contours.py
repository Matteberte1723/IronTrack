import cv2
import numpy as np
import json

# Load the original colored image
img = cv2.imread('Screenshot 2026-06-20 alle 11.03.12.png')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# We want to find ALL the neon shapes.
# The neon shapes are bright, but some (like red triceps/biceps) are darker in grayscale.
# Let's use the V channel from HSV which captures brightness regardless of color.
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
v = hsv[:, :, 2]

# Threshold the Value channel to get all bright muscles
_, thresh = cv2.threshold(v, 130, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

svg_elements = []

def smooth_contour_to_svg(cnt):
    # Simplify the contour to a reasonable number of points
    epsilon = 0.003 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    if len(approx) < 3:
        return ""
        
    pts = [pt[0] for pt in approx]
    
    # Generate smooth SVG path using Catmull-Rom to Bezier conversion or simple Quadratic Bezier
    # A simple way to smooth is to place control points halfway between points
    path_data = [f"M{pts[0][0]},{pts[0][1]}"]
    
    for i in range(len(pts)):
        p0 = pts[i]
        p1 = pts[(i + 1) % len(pts)]
        # For a truly smooth curve, we could use Q or S, but L with enough points is fine.
        # Actually, let's just make it a slightly rounded polygon:
        path_data.append(f"L{p1[0]},{p1[1]}")
        
    path_data.append("Z")
    return " ".join(path_data)

for cnt in contours:
    area = cv2.contourArea(cnt)
    if area < 100:  # Filter noise
        continue
        
    M = cv2.moments(cnt)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
    else:
        continue
        
    # Mapping logic
    muscle = "Altro"
    # Front
    if cx < 312:
        if cy < 140 and (cx < 100 or cx > 180):
            muscle = "Spalle"
        elif 100 <= cy <= 150 and 100 <= cx <= 180:
            muscle = "Petto"
        elif 140 < cy < 260 and 90 <= cx <= 185:
            muscle = "Addome"
        elif 130 < cy < 220 and (cx < 90 or cx > 180):
            muscle = "Bicipiti"
        elif 250 < cy < 370:
            muscle = "Quadricipiti"
        elif cy > 370:
            muscle = "Polpacci"
    # Back
    else:
        if cy < 100 and 460 <= cx <= 530:
            muscle = "Trapezi"
        elif 100 <= cy <= 130 and (cx < 445 or cx > 545):
            muscle = "Spalle" # Rear delts
        elif 130 < cy < 230 and (cx < 445 or cx > 545):
            muscle = "Tricipiti"
        elif 90 <= cy <= 240 and 445 <= cx <= 545:
            muscle = "Dorsali"
        elif 240 < cy < 290 and 460 <= cx <= 530:
            muscle = "Lombari"
        elif 290 <= cy < 340 and 430 <= cx <= 560:
            muscle = "Glutei"
        elif 340 <= cy < 410 and 430 <= cx <= 560:
            muscle = "Femorali"
        elif cy > 410:
            muscle = "Polpacci"
            
    # Fix Lower lats
    if muscle == "Altro" and cx > 312:
        if 160 < cy < 240: muscle = "Dorsali"
            
    # Addome fix
    if muscle == "Altro" and cx < 312:
        if cy < 250: muscle = "Addome"
            
    if muscle != "Altro":
        path = smooth_contour_to_svg(cnt)
        if path:
            svg_elements.append(f'              <path class="muscle-hotspot" data-muscle="{muscle}" d="{path}" />')

print(f"Generated {len(svg_elements)} SVG paths.")

import re
with open('main.js', 'r') as f:
    content = f.read()

pattern = re.compile(r'<!-- ===== AUTOMATIC CONTOURS ===== -->.*?</svg>', re.DOTALL)
replacement = '<!-- ===== AUTOMATIC CONTOURS ===== -->\n' + '\n'.join(svg_elements) + '\n            </svg>'
new_content = pattern.sub(replacement, content)

# Fix viewBox
new_content = new_content.replace('viewBox="0 0 625 510"', 'viewBox="0 0 624 554"')

with open('main.js', 'w') as f:
    f.write(new_content)

print("Updated main.js")
