import itertools
import urllib.parse
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# ---------------- COLOR RULES ---------------- #
SKIN_TONE_PALETTES = {
    "wheatish": ["olive", "mustard", "cream", "brown", "maroon"],
    "fair": ["navy", "blue", "purple", "grey", "emerald"],
    "dark": ["white", "beige", "navy", "teal", "grey"]
}

# ---------------- ITEM TYPES ---------------- #
ITEM_TYPES = ["shirt", "tshirt", "chinos", "jeans", "sneakers"]

# ---------------- DATA MODELS ---------------- #
class Item(BaseModel):
    id: str = None
    type: str
    color: str

class Wardrobe(BaseModel):
    tops: List[Item] = []
    bottoms: List[Item] = []
    shoes: List[Item] = []

class User(BaseModel):
    skinTone: str

class RecommendationRequest(BaseModel):
    user: User
    wardrobe: Wardrobe

# ---------------- LOGIC ---------------- #
def wardrobe_colors(wardrobe):
    colors = set()
    for category in ["tops", "bottoms", "shoes"]:
        for item in getattr(wardrobe, category):
            colors.add(item.color)
    return colors

def generate_candidate_items(user):
    palette = SKIN_TONE_PALETTES.get(user.skinTone, [])
    candidates = []
    for color in palette:
        for item in ITEM_TYPES:
            candidates.append({"type": item, "color": color})
    return candidates

def count_outfits(tops, bottoms, shoes):
    return len(list(itertools.product(tops, bottoms, shoes)))

def simulate_item_gain(item, wardrobe):
    tops = wardrobe.tops.copy()
    bottoms = wardrobe.bottoms.copy()
    shoes = wardrobe.shoes.copy()

    if item["type"] in ["shirt", "tshirt"]:
        tops.append(Item(type=item["type"], color=item["color"]))
    elif item["type"] in ["chinos", "jeans"]:
        bottoms.append(Item(type=item["type"], color=item["color"]))
    else:
        shoes.append(Item(type=item["type"], color=item["color"]))

    return count_outfits(tops, bottoms, shoes)

def ecommerce_links(item):
    query = f"{item['color']} {item['type']} men"
    encoded = urllib.parse.quote(query)
    return {
        "amazon": f"https://www.amazon.in/s?k={encoded}",
        "flipkart": f"https://www.flipkart.com/search?q={encoded}",
        "myntra": f"https://www.myntra.com/{encoded}"
    }

def recommend_buy_next(user, wardrobe):
    candidates = generate_candidate_items(user)
    current_outfits = count_outfits(wardrobe.tops, wardrobe.bottoms, wardrobe.shoes)
    results = []
    existing_colors = wardrobe_colors(wardrobe)

    for item in candidates:
        if item["color"] in existing_colors:
            continue
        new_outfits = simulate_item_gain(item, wardrobe)
        impact = new_outfits - current_outfits
        results.append({
            "item": item,
            "impactScore": impact,
            "links": ecommerce_links(item)
        })

    results.sort(key=lambda x: x["impactScore"], reverse=True)
    return results[:5]

# ---------------- FASTAPI ENDPOINT ---------------- #
@app.post("/rerecommend-buy")
def rerecommend_buy(req: RecommendationRequest):
    recommendations = recommend_buy_next(req.user, req.wardrobe)
    return {
        "skinTone": req.user.skinTone,
        "recommendations": recommendations
    }

# ---------------- RUN TEST ---------------- #
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)