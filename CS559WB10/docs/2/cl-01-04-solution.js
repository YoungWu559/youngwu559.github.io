import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";

class AdvancedClothSimulation extends GrObject {
    constructor() {
        const group = new T.Group();

        const uiParams = [
            ["Resolution", 8, 20, 12, 1],
            ["Spring Stiffness", 10, 1000, 200, 10],
            ["Bending Stiffness", 0, 500, 50, 1],
            ["Timestep", 0.001, 0.05, 0.008, 0.001],
            ["Damping", 0.90, 0.999, 0.98, 0.001],
            ["Air Resistance", 0, 5, 0.1, 0.01],
            ["Wind Strength", 0, 20, 3, 0.1],
            ["Wind Turbulence", 0, 5, 1, 0.1],
            ["Gravity", -50, 0, -9.8, 0.1],
            ["Integration Method", 0, 2, 1, 1],
            ["Show Cloth Mesh", 0, 1, 1, 1],              // Toggle cloth mesh visibility
            ["Show Structural", 0, 1, 0, 1],              // Show structural springs
            ["Show Diagonal", 0, 1, 0, 1],                // Show diagonal springs
            ["Show Bending", 0, 1, 0, 1],                 // Show bending springs
            ["Sphere Radius", 0.2, 1.0, 0.5, 0.05],
            ["Sphere Speed", 1.0, 5.0, 3.0, 0.1],
            ["Corner Height", 3, 8, 5, 0.1],
            ["Corner Width", 1, 5, 2.75, 0.05],
        ];

        super("AdvancedClothSimulation", group, uiParams);

        // Physics constants
        this.group = group;
        this.mass = 1.0;
        this.restLength = 0.25;
        this.diagonalRestLength = this.restLength * Math.sqrt(2);
        this.bendingRestLength = this.restLength * 2;

        // Initialize systems
        this.initializeWind();
        this.initializeSphere();
        this.resetSimulation();
        this.createVisuals();
    }

    initializeWind() {
        this.windTime = 0;
        this.windNoise = Array.from({length: 100}, () => ({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2,
            frequency: 0.5 + Math.random() * 2
        }));
    }

    initializeSphere() {
        this.sphereTime = 0;
        this.spherePosition = new T.Vector3(0, 0.5, -4);
        this.sphereDirection = 1;
        this.sphereTargetReached = false;
    }


    resetSimulation() {
        const res = (this.values && this.values["Resolution"] !== undefined) ? this.values["Resolution"] : 12;

        this.resolution = res;
        this.masses = [];
        this.springs = [];

        // Initialize masses with previous positions for Verlet integration
        for (let i = 0; i < res; i++) {
            this.masses[i] = [];
            for (let j = 0; j < res; j++) {
                const x = (j - (res - 1) / 2) * this.restLength;
                const y = 5 - (i * this.restLength);
                const z = 0;

                // Fix only top corners
                const isFixed = (i === 0 && (j === 0 || j === res - 1));

                this.masses[i][j] = {
                    position: new T.Vector3(x, y, z),
                    prevPosition: new T.Vector3(x, y, z), // For Verlet integration
                    velocity: new T.Vector3(0, 0, 0),
                    fixed: isFixed
                };
            }
        }

        this.createSprings();

        console.log("Advanced cloth simulation reset with resolution:", res);
        console.log("Total springs:", this.springs.length);

        if (this.masspoints) {
            this.clearVisuals();
            this.createVisuals();
        }
    }

