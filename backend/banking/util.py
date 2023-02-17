from PIL import Image
import requests
from io import BytesIO

def main_image_color(url):
    response= requests.get(url)
    image = Image.open(BytesIO(response.content))
    image = image.convert('RGB')

    color_count = {}

    for x in range(0,image.size[0],10):
        for y in range(0,image.size[1],10):
            pixel = image.getpixel((x,y))
            if not (pixel[0] > 150 and pixel[1] > 150 and pixel[2] > 150):
                color_count[pixel] = color_count.get(pixel, 0) + 1


    main_color = max(color_count, key=color_count.get)
    return '#' + ''.join(f'{i:02X}' for i in main_color)