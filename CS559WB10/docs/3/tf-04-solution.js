import { GrWorld } from "/libs/CS559-Framework/GrWorld.js";
import { GrObject} from "/libs/CS559-Framework/GrObject.js";
import { GrCube } from "/libs/CS559-Framework/SimpleObjects.js";

// three things for making a cube
import * as T from "/libs/CS559-Three/build/three.module.js";

// Global variables
let detector;
let world;
let video;
let canvas;
let ctx;
let debug;
let poseGrObject; // GrObject wrapper for the pose group
let poseGroup; // Group to hold all pose geometry
let sphereMeshes = []; // Array to hold sphere meshes for keypoints
let cylinderMeshes = []; // Array to hold cylinder meshes for connections
let poseInitialized = false; // Flag to track if pose geometry has been created

// BlazePose model configuration
const model = poseDetection.SupportedModels.BlazePose;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/',
  modelType: 'full', // Changed from 'lite' to 'full' for better 3D support
  enableSmoothing: true,
  enableSegmentation: false
};


// Pose keypoint connections for drawing skeleton (BlazePose standard 33 keypoints)
// Based on the reference image showing correct BlazePose keypoint structure
const POSE_CONNECTIONS = [
  // Face connections
  [0, 1], [0, 4], // nose to eyes
  [1, 2], [2, 3], // left eye
  [4, 5], [5, 6], // right eye
  [0, 7], [0, 8], // nose to outer eye points
  [9, 10], // mouth
  
  // Torso connections
  [11, 12], // shoulders
  [11, 23], [12, 24], // shoulders to hips
  [23, 24], // hips
  
  // Left arm (viewer's right)
  [11, 13], // left shoulder to elbow
  [13, 15], // left elbow to wrist
  [15, 17], [15, 19], [15, 21], // left wrist to fingers
  
  // Right arm (viewer's left)
  [12, 14], // right shoulder to elbow
  [14, 16], // right elbow to wrist
  [16, 18], [16, 20], [16, 22], // right wrist to fingers
  
  // Left leg (viewer's right)
  [23, 25], // left hip to knee
  [25, 27], // left knee to ankle
  [27, 29], [27, 31], // left ankle to foot
  
  // Right leg (viewer's left)
  [24, 26], // right hip to knee
  [26, 28], // right knee to ankle
  [28, 30], [28, 32], // right ankle to foot
];

// Colors for different body parts
const COLORS = {
  body: '#00FF00',         // Green for all body parts
  face: '#FF0000'          // Red for face only
};

// Function to get color for a connection
function getConnectionColor(connection) {
  const [start, end] = connection;
  
  // Face and head connections (0-10: face, eyes, mouth) - use red
  if ((start >= 0 && start <= 10) || (end >= 0 && end <= 10)) {
    return COLORS.face;
  }
  
  // All other body parts - use green
  return COLORS.body;
}

// Function to get color for a keypoint index
function getKeypointColor(index) {
  // Face and head (0-10) - use red
  if (index >= 0 && index <= 10) return COLORS.face;
  // All other body parts - use green
  return COLORS.body;
}

