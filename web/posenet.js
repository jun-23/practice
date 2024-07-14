const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let leftHandInBox = false;
let rightHandInBox = false;
let leftHandBoxPosition = null;
let rightHandBoxPosition = null;
let boxTimer = null;

const printButton = document.getElementById("printButton");
printButton.addEventListener("click", () => {
    if (leftHandInBox) {
        console.log('Left hand position:', leftHandBoxPosition);
    }
    if (rightHandInBox) {
        console.log('Right hand position:', rightHandBoxPosition);
    }
});

//webcam을 enable하는 코드
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function (stream) {
    video.srcObject = stream;
});

//then 안쪽이 function(model){} 이렇게 쓰는거랑 같다 (인자가 하나라 중괄호가 없는 것)
posenet.load().then((model) => {
    // 이곳의 model과 아래 predict의 model은 같아야 한다.
    video.onloadeddata = (e) => {
        //비디오가 load된 다음에 predict하도록. (안하면 콘솔에 에러뜸)
        predict();
    };

    function predict() {
        //frame이 들어올 때마다 estimate를 해야하니 함수화 시킴
        model.estimateSinglePose(video).then((pose) => {
            canvas.width = video.width; //캔버스와 비디오의 크기를 일치시킴
            canvas.height = video.height;

            drawKeypoints(pose.keypoints, 0.6, context); //정확도 
            drawSkeleton(pose.keypoints, 0.6, context);
            drawCenterSquare(context); // Draw the center square

            // Check if left hand or right hand is in the center square
            checkHandsInBox(pose.keypoints);
        });
        requestAnimationFrame(predict); //frame이 들어올 때마다 재귀호출
    }
});

/* PoseNet을 쓰면서 사용하는 함수들 코드 - 그냥 복사해서 쓰기*/

//tensorflow에서 제공하는 js 파트
const color = "aqua";
const boundingBoxColor = "red";
const lineWidth = 2;
const squareSize = 100; // Size of the center square

function toTuple({y, x}) {
    return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(toTuple(keypoints[0].position), toTuple(keypoints[1].position), color, scale, ctx);
    });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}

function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
    );

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}

// Function to draw a square in the center of the canvas
function drawCenterSquare(ctx) {
    const x = (canvas.width / 2) - (squareSize / 2);
    const y = (canvas.height / 2) - (squareSize / 2);

    ctx.beginPath();
    ctx.rect(x, y, squareSize, squareSize);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Function to check if left hand or right hand is in the center square
function checkHandsInBox(keypoints) {
    const leftHand = keypoints.find((kp) => kp.part === 'leftWrist');
    const rightHand = keypoints.find((kp) => kp.part === 'rightWrist');

    if (leftHand && isPointInSquare(leftHand.position)) {
        if (!leftHandInBox) {
            leftHandInBox = true;
            leftHandBoxPosition = leftHand.position;
            startTimer('leftHand');
        }
    } else {
        leftHandInBox = false;
        leftHandBoxPosition = null;
        clearTimeout(boxTimer);
    }

    if (rightHand && isPointInSquare(rightHand.position)) {
        if (!rightHandInBox) {
            rightHandInBox = true;
            rightHandBoxPosition = rightHand.position;
            startTimer('rightHand');
        }
    } else {
        rightHandInBox = false;
        rightHandBoxPosition = null;
        clearTimeout(boxTimer);
    }
}

// Function to start the timer when hand stays in the box
function startTimer(hand) {
    boxTimer = setTimeout(() => {
        if (hand === 'leftHand') {
            console.log('Left hand position:', leftHandBoxPosition);
        } else if (hand === 'rightHand') {
            console.log('Right hand position:', rightHandBoxPosition);
        }
    }, 1000); // 1 second timer
}

// Function to check if a point is within the center square
function isPointInSquare(position) {
    const x = position.x * canvas.width / video.width;
    const y = position.y * canvas.height / video.height;
    const squareX = (canvas.width / 2) - (squareSize / 2);
    const squareY = (canvas.height / 2) - (squareSize / 2);

    return x >= squareX && x <= (squareX + squareSize) && y >= squareY && y <= (squareY + squareSize);
}
