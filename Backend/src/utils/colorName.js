const COLOR_MAP = {
  black: "#000000",
  white: "#ffffff",
  grey: "#808080",
  red: "#ff0000",
  maroon: "#800000",
  blue: "#0000ff",
  navy: "#000080",
  skyblue: "#87ceeb",
  green: "#008000",
  olive: "#808000",
  yellow: "#ffff00",
  orange: "#ffa500",
  pink: "#ffc0cb",
  brown: "#8b4513",
  beige: "#f5f5dc",
  purple: "#800080",
  violet: "#8a2be2",
  teal: "#008080"
};

// HEX → RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// RGB → LAB conversion (more accurate color comparison)
function rgbToLab({ r, g, b }) {

  r /= 255;
  g /= 255;
  b /= 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16/116;
  const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16/116;
  const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16/116;

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

// LAB color distance
function labDistance(c1, c2) {
  return Math.sqrt(
    (c1.l - c2.l) ** 2 +
    (c1.a - c2.a) ** 2 +
    (c1.b - c2.b) ** 2
  );
}

// Main color finder
function getColorName(hex) {

  const rgb = hexToRgb(hex);
  const lab = rgbToLab(rgb);

  let minDistance = Infinity;
  let closestColor = "unknown";

  for (const [name, colorHex] of Object.entries(COLOR_MAP)) {

    const mapRgb = hexToRgb(colorHex);
    const mapLab = rgbToLab(mapRgb);

    const distance = labDistance(lab, mapLab);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }

  return closestColor;
}

module.exports = getColorName;