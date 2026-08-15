import itertools
import json
import os
from fastapi import FastAPI

from rules import hard_filters
from scoring import color_score, occasion_score, history_penalty

app = FastAPI()

# supported occasions
OCCASIONS = ["formal", "semiFormal", "casual", "daily"]

# ---------------- HISTORY ---------------- #

HISTORY_FILE = "outfit_history.json"


def load_history():

    if not os.path.exists(HISTORY_FILE):
        return []

    with open(HISTORY_FILE, "r") as f:
        return json.load(f)


def save_history(history):

    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)


def store_outfit(results, history):

    for occasion, data in results.items():

        entry = {
            "top": str(data["top"]["id"]),
            "bottom": str(data["bottom"]["id"]),
            "shoe": str(data["shoe"]["id"]),
            "occasion": occasion
        }

        history.append(entry)

    save_history(history)


# ---------------- LAUNDRY FILTER ---------------- #

def filter_available(items):
    """
    Remove clothes currently in laundry
    laundry = true  -> remove
    laundry = false -> keep
    """

    return [
        item for item in items
        if item.get("laundry", False) == False
    ]


# ---------------- GENERATE OUTFITS ---------------- #

def generate_outfits(tops, bottoms, shoes):

    outfits = []

    for combo in itertools.product(tops, bottoms, shoes):

        outfit = {
            "top": combo[0],
            "bottom": combo[1],
            "shoe": combo[2]
        }

        if hard_filters(outfit):
            outfits.append(outfit)

    return outfits


# ---------------- SCORE OUTFIT ---------------- #

def score_outfit(outfit, user, occasion, history):

    score = 0

    # color compatibility
    score += color_score(
        outfit["top"]["color"],
        outfit["bottom"]["color"]
    )

    # occasion suitability
    score += occasion_score(outfit, occasion)

    # avoid repeating outfits
    score -= history_penalty(outfit, history)

    return score


# ---------------- MAIN RECOMMENDATION ENGINE ---------------- #

def recommend_outfits(user, wardrobe):

    history = load_history()

    # remove laundry items
    tops = filter_available(wardrobe.get("tops", []))
    bottoms = filter_available(wardrobe.get("bottoms", []))
    shoes = filter_available(wardrobe.get("shoes", []))

    # wardrobe validation
    if len(tops) == 0 or len(bottoms) == 0 or len(shoes) == 0:

        return {
            "success": False,
            "message": "Not enough available wardrobe items",
            "counts": {
                "tops": len(tops),
                "bottoms": len(bottoms),
                "shoes": len(shoes)
            },
            "outfits": []
        }

    outfits = generate_outfits(tops, bottoms, shoes)

    if len(outfits) == 0:

        return {
            "success": False,
            "message": "No valid outfit combinations found",
            "outfits": []
        }

    best_by_occasion = {}

    # select best outfit for each occasion
    for occasion in OCCASIONS:

        best_score = -999
        best_outfit = None

        for outfit in outfits:

            score = score_outfit(outfit, user, occasion, history)

            if score > best_score:

                best_score = score
                best_outfit = outfit

        if best_outfit is None:
            continue

        best_by_occasion[occasion] = {

            "top": {
                "id": str(best_outfit["top"]["id"]),
                "type": best_outfit["top"]["type"],
                "color": best_outfit["top"]["color"],
                "imageUrl": best_outfit["top"]["imageUrl"]
            },

            "bottom": {
                "id": str(best_outfit["bottom"]["id"]),
                "type": best_outfit["bottom"]["type"],
                "color": best_outfit["bottom"]["color"],
                "imageUrl": best_outfit["bottom"]["imageUrl"]
            },

            "shoe": {
                "id": str(best_outfit["shoe"]["id"]),
                "type": best_outfit["shoe"]["type"],
                "color": best_outfit["shoe"]["color"],
                "imageUrl": best_outfit["shoe"]["imageUrl"]
            },

            "colorCombination":
                f"{best_outfit['top']['color']} + {best_outfit['bottom']['color']}",

            "score": best_score
        }

    store_outfit(best_by_occasion, history)

    return {
        "success": True,
        "outfits": best_by_occasion
    }


# ---------------- FASTAPI ENDPOINT ---------------- #

@app.post("/recommend")
async def recommend(data: dict):

    user = data.get("user", {})
    wardrobe = data.get("wardrobe", {})

    result = recommend_outfits(user, wardrobe)

    return result
