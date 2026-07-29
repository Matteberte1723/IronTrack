import json

with open('muscle_paths.json', 'r') as f:
    data = json.load(f)

svg_elements = []

for d in data:
    if d['area'] < 200: continue
    
    cx, cy, path = d['cx'], d['cy'], d['path']
    muscle = "Altro"
    
    # Front
    if cx < 312:
        if cy < 130 and (cx < 100 or cx > 180):
            muscle = "Spalle"
        elif 100 <= cy <= 140 and 100 <= cx <= 180:
            muscle = "Petto"
        elif 140 < cy < 260 and 90 <= cx <= 185:
            muscle = "Addome"
        elif 130 < cy < 220 and cx < 90:
            muscle = "Bicipiti"
        elif 130 < cy < 220 and cx > 180:
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
            
    # Add an exception for lower lats which might be wide
    if muscle == "Altro" and cx > 312:
        if 160 < cy < 240:
            muscle = "Dorsali"
            
    # Also some front muscles might slip
    if muscle == "Altro" and cx < 312:
        if cy < 250:
            muscle = "Addome"
            
    if muscle != "Altro":
        svg_elements.append(f'              <path class="muscle-hotspot" data-muscle="{muscle}" d="{path}" />')

print(f"Generated {len(svg_elements)} SVG paths.")

import re
with open('main.js', 'r') as f:
    content = f.read()

# Replace everything between <!-- ===== FRONT SIDE (left half, body centered ~150) ===== --> and </svg>
pattern = re.compile(r'<!-- ===== FRONT SIDE \(left half, body centered ~150\) ===== -->.*?</svg>', re.DOTALL)

replacement = '<!-- ===== AUTOMATIC CONTOURS ===== -->\n' + '\n'.join(svg_elements) + '\n            </svg>'

new_content = pattern.sub(replacement, content)
with open('main.js', 'w') as f:
    f.write(new_content)

print("Updated main.js")

