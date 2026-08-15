# color_rules.py

COLOR_COMPATIBILITY = {

    "navy": ["grey","beige","white","brown"],
    "black": ["grey","beige","white"],
    "white": ["black","navy","blue","olive"],
    "blue": ["grey","beige","white"],
    "maroon": ["grey","black","navy"],
    "olive": ["beige","brown","white"],
    "lightblue": ["grey","navy","beige"]
}

BAD_COLOR_COMBINATIONS = {
    ("red","green"),
    ("orange","pink"),
    ("brown","grey")
}

NEUTRAL_COLORS = {"black","white","grey","navy","beige"}