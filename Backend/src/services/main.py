
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import requests
import io

app = FastAPI()

# ---------------- COLOR DATABASE ----------------

COLOR_DB = {
"black": (0,0,0),
"white": (255,255,255),
"grey": (128,128,128),
"navy": (0,0,128),
"blue": (0,0,255),
"green": (0,128,0),
"olive": (128,128,0),
"teal": (0,128,128),
"red": (255,0,0),
"maroon": (128,0,0),
"pink": (255,192,203),
"yellow": (255,255,0),
"mustard": (255,219,88),
"orange": (255,165,0),
"brown": (139,69,19),
"beige": (245,245,220),
"purple": (128,0,128)
}

COLOR_FAMILY = {

"black":"neutral",
"white":"neutral",
"grey":"neutral",
"navy":"neutral",
"beige":"neutral",

"brown":"warm",
"olive":"warm",
"maroon":"warm",
"mustard":"warm",
"orange":"warm",

"blue":"cool",
"green":"cool",
"teal":"cool",
"purple":"cool",

"red":"bright",
"pink":"bright",
"yellow":"bright"
}

# ---------------- UTIL FUNCTIONS ----------------

def closest_color(rgb):

    min_dist = float("inf")
    best_color = None

    for name, ref_rgb in COLOR_DB.items():

        dist = np.linalg.norm(np.array(rgb) - np.array(ref_rgb))

        if dist < min_dist:
            min_dist = dist
            best_color = name

    return best_color


def get_color_family(color):
    return COLOR_FAMILY.get(color,"neutral")


# ---------------- LOAD IMAGE ----------------

def load_image(url):

    response = requests.get(url)

    if response.status_code != 200:
        raise ValueError("Image download failed")

    img = Image.open(io.BytesIO(response.content)).convert("RGB")

    return np.array(img)


# ---------------- PIXEL SAMPLING ----------------

def sample_pixels(img):

    h, w, _ = img.shape

    # take center area (clothes usually in middle)
    crop = img[int(h*0.2):int(h*0.8), int(w*0.2):int(w*0.8)]

    pixels = crop.reshape((-1,3))

    # random sample for speed
    if len(pixels) > 5000:
        idx = np.random.choice(len(pixels), 5000, replace=False)
        pixels = pixels[idx]

    return pixels


# ---------------- COLOR DETECTION ----------------

def detect_clothing_color(image_url, k=4):

    img = load_image(image_url)

    pixels = sample_pixels(img)

    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(pixels)

    clusters = kmeans.cluster_centers_
    labels = kmeans.labels_

    counts = np.bincount(labels)

    sorted_idx = np.argsort(counts)[::-1]

    dominant_rgb = clusters[sorted_idx[0]].astype(int).tolist()

    dominant_color = closest_color(dominant_rgb)

    accent_color = dominant_color

    for idx in sorted_idx[1:]:

        ratio = counts[idx] / sum(counts)

        rgb = clusters[idx].astype(int).tolist()

        color_name = closest_color(rgb)

        if ratio > 0.1 and color_name not in ["grey","black"]:

            accent_color = color_name
            break

    return {
        "color": dominant_color,
        "accentColor": accent_color,
        "colorFamily": get_color_family(dominant_color)
    }
# ---------------- REQUEST MODEL ----------------

class ImageInput(BaseModel):
    imageUrl:str


# ---------------- API ----------------

@app.post("/detect-color")

def detect_color(data:ImageInput):

    result = detect_clothing_color(data.imageUrl)

    return result
