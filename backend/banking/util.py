from PIL import Image
import requests
from io import BytesIO

# Returns the dominant color in an image from a url
def main_image_color(url):
    response= requests.get(url)
    rgba_image = Image.open(BytesIO(response.content))

    rgb_image = Image.new("RGB", rgba_image.size, (255, 255, 255))
    rgb_image.paste(rgba_image, mask=rgba_image.split()[3])

    image = rgb_image

    color_count = {}

    for x in range(0,image.size[0],10):
        for y in range(0,image.size[1],10):
            pixel = image.getpixel((x,y))
            # Ignore colors close to white
            if not (pixel[0] > 150 and pixel[1] > 150 and pixel[2] > 150):
                color_count[pixel] = color_count.get(pixel, 0) + 1

    # If no non white colors, return greyish color
    if len(color_count) == 0:
        return '#BEBEBE'
    
    main_color = max(color_count, key=color_count.get)
    return '#' + ''.join(f'{i:02X}' for i in main_color)