    createSprings() {
        this.springs = [];
        const res = this.resolution;

        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                // Structural springs (immediate neighbors)
                if (j < res - 1) {
                    this.springs.push({
                        i1: i, j1: j, i2: i, j2: j + 1,
                        restLength: this.restLength,
                        type: 'structural'
                    });
                }
                if (i < res - 1) {
                    this.springs.push({
                        i1: i, j1: j, i2: i + 1, j2: j,
                        restLength: this.restLength,
                        type: 'structural'
                    });
                }

                // Diagonal springs (X-pattern for better mesh connectivity)
                if (i < res - 1 && j < res - 1) {
                    this.springs.push({
                        i1: i, j1: j, i2: i + 1, j2: j + 1,
                        restLength: this.diagonalRestLength,
                        type: 'diagonal'
                    });
                }
                if (i < res - 1 && j > 0) {
                    this.springs.push({
                        i1: i, j1: j, i2: i + 1, j2: j - 1,
                        restLength: this.diagonalRestLength,
                        type: 'diagonal'
                    });
                }

                // Bending constraints (two-ring neighbors)
                if (j < res - 2) {
                    this.springs.push({
                        i1: i, j1: j, i2: i, j2: j + 2,
                        restLength: this.bendingRestLength,
                        type: 'bending'
                    });
                }
                if (i < res - 2) {
                    this.springs.push({
                        i1: i, j1: j, i2: i + 2, j2: j,
                        restLength: this.bendingRestLength,
                        type: 'bending'
                    });
                }
            }
        }
    }

    clearVisuals() {
        if (this.masspoints) {
            this.masspoints.forEach(row => {
                row.forEach(masspoint => {
                    this.group.remove(masspoint);
                });
            });
        }
        // Remove all spring line arrays
        if (this.structuralLines) {
            this.structuralLines.forEach(line => this.group.remove(line));
        }
        if (this.diagonalLines) {
            this.diagonalLines.forEach(line => this.group.remove(line));
        }
        if (this.bendingLines) {
            this.bendingLines.forEach(line => this.group.remove(line));
        }
        if (this.clothMesh) {
            this.group.remove(this.clothMesh);
        }
        if (this.collisionSphere) {
            this.group.remove(this.collisionSphere);
        }
    }

    createVisuals() {
        this.masspoints = [];

        // Initialize spring line arrays for each type
        this.structuralLines = [];
        this.diagonalLines = [];
        this.bendingLines = [];

        // Load texture
        const textureLoader = new T.TextureLoader();
        const clothTexture = textureLoader.load('../docs/2/bucky.png');
        clothTexture.wrapS = T.RepeatWrapping;
        clothTexture.wrapT = T.RepeatWrapping;
        clothTexture.repeat.set(2, 2); // Repeat texture 2x2 across the cloth

        // Create cloth mesh with triangles
        this.createClothMesh(clothTexture);

        // Create collision sphere
        this.createCollisionSphere();

        // Create mass point spheres (smaller, for debugging)
        for (let i = 0; i < this.resolution; i++) {
            this.masspoints[i] = [];
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                const sphereGeometry = new T.SphereGeometry(0.008, 6, 6);
                const color = mass.fixed ? 0x666666 : 0xff4444;
                const sphereMaterial = new T.MeshPhongMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.7
                });
                const masspoint = new T.Mesh(sphereGeometry, sphereMaterial);
                masspoint.position.copy(mass.position);
                this.masspoints[i][j] = masspoint;
                this.group.add(masspoint);
            }
        }

        // ===== CREATE WIREFRAME FOR ALL SPRING TYPES =====
        // Each spring type gets its own color for easy identification:
        // - Structural (white): Basic grid structure
        // - Diagonal (yellow): Prevent shearing
        // - Bending (cyan): Resist folding

        this.springs.forEach(spring => {
            const mass1 = this.masses[spring.i1][spring.j1];
            const mass2 = this.masses[spring.i2][spring.j2];

            // Create line geometry
            const lineGeometry = new T.BufferGeometry();
            const positions = new Float32Array([
                mass1.position.x, mass1.position.y, mass1.position.z,
                mass2.position.x, mass2.position.y, mass2.position.z
            ]);
            lineGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));

            let lineMaterial, springLine;

            // Create line with appropriate color based on spring type
            if (spring.type === 'structural') {
                lineMaterial = new T.LineBasicMaterial({
                    color: 0xffffff,      // White for structural
                    opacity: 0.6,
                    transparent: true,
                    linewidth: 2
                });
                springLine = new T.Line(lineGeometry, lineMaterial);
                springLine.visible = false;  // Hidden by default
                this.structuralLines.push(springLine);
                this.group.add(springLine);

            } else if (spring.type === 'diagonal') {
                lineMaterial = new T.LineBasicMaterial({
                    color: 0xffff00,      // Yellow for diagonal (shear)
                    opacity: 0.5,
                    transparent: true,
                    linewidth: 1
                });
                springLine = new T.Line(lineGeometry, lineMaterial);
                springLine.visible = false;  // Hidden by default
                this.diagonalLines.push(springLine);
                this.group.add(springLine);

            } else if (spring.type === 'bending') {
                lineMaterial = new T.LineBasicMaterial({
                    color: 0x00ffff,      // Cyan for bending
                    opacity: 0.4,
                    transparent: true,
                    linewidth: 1
                });
                springLine = new T.Line(lineGeometry, lineMaterial);
                springLine.visible = false;  // Hidden by default
                this.bendingLines.push(springLine);
                this.group.add(springLine);
            }
        });
    }

    createClothMesh(texture) {
        const res = this.resolution;
        const vertices = [];
        const uvs = [];
        const indices = [];
        const normals = [];

        // Create vertices and UVs
        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                const mass = this.masses[i][j];
                vertices.push(mass.position.x, mass.position.y, mass.position.z);

                // UV coordinates (0,0) to (1,1)
                uvs.push(j / (res - 1), i / (res - 1));
            }
        }

        // Create triangle indices
        for (let i = 0; i < res - 1; i++) {
            for (let j = 0; j < res - 1; j++) {
                const a = i * res + j;
                const b = i * res + j + 1;
                const c = (i + 1) * res + j;
                const d = (i + 1) * res + j + 1;

                // Two triangles per quad
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        // Calculate normals (will be updated each frame)
        for (let i = 0; i < vertices.length / 3; i++) {
            normals.push(0, 0, 1); // Initial normal pointing up
        }

        // Create geometry
        const geometry = new T.BufferGeometry();
        geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('uv', new T.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setAttribute('normal', new T.BufferAttribute(new Float32Array(normals), 3));
        geometry.setIndex(indices);

        // Create material with texture and enhanced properties
        const material = new T.MeshPhongMaterial({
            map: texture,
            side: T.DoubleSide, // Show both sides of the cloth
            transparent: false,
            shininess: 30,
            specular: 0x111111,
            // Enable shadow receiving
            shadowSide: T.DoubleSide
        });

        // Create mesh
        this.clothMesh = new T.Mesh(geometry, material);
        this.clothMesh.castShadow = true;
        this.clothMesh.receiveShadow = true;
        this.group.add(this.clothMesh);
    }

    createCollisionSphere() {
        const radius = (this.values && this.values["Sphere Radius"] !== undefined) ? this.values["Sphere Radius"] : 0.5;

        // Create sphere geometry and material
        const sphereGeometry = new T.SphereGeometry(radius, 32, 32);
        const sphereMaterial = new T.MeshPhongMaterial({
            color: 0xff6600,
            shininess: 100,
            specular: 0x444444
        });

        this.collisionSphere = new T.Mesh(sphereGeometry, sphereMaterial);
        this.collisionSphere.position.copy(this.spherePosition);
        this.collisionSphere.castShadow = true;
        this.collisionSphere.receiveShadow = true;

        this.group.add(this.collisionSphere);
    }

    getParameters() {
        return {
            springStiffness: this.getValue("Spring Stiffness", 200),
            bendingStiffness: this.getValue("Bending Stiffness", 50),
            timestep: this.getValue("Timestep", 0.008),
            damping: this.getValue("Damping", 0.98),
            airResistance: this.getValue("Air Resistance", 0.1),
            windStrength: this.getValue("Wind Strength", 3),
            windTurbulence: this.getValue("Wind Turbulence", 1),
            gravityY: this.getValue("Gravity", -9.8),
            integrationMethod: Math.round(this.getValue("Integration Method", 1)),
            resolution: this.getValue("Resolution", 12),
            sphereRadius: this.getValue("Sphere Radius", 0.5),
            sphereSpeed: this.getValue("Sphere Speed", 3.0),
            cornerHeight: this.getValue("Corner Height", 5),
            cornerWidth: this.getValue("Corner Width", 2.75),
            showClothMesh: this.getValue("Show Cloth Mesh", 1) > 0.5,
            showStructural: this.getValue("Show Structural", 0) > 0.5,
            showDiagonal: this.getValue("Show Diagonal", 0) > 0.5,
            showBending: this.getValue("Show Bending", 0) > 0.5,
        };
    }

    getValue(key, defaultValue) {
        return (this.values && this.values[key] !== undefined) ? this.values[key] : defaultValue;
    }

    updateSphere(params, dt) {
        this.sphereTime += dt;

        // Roll sphere on the ground toward cloth (Z direction)
        this.spherePosition.z += this.sphereDirection * params.sphereSpeed * dt;
        this.spherePosition.y = params.sphereRadius; // Keep on ground level (Y=0 is ground)
        this.spherePosition.x = 0; // Keep centered with cloth

        // Bounce between boundaries (moving toward and away from cloth)
        if (this.spherePosition.z > 4) {
            this.spherePosition.z = 4;
            this.sphereDirection = -1;
        } else if (this.spherePosition.z < -4) {
            this.spherePosition.z = -4;
            this.sphereDirection = 1;
        }

        // Update visual position and rotation (rolling motion)
        if (this.collisionSphere) {
            this.collisionSphere.position.copy(this.spherePosition);
            const rotationSpeed = params.sphereSpeed / params.sphereRadius;
            // Rotate around X-axis for rolling in Z direction
            this.collisionSphere.rotation.x += this.sphereDirection * rotationSpeed * dt;
        }
    }

    updateWind(dt) {
        this.windTime += dt * 2;
    }

    calculateForces(params) {
        const forces = Array.from({length: this.resolution}, () =>
            Array.from({length: this.resolution}, () =>
                new T.Vector3(0, params.gravityY * this.mass, 0)
            )
        );

        // Add wind, spring, and air resistance forces
        this.addWindForces(forces, params);
        this.addSpringForces(forces, params);
        this.addAirResistanceForces(forces, params);

        return forces;
    }

    addWindForces(forces, params) {
        if (params.windStrength <= 0) return;

        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                if (mass.fixed) continue;

                // Base wind direction
                const baseWind = new T.Vector3(params.windStrength, 0, params.windStrength * 0.3);

                // Add turbulence using multiple sine waves
                let turbulence = new T.Vector3(0, 0, 0);
                for (let n = 0; n < this.windNoise.length; n++) {
                    const noise = this.windNoise[n];
                    const spatialFactor = (i * 0.3 + j * 0.2 + n * 0.1);
                    const timeFactor = this.windTime * noise.frequency;

                    turbulence.x += noise.x * Math.sin(spatialFactor + timeFactor);
                    turbulence.y += noise.y * Math.sin(spatialFactor * 1.3 + timeFactor * 0.7);
                    turbulence.z += noise.z * Math.sin(spatialFactor * 0.8 + timeFactor * 1.2);
                }

                turbulence.multiplyScalar(params.windTurbulence / this.windNoise.length);

                // Combine base wind and turbulence
                const windForce = baseWind.clone().add(turbulence);

                // Altitude-based scaling
                const altitudeFactor = 1 + (mass.position.y - 1) * 0.2;
                windForce.multiplyScalar(altitudeFactor);

                forces[i][j].add(windForce);
            }
        }
    }

    addSpringForces(forces, params) {
        this.springs.forEach(spring => {
            const mass1 = this.masses[spring.i1][spring.j1];
            const mass2 = this.masses[spring.i2][spring.j2];

            const displacement = new T.Vector3().subVectors(mass1.position, mass2.position);
            const currentLength = displacement.length();

            if (currentLength > 0) {
                const extension = currentLength - spring.restLength;
                const springDirection = displacement.clone().normalize();

                // Use different stiffness for different spring types
                let stiffness = params.springStiffness;
                if (spring.type === 'bending') {
                    stiffness = params.bendingStiffness;
                } else if (spring.type === 'diagonal') {
                    stiffness = params.springStiffness * 0.7;
                }

                const springForce = springDirection.clone().multiplyScalar(-stiffness * extension);

                if (!mass1.fixed) forces[spring.i1][spring.j1].add(springForce);
                if (!mass2.fixed) forces[spring.i2][spring.j2].sub(springForce);
            }
        });
    }

    addAirResistanceForces(forces, params) {
        if (params.airResistance <= 0) return;

        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                if (mass.fixed) continue;

                const speed = mass.velocity.length();
                if (speed > 0) {
                    const dragDirection = mass.velocity.clone().normalize();
                    const dragMagnitude = params.airResistance * speed * speed;
                    const dragForce = dragDirection.multiplyScalar(-dragMagnitude);
                    forces[i][j].add(dragForce);
                }
            }
        }
    }

    stepWorld() {
        const params = this.getParameters();

        // Check if we need to recreate visuals due to parameter changes
        const currentSphereRadius = this.collisionSphere ? this.collisionSphere.geometry.parameters.radius : 0;
        if (params.resolution !== this.resolution || Math.abs(currentSphereRadius - params.sphereRadius) > 0.01) {
            this.resetSimulation();
            return;
        }

        const dt = params.timestep;

        // Update fixed corner positions based on UI parameters
        const res = this.resolution;
        if (this.masses && this.masses[0]) {
            // Update left corner (top-left)
            if (this.masses[0][0] && this.masses[0][0].fixed) {
                this.masses[0][0].position.y = params.cornerHeight;
                this.masses[0][0].position.x = -params.cornerWidth;
                this.masses[0][0].prevPosition.copy(this.masses[0][0].position);
            }
            // Update right corner (top-right)
            if (this.masses[0][res - 1] && this.masses[0][res - 1].fixed) {
                this.masses[0][res - 1].position.y = params.cornerHeight;
                this.masses[0][res - 1].position.x = params.cornerWidth;
                this.masses[0][res - 1].prevPosition.copy(this.masses[0][res - 1].position);
            }
        }

        this.updateSphere(params, dt);
        this.updateWind(dt);

        const forces = this.calculateForces(params);

        // Integration step
        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                if (!mass.fixed) {
                    const acceleration = forces[i][j].clone().divideScalar(this.mass);

                    if (params.integrationMethod === 0) {
                        // Explicit Euler
                        mass.velocity.add(acceleration.clone().multiplyScalar(dt));
                        mass.velocity.multiplyScalar(params.damping);
                        mass.position.add(mass.velocity.clone().multiplyScalar(dt));
                    } else if (params.integrationMethod === 1) {
                        // Verlet integration (more stable)
                        const newPosition = mass.position.clone()
                            .multiplyScalar(2)
                            .sub(mass.prevPosition)
                            .add(acceleration.clone().multiplyScalar(dt * dt));

                        // Update velocity for damping calculation
                        mass.velocity = new T.Vector3().subVectors(newPosition, mass.position).divideScalar(dt);
                        mass.velocity.multiplyScalar(params.damping);

                        // Store previous position
                        mass.prevPosition.copy(mass.position);
                        mass.position.copy(newPosition);

                        // Apply damping by adjusting previous position
                        const dampedVel = mass.velocity.clone().multiplyScalar(dt);
                        mass.prevPosition = mass.position.clone().sub(dampedVel);
                    } else if (params.integrationMethod === 2) {
                        // Semi-implicit Euler (symplectic)
                        mass.velocity.add(acceleration.clone().multiplyScalar(dt));
                        mass.velocity.multiplyScalar(params.damping);
                        mass.position.add(mass.velocity.clone().multiplyScalar(dt));
                        mass.prevPosition.copy(mass.position);
                    }

                    // NaN detection
                    if (isNaN(mass.position.x) || isNaN(mass.position.y) || isNaN(mass.position.z) ||
                        isNaN(mass.velocity.x) || isNaN(mass.velocity.y) || isNaN(mass.velocity.z) ||
                        mass.position.length() > 1000 || mass.velocity.length() > 1000) {
                        console.log("NaN detected! Resetting simulation.");
                        this.resetSimulation();
                        return;
                    }
                }
            }
        }

        // Collision detection and response with sphere
        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                if (!mass.fixed) {
                    const distanceToSphere = mass.position.distanceTo(this.spherePosition);
                    const minDistance = params.sphereRadius + 0.15; // Small buffer to prevent penetration

                    if (distanceToSphere < minDistance) {
                        // Calculate collision response
                        const collisionDirection = new T.Vector3()
                            .subVectors(mass.position, this.spherePosition)
                            .normalize();

                        // Push the mass point outside the sphere
                        const penetrationDepth = minDistance - distanceToSphere;
                        mass.position.add(collisionDirection.clone().multiplyScalar(penetrationDepth));

                        // Apply collision response to velocity
                        const velocityAlongNormal = mass.velocity.dot(collisionDirection);

                        if (velocityAlongNormal < 0) {
                            // Remove the component of velocity going into the sphere
                            const restitution = 0.3; // Bounce factor
                            const velocityCorrection = collisionDirection
                                .clone()
                                .multiplyScalar(velocityAlongNormal * (1 + restitution));
                            mass.velocity.sub(velocityCorrection);

                            // Add some friction
                            const tangentialVelocity = mass.velocity
                                .clone()
                                .sub(collisionDirection.clone().multiplyScalar(mass.velocity.dot(collisionDirection)));
                            mass.velocity.sub(tangentialVelocity.multiplyScalar(0.2)); // 20% friction
                        }
                    }
                }
            }
        }

        // Ground collision detection and response
        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                const mass = this.masses[i][j];
                if (!mass.fixed) {
                    const groundLevel = 0; // Ground is at Y = 0
                    const buffer = 0.05; // Small buffer above ground

                    if (mass.position.y < groundLevel + buffer) {
                        // Push mass above ground
                        mass.position.y = groundLevel + buffer;

                        // Apply collision response to velocity
                        if (mass.velocity.y < 0) {
                            const restitution = 0.2; // Bounce factor for ground
                            mass.velocity.y = -mass.velocity.y * restitution;

                            // Add friction to horizontal movement
                            mass.velocity.x *= 0.8;
                            mass.velocity.z *= 0.8;
                        }
                    }
                }
            }
        }

        // Update visuals
        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                this.masspoints[i][j].position.copy(this.masses[i][j].position);
            }
        }

        // ===== Update Cloth Mesh Visibility =====
        if (this.clothMesh) {
            this.clothMesh.visible = params.showClothMesh;
        }

        // Update cloth mesh vertices
        if (this.clothMesh && params.showClothMesh) {
            const positions = this.clothMesh.geometry.attributes.position.array;
            const normals = this.clothMesh.geometry.attributes.normal.array;
            const res = this.resolution;

            // Update vertex positions
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const index = (i * res + j) * 3;
                    const mass = this.masses[i][j];
                    positions[index] = mass.position.x;
                    positions[index + 1] = mass.position.y;
                    positions[index + 2] = mass.position.z;
                }
            }

            // Calculate normals for proper lighting
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const index = (i * res + j) * 3;
                    let normal = new T.Vector3(0, 0, 0);

                    // Calculate normal as average of surrounding triangle normals
                    const centerPos = this.masses[i][j].position;

                    // Check all adjacent triangles
                    const neighbors = [
                        { di: -1, dj: -1 }, { di: -1, dj: 0 }, { di: 0, dj: -1 },
                        { di: 0, dj: 1 }, { di: 1, dj: 0 }, { di: 1, dj: 1 }
                    ];

                    let normalCount = 0;
                    for (let n = 0; n < neighbors.length - 1; n++) {
                        const n1 = neighbors[n];
                        const n2 = neighbors[n + 1];

                        const i1 = i + n1.di;
                        const j1 = j + n1.dj;
                        const i2 = i + n2.di;
                        const j2 = j + n2.dj;

                        if (i1 >= 0 && i1 < res && j1 >= 0 && j1 < res &&
                            i2 >= 0 && i2 < res && j2 >= 0 && j2 < res) {

                            const v1 = new T.Vector3().subVectors(this.masses[i1][j1].position, centerPos);
                            const v2 = new T.Vector3().subVectors(this.masses[i2][j2].position, centerPos);
                            const triangleNormal = new T.Vector3().crossVectors(v1, v2).normalize();

                            normal.add(triangleNormal);
                            normalCount++;
                        }
                    }

                    if (normalCount > 0) {
                        normal.divideScalar(normalCount).normalize();
                    } else {
                        normal.set(0, 0, 1); // Default normal
                    }

                    normals[index] = normal.x;
                    normals[index + 1] = normal.y;
                    normals[index + 2] = normal.z;
                }
            }

            this.clothMesh.geometry.attributes.position.needsUpdate = true;
            this.clothMesh.geometry.attributes.normal.needsUpdate = true;
        }

        // ===== Update Wireframe (Spring Lines) =====
        // Update visibility and positions for each spring type

        // Helper function to update spring line positions
        const updateSpringLines = (lines, springs, visible) => {
            lines.forEach((line, idx) => {
                line.visible = visible;
                if (visible && springs[idx]) {
                    const spring = springs[idx];
                    const positions = line.geometry.attributes.position.array;
                    const mass1 = this.masses[spring.i1][spring.j1];
                    const mass2 = this.masses[spring.i2][spring.j2];
                    positions[0] = mass1.position.x;
                    positions[1] = mass1.position.y;
                    positions[2] = mass1.position.z;
                    positions[3] = mass2.position.x;
                    positions[4] = mass2.position.y;
                    positions[5] = mass2.position.z;
                    line.geometry.attributes.position.needsUpdate = true;
                }
            });
        };

        // Filter springs by type
        const structuralSprings = this.springs.filter(s => s.type === 'structural');
        const diagonalSprings = this.springs.filter(s => s.type === 'diagonal');
        const bendingSprings = this.springs.filter(s => s.type === 'bending');

        // Update each spring type
        updateSpringLines(this.structuralLines, structuralSprings, params.showStructural);
        updateSpringLines(this.diagonalLines, diagonalSprings, params.showDiagonal);
        updateSpringLines(this.bendingLines, bendingSprings, params.showBending);
    }
}