// Function to create 3D pose visualization
// TODO: Student's solution
function get3DPose(pose) {
  try {
    if (!pose) {
      console.warn('No pose data available');
      return;
    }
    
    // Check if we have 3D keypoints
    let keypoints = pose.keypoints3D;
    
    // If keypoints3D not available, try to use 2D keypoints with estimated depth
    if (!keypoints || keypoints.length === 0) {
      console.warn('No keypoints3D available, checking for 2D keypoints');
      
      if (!pose.keypoints || pose.keypoints.length === 0) {
        console.warn('No keypoints data available at all');
        return;
      }
      
      // For now, just return if no 3D data - we'll handle 2D fallback separately if needed
      console.warn('Only 2D keypoints available - 3D visualization requires keypoints3D');
      return;
    }
  
  // Create pose geometry if not already initialized
  if (!poseInitialized) {
    // Create new group for this pose
    poseGroup = new T.Group();
    poseGrObject = new GrObject("pose-group", poseGroup);
    
    // Set the pose object's position in the world
    poseGrObject.objects[0].position.set(0, 2.2, 0);
    poseGrObject.objects[0].scale.set(1, 1, 1);
    
    world.add(poseGrObject);
    
    // Create spheres for keypoints (33 landmarks)
    for (let i = 0; i < 33; i++) {
      const sphereGeometry = new T.SphereGeometry(0.05, 16, 16);
      const sphereMaterial = new T.MeshStandardMaterial({ 
        color: getKeypointColor(i),
        metalness: 0.3,
        roughness: 0.4
      });
      const sphere = new T.Mesh(sphereGeometry, sphereMaterial);
      sphereMeshes.push(sphere);
    }
    poseGroup.add(...sphereMeshes);
    
    // Create cylinders for connections
    for (const connection of POSE_CONNECTIONS) {
      const cylinderGeometry = new T.CylinderGeometry(0.02, 0.02, 1, 8);
      const cylinderMaterial = new T.MeshStandardMaterial({ color: '#FFFFFF' });
      const cylinder = new T.Mesh(cylinderGeometry, cylinderMaterial);
      cylinderMeshes.push(cylinder);
    }
    poseGroup.add(...cylinderMeshes);
    
    poseInitialized = true;
  }
  
  // Update sphere positions
  for (let i = 0; i < keypoints.length && i < sphereMeshes.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint && keypoint.x !== undefined && keypoint.y !== undefined) {
      // Set 3D coordinates (already provided in keypoints3D)
      // Scale to reasonable 3D size, as positions in keypoints3D are typically normalized to (-1, 1)
      const spherePosition = new T.Vector3(
        -keypoint.x * 3,
        -keypoint.y * 3,
        keypoint.z ? -keypoint.z * 3 : 0
      );   
      // Update sphere position
      sphereMeshes[i].position.copy(spherePosition);
      sphereMeshes[i].visible = true;
    } else {
      sphereMeshes[i].visible = false;
    }
  }
  
  // Update cylinder positions and orientations
  let cylinderIndex = 0;
  for (const connection of POSE_CONNECTIONS) {
    const [startIndex, endIndex] = connection;
    if (keypoints[startIndex] && keypoints[endIndex] && cylinderIndex < cylinderMeshes.length) {
      const startKeypoint = keypoints[startIndex];
      const endKeypoint = keypoints[endIndex];
      
      if (startKeypoint.x !== undefined && startKeypoint.y !== undefined &&
          endKeypoint.x !== undefined && endKeypoint.y !== undefined) {
        
        // Set 3D coordinates (already provided in keypoints3D)
        const start3D = new T.Vector3(
          -startKeypoint.x * 3,
          -startKeypoint.y * 3,
          startKeypoint.z ? -startKeypoint.z * 3 : 0
        );
        
        const end3D = new T.Vector3(
          -endKeypoint.x * 3,
          -endKeypoint.y * 3,
          endKeypoint.z ? -endKeypoint.z * 3 : 0
        );
        
        // Update cylinder
        const cylinder = cylinderMeshes[cylinderIndex];
        const direction = new T.Vector3().subVectors(end3D, start3D);
        const length = direction.length();
        
        if (length > 0.001) {
          // Reset cylinder rotation and scale first
          cylinder.rotation.set(0, 0, 0);
          cylinder.scale.set(1, 1, 1);
          
          // Scale cylinder to match the distance
          cylinder.scale.set(1, length, 1);
          
          // Position cylinder at the midpoint between start and end
          const midpoint = new T.Vector3().addVectors(start3D, end3D).multiplyScalar(0.5);
          cylinder.position.copy(midpoint);
          
          // Orient cylinder to align with the direction vector
          // Create a matrix that aligns the cylinder's Y-axis with the direction
          const up = new T.Vector3(0, 1, 0);
          const quaternion = new T.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
          cylinder.quaternion.copy(quaternion);
          
          cylinder.visible = true;
        } 
      }
      else {
        cylinder.visible = false;
      }
      cylinderIndex++;
    }
  }
  
  // Hide any unused cylinders
  for (let i = cylinderIndex; i < cylinderMeshes.length; i++) {
    cylinderMeshes[i].visible = false;
  }
  
  } catch (error) {
    console.error('Error in get3DPose:', error);
    console.error('Pose data:', pose);
    throw error; // Re-throw to be caught by detectAndDraw error handler
  }
}

