# scoring.py

from color_rules import COLOR_COMPATIBILITY, BAD_COLOR_COMBINATIONS, NEUTRAL_COLORS


def color_score(top_color,bottom_color):

    score = 0

    if (top_color,bottom_color) in BAD_COLOR_COMBINATIONS:
        score -= 3

    if top_color in COLOR_COMPATIBILITY:
        if bottom_color in COLOR_COMPATIBILITY[top_color]:
            score += 2

    if top_color in NEUTRAL_COLORS or bottom_color in NEUTRAL_COLORS:
        score += 1

    return score


def fit_score(outfit):

    score = 0

    top_fit = outfit["top"]["fit"]
    bottom_fit = outfit["bottom"]["fit"]

    if top_fit == "slim" and bottom_fit == "slim":
        score += 1

    if top_fit == "regular" and bottom_fit == "straight":
        score += 1

    return score


def occasion_score(outfit,occasion):

    top = outfit["top"]
    bottom = outfit["bottom"]
    shoe = outfit["shoe"]

    score = 0

    if occasion == "formal":

        if top["type"] == "shirt":
            score += 2

        if bottom["type"] == "formalPant":
            score += 2

        if shoe["type"] == "oxford":
            score += 2

    elif occasion == "semiFormal":

        if bottom["type"] in ["chinos","formalPant"]:
            score += 2

        if shoe["type"] == "loafer":
            score += 2

    elif occasion == "casual":

        if top["type"] == "tshirt":
            score += 2

        if bottom["type"] == "jeans":
            score += 2

        if shoe["type"] == "sneaker":
            score += 2

    elif occasion == "daily":

        if shoe["type"] in ["sneaker","loafer"]:
            score += 1

    return score


def history_penalty(outfit,history):

    for past in history:

        if (
            past["top"] == outfit["top"]["id"]
            and past["bottom"] == outfit["bottom"]["id"]
            and past["shoe"] == outfit["shoe"]["id"]
        ):
            return 6

    return 0