// Create and add the div elements to the page
const div1 = document.createElement('div');
div1.id = 'div1';
document.body.appendChild(div1);

let world = new GrWorld({
    where: div1,
    groundplane: false
});

// Enhanced lighting setup for cloth visualization
// Ambient light for base illumination
const ambientLight = new T.AmbientLight(0x404040, 0.3);
world.scene.add(ambientLight);

// Main directional light (sun-like)
const mainLight = new T.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(8, 12, 6);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -10;
mainLight.shadow.camera.right = 10;
mainLight.shadow.camera.top = 10;
mainLight.shadow.camera.bottom = -10;
world.scene.add(mainLight);

// Secondary directional light for fill lighting
const fillLight = new T.DirectionalLight(0x87ceeb, 0.3);
fillLight.position.set(-5, 8, -3);
world.scene.add(fillLight);

// Point light for dynamic highlights
const pointLight = new T.PointLight(0xffffff, 0.5, 20);
pointLight.position.set(3, 6, 3);
world.scene.add(pointLight);

// Hemisphere light for soft environmental lighting
const hemisphereLight = new T.HemisphereLight(0x87ceeb, 0x362d1d, 0.4);
world.scene.add(hemisphereLight);

// Enable shadows in the renderer
if (world.renderer) {
    world.renderer.shadowMap.enabled = true;
    world.renderer.shadowMap.type = T.PCFSoftShadowMap;
}

