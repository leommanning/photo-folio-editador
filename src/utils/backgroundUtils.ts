export const removeBackground = (
  canvas: HTMLCanvasElement,
  threshold: number = 0.1
): ImageData => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not found");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple background removal based on luminance difference
  // This works well for professional portraits with consistent lighting
  const width = canvas.width;
  const height = canvas.height;
  
  // Get the average edge color (assumed to be background)
  const edgePixels = [];
  for (let i = 0; i < width; i++) {
    edgePixels.push(getPixelColor(data, i, 0, width));
    edgePixels.push(getPixelColor(data, i, height - 1, width));
  }
  for (let i = 0; i < height; i++) {
    edgePixels.push(getPixelColor(data, 0, i, width));
    edgePixels.push(getPixelColor(data, width - 1, i, width));
  }
  
  const avgBackground = getAverageColor(edgePixels);

  // Remove background pixels similar to the average edge color
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const pixelColor = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      };
      
      if (colorDistance(pixelColor, avgBackground) < threshold) {
        data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
  }

  return imageData;
};

const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
  const idx = (y * width + x) * 4;
  return {
    r: data[idx],
    g: data[idx + 1],
    b: data[idx + 2]
  };
};

const getAverageColor = (colors: Array<{ r: number, g: number, b: number }>) => {
  const sum = colors.reduce((acc, color) => ({
    r: acc.r + color.r,
    g: acc.g + color.g,
    b: acc.b + color.b
  }), { r: 0, g: 0, b: 0 });
  
  return {
    r: sum.r / colors.length,
    g: sum.g / colors.length,
    b: sum.b / colors.length
  };
};

const colorDistance = (
  color1: { r: number, g: number, b: number },
  color2: { r: number, g: number, b: number }
) => {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / 441.67; // Normalized to 0-1
};

export const replaceBackground = (
  canvas: HTMLCanvasElement,
  backgroundImage: HTMLImageElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Store the original image data
  const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image scaled to fit
  const scale = Math.max(
    canvas.width / backgroundImage.width,
    canvas.height / backgroundImage.height
  );
  const x = (canvas.width - backgroundImage.width * scale) / 2;
  const y = (canvas.height - backgroundImage.height * scale) / 2;
  
  ctx.drawImage(
    backgroundImage,
    x, y,
    backgroundImage.width * scale,
    backgroundImage.height * scale
  );

  // Draw the original image (subject) on top
  ctx.putImageData(originalImageData, 0, 0);
};
