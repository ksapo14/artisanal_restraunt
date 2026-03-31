from PIL import Image
import numpy as np

def remove_white_pixels_fast(input_path, output_path, threshold=200):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Create a mask where all RGB channels are above the threshold
    white_mask = (data[:, :, 0] >= threshold) & \
                 (data[:, :, 1] >= threshold) & \
                 (data[:, :, 2] >= threshold)

    # Set alpha to 0 for those pixels
    data[white_mask, 3] = 0

    result = Image.fromarray(data)
    result.save(output_path, "PNG")

def remove_white_and_yellow_pixels(input_path, output_path, threshold=240):
    img = Image.open(input_path).convert("RGBA")
    rgba_data = np.array(img)

    # Check white in RGBA
    r, g, b = rgba_data[:, :, 0], rgba_data[:, :, 1], rgba_data[:, :, 2]
    white_mask = (r >= threshold) & (g >= threshold) & (b >= threshold)

    # Check yellow in HSV (catches a broader range of yellows)
    hsv = np.array(img.convert("RGB").convert("HSV"))
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    # Hue ~30-45 in Pillow's 0-255 scale corresponds to yellow (0-360 → 0-255)
    yellow_mask = (h >= 28) & (h <= 48) & (s >= 80) & (v >= 80)

    combined_mask = white_mask | yellow_mask
    rgba_data[combined_mask, 3] = 0

    Image.fromarray(rgba_data).save(output_path, "PNG")

def replace_black_with_white(input_path, output_path, threshold=15):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    black_mask = (r <= threshold) & (g <= threshold) & (b <= threshold) & (a > 0)

    data[black_mask, 0] = 255  # R
    data[black_mask, 1] = 255  # G
    data[black_mask, 2] = 255  # B

    Image.fromarray(data).save(output_path, "PNG")

replace_black_with_white(r"C:\Users\kcsap\OneDrive\Desktop\artisanal_restraunt\src\assets\artisanal_logo_high_res_nobg.jpeg", r"C:\Users\kcsap\OneDrive\Desktop\artisanal_restraunt\src\assets\artisanal_logo_high_res_nobg.jpeg", threshold=100)