// Add a simple ground plane to show shadows
// NOTE: This must match the physical ground level (Y = 0) defined in collision detection
const groundGeometry = new T.PlaneGeometry(20, 20);
const groundMaterial = new T.MeshPhongMaterial({
    color: 0x999999,
    transparent: true,
    opacity: 0.3
});
const groundMesh = new T.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = 0;  // Match the physical ground level (was -2, now corrected to 0)
groundMesh.receiveShadow = true;
world.scene.add(groundMesh);

const advancedClothSimulation = new AdvancedClothSimulation();
world.add(advancedClothSimulation);

// Create AutoUI for the cloth simulation
new AutoUI(advancedClothSimulation);

const resetButton = document.createElement('button');
resetButton.innerHTML = 'Reset Simulation';
resetButton.style.padding = '10px 20px';
resetButton.style.fontSize = '14px';
resetButton.style.backgroundColor = '#4CAF50';
resetButton.style.color = 'white';
resetButton.style.border = 'none';
resetButton.style.borderRadius = '4px';
resetButton.style.cursor = 'pointer';
resetButton.style.margin = '10px';

resetButton.addEventListener('click', function() {
    advancedClothSimulation.resetSimulation();
});

document.body.appendChild(resetButton);


world.camera.position.set(5, 4, 5);
world.camera.lookAt(0, 2, 0);

world.go();