// Function to draw pose skeleton
function drawPose(pose) {
  if (!pose) {
    return;
  }
  
  // Try different possible keypoint properties
  const keypoints = pose.keypoints || pose.landmarks || pose.points || [];
  
  if (!keypoints || keypoints.length === 0) {
    console.log('No keypoints found in pose object:', pose);
    return;
  }
  
  // Draw connections (skeleton)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  for (const connection of POSE_CONNECTIONS) {
    const [startIdx, endIdx] = connection;
    const startPoint = keypoints[startIdx];
    const endPoint = keypoints[endIdx];
    
    if (startPoint && endPoint && startPoint.score > 0.1 && endPoint.score > 0.1) {
      ctx.strokeStyle = getConnectionColor(connection);
      ctx.beginPath();
      ctx.moveTo(canvas.width - startPoint.x, startPoint.y);
      ctx.lineTo(canvas.width - endPoint.x, endPoint.y);
      ctx.stroke();
    }
  }
  
  // Reset shadow for keypoints
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw keypoints
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    
    // Draw all keypoints regardless of confidence for debugging
    if (keypoint && keypoint.x !== undefined && keypoint.y !== undefined) {
      const x = canvas.width - keypoint.x;
      const y = keypoint.y;
      
      // Use different colors based on confidence
      const confidence = keypoint.score || 0;
      const alpha = Math.max(0.3, confidence);
      
      // Draw outer ring for visibility
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw inner circle
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw main keypoint with confidence-based color
      const color = getConnectionColor([i, i]);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // Draw keypoint number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), x, y);
    }
  }
}

// Function to clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to resize canvas to match video
function resizeCanvas() {
  const videoRect = video.getBoundingClientRect();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.style.width = videoRect.width + 'px';
  canvas.style.height = videoRect.height + 'px';
}

// Main detection and drawing function
async function detectAndDraw() {
  if (!detector) {
    debug.textContent = 'Waiting for detector...';
    requestAnimationFrame(detectAndDraw);
    return;
  }
  
  if (!video.videoWidth || !video.videoHeight) {
    debug.textContent = 'Waiting for video dimensions...';
    requestAnimationFrame(detectAndDraw);
    return;
  }
  
  try {
    const estimationConfig = { flipHorizontal: true };
    
    // Try detecting poses on video
    let poses;
    try {
      poses = await detector.estimatePoses(video, estimationConfig);
    } catch (error) {
      console.error('Error detecting poses on video:', error);
      poses = [];
    }
    
    // Clear previous drawings
    clearCanvas();
    
    // Update debug info
    debug.textContent = `Video: ${video.videoWidth}x${video.videoHeight}\nPoses detected: ${poses.length}\n`;
    
    // Create 3D visualization for each detected pose
    poses.forEach((pose, index) => {
      const confidence = pose.score ? pose.score.toFixed(3) : 'N/A';
      debug.textContent += `Pose ${index + 1}: confidence ${confidence}\n`;
      get3DPose(pose);
    });
    
  } catch (error) {
    debug.textContent = `Detection error: ${error.message}`;
    console.error(`Detection error: ${error.message}`);
  }
  
  // Continue the detection loop
  requestAnimationFrame(detectAndDraw);
}

// Initialize everything
async function init() {
  try {
    debug.textContent = 'Loading dependencies...';
    console.log('Starting initialization...');
    
    // Wait for TensorFlow.js to be available
    let attempts = 0;
    while (typeof poseDetection === 'undefined' && attempts < 100) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
      if (attempts % 10 === 0) {
        debug.textContent = `Loading dependencies... (${attempts}/100)`;
      }
    }
    
    if (typeof poseDetection === 'undefined') {
      throw new Error('TensorFlow.js pose detection not loaded after 10 seconds');
    }
    
    // Initialize TensorFlow.js backend
    if (typeof tf !== 'undefined' && tf.backend) {
      debug.textContent = 'Initializing TensorFlow.js backend...';
      await tf.ready();
      console.log('TensorFlow.js backend initialized');
    }
    
    debug.textContent = 'Creating detector...';
    console.log('Creating detector with config:', detectorConfig);
    
    detector = await poseDetection.createDetector(model, detectorConfig);
    console.log('Detector created successfully');
    
    // Wait for video to load
    if (video.readyState >= 1) {
      debug.textContent = 'Model loaded. Starting detection...';
      detectAndDraw();
    } else {
      video.addEventListener('loadedmetadata', () => {
        debug.textContent = 'Model loaded. Starting detection...';
        detectAndDraw();
      });
    }
    
  } catch (error) {
    debug.textContent = `Error: ${error.message}`;
    console.error('Initialization error:', error);
    console.error('Error stack:', error.stack);
  }
}

// @@Snippet:makeworld
// Initialize the 3D world
world = new GrWorld({
    groundplanecolor: "gray",
    where: document.getElementById("div1")
});

// Get video and debug elements
video = document.getElementById('video');
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
debug = document.getElementById('debug');

// Add some lighting to better see the pose
const ambientLight = new T.AmbientLight(0x404040, 0.6);
world.add(new GrObject("ambient-light", ambientLight));

const directionalLight = new T.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
world.add(new GrObject("directional-light", directionalLight));

// run the animation/interaction loop
world.go();

// Start pose detection initialization
init();
// @@Snippet:end