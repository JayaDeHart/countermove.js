import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { GiConsoleController } from "react-icons/gi";

const color = "black";
const lineWidth = 2;

// function toTuple({ x, y }: { x: number; y: number }): [number, number] {
//   return [x, y];
// }

// export function drawPoint(
//   ctx: CanvasRenderingContext2D,
//   y: number,
//   x: number,
//   r: number,
//   color: string
// ) {
//   ctx.beginPath();
//   ctx.arc(x, y, r, 0, 2 * Math.PI);
//   ctx.fillStyle = color;
//   ctx.fill();
// }

// /**
//  * Draws a line on a canvas, i.e. a joint
//  */
// export function drawSegment(
//   [ay, ax]: [number, number],
//   [by, bx]: [number, number],
//   color: string,
//   scale: number,
//   ctx: CanvasRenderingContext2D
// ) {
//   ctx.beginPath();
//   ctx.moveTo(ax * scale, ay * scale);
//   ctx.lineTo(bx * scale, by * scale);
//   ctx.lineWidth = lineWidth;
//   ctx.strokeStyle = color;
//   ctx.stroke();
// }

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */

/**
 * Draw pose keypoints onto a canvas
 */
// export function drawKeypoints(
//   keypoints: Keypoint[],
//   minConfidence: number,
//   ctx: CanvasRenderingContext2D,
//   scale = 1
// ) {
//   for (let i = 0; i < keypoints.length; i++) {
//     const keypoint = keypoints[i];

//     if (keypoint.score! < minConfidence) {
//       continue;
//     }

//     const { y, x } = keypoint;
//     drawPoint(ctx, y * scale, x * scale, 3, color);
//   }
// }

// export function drawSkeleton(
//   keypoints: Keypoint[],
//   minConfidence: number,
//   ctx: CanvasRenderingContext2D,
//   scale = 1
// ) {
//   const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
//     poseDetection.SupportedModels.MoveNet
//   );

//   console.log(adjacentKeyPoints);

//   adjacentKeyPoints.forEach(([leftJoint, rightJoint]) => {
//     const leftKeypoint = keypoints[leftJoint];
//     const rightKeypoint = keypoints[rightJoint];

//     if (
//       leftKeypoint.score! >= minConfidence &&
//       rightKeypoint.score! >= minConfidence
//     ) {
//       let leftpos = {
//         x: leftKeypoint.x,
//         y: leftKeypoint.y,
//       };
//       let rightpos = {
//         x: rightKeypoint.x,
//         y: rightKeypoint.y,
//       };
//       drawSegment(toTuple(leftpos), toTuple(rightpos), "red", scale, ctx);
//     }
//   });
// }

export function drawThumbnail(
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.drawImage(image, 0, 0);
}

export function drawCtx(
  video: HTMLVideoElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}

export function drawResults(
  poses: poseDetection.Pose[],
  ctx: CanvasRenderingContext2D
) {
  for (const pose of poses) {
    drawResult(pose, ctx);
  }
}

/**
 * Draw the keypoints and skeleton on the video.
 * @param pose A pose with keypoints to render.
 */
export function drawResult(
  pose: poseDetection.Pose,
  ctx: CanvasRenderingContext2D
) {
  if (pose.keypoints != null) {
    drawKeypoints(pose.keypoints, ctx);
    drawSkeleton(pose.keypoints, ctx);
  }
}

export function drawSkeleton(
  keypoints: Keypoint[],
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = "White";
  ctx.strokeStyle = "White";
  ctx.lineWidth = 1;

  poseDetection.util
    .getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
    .forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = 0.3;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
}

export function drawKeypoints(
  keypoints: Keypoint[],
  ctx: CanvasRenderingContext2D
) {
  const keypointInd = poseDetection.util.getKeypointIndexBySide(
    poseDetection.SupportedModels.MoveNet
  );
  ctx.fillStyle = "White";
  ctx.strokeStyle = "White";
  ctx.lineWidth = 1;

  for (const i of keypointInd.middle) {
    drawKeypoint(keypoints[i], ctx);
  }

  ctx.fillStyle = "Green";
  for (const i of keypointInd.left) {
    drawKeypoint(keypoints[i], ctx);
  }

  ctx.fillStyle = "Orange";
  for (const i of keypointInd.right) {
    drawKeypoint(keypoints[i], ctx);
  }
}

export function drawKeypoint(
  keypoint: Keypoint,
  ctx: CanvasRenderingContext2D
) {
  // If score is null, just show the keypoint.
  const score = keypoint.score != null ? keypoint.score : 1;
  const scoreThreshold = 0.3 || 0;

  if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, 1, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
  }
}

export const kp = {
  keypoints: [
    {
      y: 759.6802336496048,
      x: 338.3452332811496,
      score: 0.8082062602043152,
      name: "nose",
    },
    {
      y: 754.2685720109259,
      x: 343.3183189837543,
      score: 0.8889304995536804,
      name: "left_eye",
    },
    {
      y: 753.6773918358432,
      x: 330.7167593339465,
      score: 0.8602647185325623,
      name: "right_eye",
    },
    {
      y: 758.3718302835118,
      x: 346.6582214147159,
      score: 0.6978726387023926,
      name: "left_ear",
    },
    {
      y: 758.0372538691443,
      x: 318.3768069510103,
      score: 0.7572057247161865,
      name: "right_ear",
    },
    {
      y: 801.5070838457369,
      x: 362.7178245340527,
      score: 0.8417751789093018,
      name: "left_shoulder",
    },
    {
      y: 793.6450373792097,
      x: 290.6996022889911,
      score: 0.9513200521469116,
      name: "right_shoulder",
    },
    {
      y: 854.8793058980516,
      x: 363.4713838668593,
      score: 0.8754768371582031,
      name: "left_elbow",
    },
    {
      y: 840.9382423401082,
      x: 268.52881282614294,
      score: 0.8298062086105347,
      name: "right_elbow",
    },
    {
      y: 906.8587828505079,
      x: 386.4512408149551,
      score: 0.783829391002655,
      name: "left_wrist",
    },
    {
      y: 882.8603156814527,
      x: 268.9259303687032,
      score: 0.9086518883705139,
      name: "right_wrist",
    },
    {
      y: 890.3917529148689,
      x: 336.20105547353927,
      score: 0.8585391044616699,
      name: "left_hip",
    },
    {
      y: 885.9818882051568,
      x: 298.5832172674936,
      score: 0.814382791519165,
      name: "right_hip",
    },
    {
      y: 968.0865851337775,
      x: 342.0652078690814,
      score: 0.8967782258987427,
      name: "left_knee",
    },
    {
      y: 962.2417342894926,
      x: 307.6050948126684,
      score: 0.895902156829834,
      name: "right_knee",
    },
    {
      y: 1024.926307120331,
      x: 313.8065169878122,
      score: 0.7092882990837097,
      name: "left_ankle",
    },
    {
      y: 1038.611409223096,
      x: 295.22969148212115,
      score: 0.7583276629447937,
      name: "right_ankle",
    },
  ],
  score: 0.8315622140379513,
};

export function calculateAngles(A: Keypoint, B: Keypoint, C: Keypoint) {
  const { x: x1, y: y1 } = A;
  const { x: x2, y: y2 } = B;
  const { x: x3, y: y3 } = C;

  const a = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2);
  const b = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2);
  const c = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

  const alpha = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
  const beta = Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c));
  const gamma = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));

  return {
    alpha: alpha * (180 / Math.PI),
    beta: beta * (180 / Math.PI),
    gamma: gamma * (180 / Math.PI),
  };
}

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
