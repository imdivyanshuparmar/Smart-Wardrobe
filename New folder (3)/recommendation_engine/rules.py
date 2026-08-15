# rules.py

FORMAL_SHOES = {"oxford","derby"}
CASUAL_SHOES = {"sneaker","slipon"}

def hard_filters(outfit):

    top = outfit["top"]
    bottom = outfit["bottom"]
    shoe = outfit["shoe"]

    if bottom["type"] == "shorts" and shoe["type"] in FORMAL_SHOES:
        return False

    if bottom["type"] == "formalPant" and shoe["type"] == "sneaker":
        return False

    if top["type"] == "tshirt" and shoe["type"] == "oxford":
        return False

    return True