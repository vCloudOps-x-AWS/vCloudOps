from PIL import Image
import glob
import os

for path in glob.glob("public/gallery/real-*.png"):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # Since these are full desktop screenshots of Google Drive preview:
    # Left/Right margins are wide (Google Drive sidebars)
    # Top margin has browser tabs, url bar, drive toolbar
    # Bottom margin has Windows taskbar and drive bottom bar
    
    left = int(w * 0.175)
    right = int(w * 0.825)
    top = int(h * 0.25)
    bottom = int(h * 0.85)
    
    cropped = img.crop((left, top, right, bottom))
    cropped.save(path)
    print(f"Cropped {path} from {w}x{h} to {cropped.width}x{cropped.height}")
