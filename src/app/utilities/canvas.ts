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

export function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );

  console.log(adjacentKeyPoints);

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

const kp = {
  keypoints: [
    {
      y: 243.67344680536758,
      x: 204.621350827267,
      score: 0.7608279585838318,
      name: "nose",
    },
    {
      y: 218.26428325267437,
      x: 217.55933514846447,
      score: 0.7998524904251099,
      name: "left_eye",
    },
    {
      y: 221.10760763188694,
      x: 171.4512949920334,
      score: 0.6811222434043884,
      name: "right_eye",
    },
    {
      y: 230.74927616031886,
      x: 229.61954289999593,
      score: 0.666581392288208,
      name: "left_ear",
    },
    {
      y: 249.1506612208045,
      x: 126.78966272881914,
      score: 0.6164257526397705,
      name: "right_ear",
    },
    {
      y: 346.4748936745273,
      x: 287.45670641774404,
      score: 0.7991980314254761,
      name: "left_shoulder",
    },
    {
      y: 402.28277242666786,
      x: 63.48742019994482,
      score: 0.8118641376495361,
      name: "right_shoulder",
    },
    {
      y: 287.90896289360694,
      x: 441.0720971619409,
      score: 0.6697683930397034,
      name: "left_elbow",
    },
    {
      y: 545.3846905945232,
      x: 12.055791398347287,
      score: 0.2663847804069519,
      name: "right_elbow",
    },
    {
      y: 139.524286949869,
      x: 411.965518397604,
      score: 0.5633507966995239,
      name: "left_wrist",
    },
    {
      y: 216.257190704354,
      x: 114.57734097013517,
      score: 0.0354251004755497,
      name: "right_wrist",
    },
    {
      y: 585.5980733939604,
      x: 300.2207400057301,
      score: 0.10217856615781784,
      name: "left_hip",
    },
    {
      y: 565.0351811197089,
      x: 104.17841748116828,
      score: 0.029695920646190643,
      name: "right_hip",
    },
    {
      y: 425.68361149618494,
      x: 314.95184119448544,
      score: 0.05674074962735176,
      name: "left_knee",
    },
    {
      y: 325.5261993408988,
      x: 197.5111579867488,
      score: 0.003687007585540414,
      name: "right_knee",
    },
    {
      y: 84.3651857543299,
      x: 395.6103832102907,
      score: 0.15263348817825317,
      name: "left_ankle",
    },
    {
      y: 325.3533054406547,
      x: 237.92711402854871,
      score: 0.013317478820681572,
      name: "right_ankle",
    },
  ],
  score: 0.66353759765625,
};

const adj = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [5, 6],
  [5, 7],
  [5, 11],
  [6, 8],
  [6, 12],
  [7, 9],
  [8, 10],
  [11, 12],
  [11, 13],
  [12, 14],
  [13, 15],
  [14, 16],
];
