export const applyFilter = (
  canvas: HTMLCanvasElement,
  filter: string,
  value: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  switch (filter) {
    case "brightness":
      ctx.filter = `brightness(${value}%)`;
      break;
    case "saturation":
      ctx.filter = `saturate(${value}%)`;
      break;
    case "sepia":
      ctx.filter = `sepia(${value}%)`;
      break;
    default:
      ctx.filter = "none";
  }
};

export const rotateImage = (
  canvas: HTMLCanvasElement,
  degrees: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.rotate((degrees * Math.PI) / 180);
};

export const addBorder = (
  canvas: HTMLCanvasElement,
  borderWidth: number,
  borderColor: string
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
};