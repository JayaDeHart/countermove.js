import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as poseDetection from "@tensorflow-models/pose-detection";

const color = "black";
const lineWidth = 2;

function toTuple({ x, y }: { x: number; y: number }): [number, number] {
  return [x, y];
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  y: number,
  x: number,
  r: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment(
  [ay, ax]: [number, number],
  [by, bx]: [number, number],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );

  adjacentKeyPoints.forEach(([leftJoint, rightJoint]) => {
    const leftKeypoint = keypoints[leftJoint];
    const rightKeypoint = keypoints[rightJoint];

    if (
      leftKeypoint.score! >= minConfidence &&
      rightKeypoint.score! >= minConfidence
    ) {
      let leftpos = {
        x: leftKeypoint.x,
        y: leftKeypoint.y,
      };
      let rightpos = {
        x: rightKeypoint.x,
        y: rightKeypoint.y,
      };
      drawSegment(toTuple(leftpos), toTuple(rightpos), "red", scale, ctx);
    }
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score! < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

// export async function renderToCanvas(a, ctx) {
//   const [height, width] = a.shape;
//   const imageData = new ImageData(width, height);

//   const data = await a.data();

//   for (let i = 0; i < height * width; ++i) {
//     const j = i * 4;
//     const k = i * 3;

//     imageData.data[j + 0] = data[k + 0];
//     imageData.data[j + 1] = data[k + 1];
//     imageData.data[j + 2] = data[k + 2];
//     imageData.data[j + 3] = 255;
//   }

//   ctx.putImageData(imageData, 0, 0);
// }

// /**
//  * Draw an image on a canvas
//  */
// export function renderImageToCanvas(image, size, canvas) {
//   canvas.width = size[0];
//   canvas.height = size[1];
//   const ctx = canvas.getContext("2d");

//   ctx.drawImage(image, 0, 0);
// }
