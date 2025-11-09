import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject} from "../libs/CS559-Framework/GrObject.js";
import { GrCube } from "../libs/CS559-Framework/SimpleObjects.js";

// three things for making a cube
import * as T from "../libs/CS559-Three/build/three.module.js";

// Hand pose detection configuration
const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915',
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  modelType: 'lite'
};

// Hand landmark connections for drawing lines between points
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17] // Palm connections
];

// Colors for different parts of the hand
const COLORS = {
  thumb: '#FF4444',      // Bright Red
  index: '#44FF44',      // Bright Green
  middle: '#4444FF',     // Bright Blue
  ring: '#FFFF44',       // Bright Yellow
  pinky: '#FF44FF',      // Bright Magenta
  palm: '#44FFFF'        // Bright Cyan
};

// Global variables
let detector;
let world;
let video;
let debug;
let handGrObject; // GrObject wrapper for the hand group
let handGroup; // Group to hold all hand geometry
let sphereMeshes = []; // Array to hold sphere meshes for landmarks
let cylinderMeshes = []; // Array to hold cylinder meshes for connections
let handInitialized = false; // Flag to track if hand geometry has been created

// Function to get color for a landmark index
function getLandmarkColor(index) {
  if (index >= 1 && index <= 4) return COLORS.thumb;
  if (index >= 5 && index <= 8) return COLORS.index;
  if (index >= 9 && index <= 12) return COLORS.middle;
  if (index >= 13 && index <= 16) return COLORS.ring;
  if (index >= 17 && index <= 20) return COLORS.pinky;
  return COLORS.palm;
}

// Function to create 3D hand visualization
// TODO: Student's solution
function get3DHand(hand) {
  if (!hand || !hand.keypoints3D) {
    return;
  }
  
  const nodes = hand.keypoints3D;
  if (!nodes || nodes.length === 0) {
    return;
  }
  
  // Create hand geometry if not already initialized
  if (!handInitialized) {
    // Create new group for this hand
    handGroup = new T.Group();
    handGrObject = new GrObject("hand-group", handGroup);
    
    // Set the hand object's position in the world
    handGrObject.objects[0].position.set(0, 1, 0);
    handGrObject.objects[0].scale.set(3, 3, 3);
    
    world.add(handGrObject);
    
    // Create spheres for nodes (21 landmarks)
    for (let i = 0; i < 21; i++) {
      const sphereGeometry = new T.SphereGeometry(0.03, 16, 16);
      const sphereMaterial = new T.MeshStandardMaterial({ 
        color: getLandmarkColor(i),
        metalness: 0.3,
        roughness: 0.4
      });
      const sphere = new T.Mesh(sphereGeometry, sphereMaterial);
      sphereMeshes.push(sphere);
    }
    handGroup.add(...sphereMeshes);
    
    // Create cylinders for connections
    for (const connection of HAND_CONNECTIONS) {
      const cylinderGeometry = new T.CylinderGeometry(0.015, 0.015, 1, 8);
      const cylinderMaterial = new T.MeshStandardMaterial({ color: '#FFFFFF' });
      const cylinder = new T.Mesh(cylinderGeometry, cylinderMaterial);
      cylinderMeshes.push(cylinder);
    }
    handGroup.add(...cylinderMeshes);
    
    handInitialized = true;
  }
  
  // Update sphere positions
  for (let i = 0; i < nodes.length && i < sphereMeshes.length; i++) {
    const node = nodes[i];
    if (node && node.x !== undefined && node.y !== undefined) {
      // Set 3D coordinates (already provided in keypoints3D)
      // Scale to reasonable 3D size, as positions in keypoints3D are typically normalized to (-1, 1)
      const spherePosition = new T.Vector3(
        -node.x * 4,
        -node.y * 4,
        node.z ? -node.z * 4 : 0
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
  for (const connection of HAND_CONNECTIONS) {
    const [startIndex, endIndex] = connection;
    if (nodes[startIndex] && nodes[endIndex] && cylinderIndex < cylinderMeshes.length) {
      const startNode = nodes[startIndex];
      const endNode = nodes[endIndex];
      
      if (startNode.x !== undefined && startNode.y !== undefined &&
          endNode.x !== undefined && endNode.y !== undefined) {
        
        // Set 3D coordinates (already provided in keypoints3D)
        const start3D = new T.Vector3(
          -startNode.x * 4,
          -startNode.y * 4,
          startNode.z ? -startNode.z * 4 : 0
        );
        
        const end3D = new T.Vector3(
          -endNode.x * 4,
          -endNode.y * 4,
          endNode.z ? -endNode.z * 4 : 0
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
    const hands = await detector.estimateHands(video, estimationConfig);
    
    // Update debug info
    debug.textContent = `Video: ${video.videoWidth}x${video.videoHeight}\nHands detected: ${hands.length}\n`;
    
    // Create 3D visualization for each detected hand
    hands.forEach((hand, index) => {
      const handedness = hand.handedness || 'Unknown';
      const confidence = hand.handednessScore ? hand.handednessScore.toFixed(3) : 'N/A';
      debug.textContent += `Hand ${index + 1}: ${handedness} (confidence: ${confidence})\n`;
      get3DHand(hand);
    });
    
  } catch (error) {
    debug.textContent = `Detection error: ${error.message}`;
    console.error('Detection error:', error);
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
    while (typeof handPoseDetection === 'undefined' && attempts < 100) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
      if (attempts % 10 === 0) {
        debug.textContent = `Loading dependencies... (${attempts}/100)`;
      }
    }
    
    if (typeof handPoseDetection === 'undefined') {
      throw new Error('TensorFlow.js hand pose detection not loaded after 10 seconds');
    }
    
    // Initialize TensorFlow.js backend
    if (typeof tf !== 'undefined' && tf.backend) {
      debug.textContent = 'Initializing TensorFlow.js backend...';
      await tf.ready();
      console.log('TensorFlow.js backend initialized');
    }
    
    debug.textContent = 'Creating detector...';
    console.log('Creating detector with config:', detectorConfig);
    
    detector = await handPoseDetection.createDetector(model, detectorConfig);
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
debug = document.getElementById('debug');

// Add some lighting to better see the hand
const ambientLight = new T.AmbientLight(0x404040, 0.6);
world.add(new GrObject("ambient-light", ambientLight));

const directionalLight = new T.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
world.add(new GrObject("directional-light", directionalLight));

// run the animation/interaction loop
world.go();

// Start hand detection initialization
init();
// @@Snippet:end
