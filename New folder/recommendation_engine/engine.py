from fastapi import FastAPI
import itertools
import json
import os

from rules import hard_filters
from scoring import color_score, fit_score, occasion_score, history_penalty

app = FastAPI()

OCCASIONS = ["formal", "semiFormal", "casual", "daily"]

# ---------------- SAFE HELPERS ---------------- #

def safe_color(color):

    if not color:
        return "grey"

    if isinstance(color, str) and color.startswith("#"):
        return "grey"

    if color == "unknown":
        return "grey"

    return color.lower()


def safe_fit(item):
    return item.get("fit", "regular")


# ---------------- HISTORY ---------------- #

def load_history():

    if not os.path.exists("outfit_history.json"):
        return []

    with open("outfit_history.json", "r") as f:
        return json.load(f)


def save_history(history):

    with open("outfit_history.json", "w") as f:
        json.dump(history, f, indent=4)


def store_outfit(results, history):

    for occasion, data in results.items():

        entry = {
            "top": data["top"]["id"],
            "bottom": data["bottom"]["id"],
            "shoe": data["shoe"]["id"],
            "occasion": occasion
        }

        history.append(entry)

    save_history(history)


# ---------------- AVAILABILITY FILTER ---------------- #

def filter_available(items):

    return [
        item for item in items
        if item.get("status", "available") == "available"
    ]


# ---------------- OUTFIT GENERATION ---------------- #

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


# ---------------- SCORING ---------------- #

def score_outfit(outfit, user, occasion, history):

    top_color = safe_color(outfit["top"].get("color"))
    bottom_color = safe_color(outfit["bottom"].get("color"))

    score = 0

    score += color_score(top_color, bottom_color)

    score += fit_score({
        "top": {"fit": safe_fit(outfit["top"])},
        "bottom": {"fit": safe_fit(outfit["bottom"])}
    })

    score += occasion_score(outfit, occasion)

    score -= history_penalty(outfit, history)

    return score


# ---------------- RECOMMENDATION ---------------- #

def recommend_outfits(user, wardrobe, history):

    # Safe wardrobe access
    tops = filter_available(wardrobe.get("tops", []))
    bottoms = filter_available(wardrobe.get("bottoms", []))
    shoes = filter_available(wardrobe.get("shoes", []))

    if not tops or not bottoms or not shoes:
        return {
            "error": "Wardrobe incomplete or items in laundry"
        }

    outfits = generate_outfits(tops, bottoms, shoes)

    if len(outfits) == 0:
        return {
            "message": "No outfits available"
        }

    best_by_occasion = {}

    for occasion in OCCASIONS:

        best_score = -999
        best_outfit = None

        for outfit in outfits:

            score = score_outfit(outfit, user, occasion, history)

            if score > best_score:
                best_score = score
                best_outfit = outfit

        if best_outfit:

            top_color = safe_color(best_outfit["top"].get("color"))
            bottom_color = safe_color(best_outfit["bottom"].get("color"))

            top_fit = safe_fit(best_outfit["top"])
            bottom_fit = safe_fit(best_outfit["bottom"])

            best_by_occasion[occasion] = {

                "top": {
                    "id": best_outfit["top"]["id"],
                    "type": best_outfit["top"]["type"],
                    "color": top_color,
                    "fit": top_fit
                },

                "bottom": {
                    "id": best_outfit["bottom"]["id"],
                    "type": best_outfit["bottom"]["type"],
                    "color": bottom_color,
                    "fit": bottom_fit
                },

                "shoe": {
                    "id": best_outfit["shoe"]["id"],
                    "type": best_outfit["shoe"]["type"],
                    "color": safe_color(best_outfit["shoe"].get("color"))
                },

                "colorCombination":
                    f"{top_color} + {bottom_color}",

                "fitCombination":
                    f"{top_fit} top with {bottom_fit} bottom",

                "score": best_score
            }

    return best_by_occasion


# ---------------- FASTAPI ROUTE ---------------- #

@app.post("/recommend")
def recommend(data: dict):

    user = data.get("user", {})
    wardrobe = data.get("wardrobe", {})

    history = load_history()

    result = recommend_outfits(user, wardrobe, history)

    if "error" not in result and "message" not in result:
        store_outfit(result, history)

    print(result)
    return result