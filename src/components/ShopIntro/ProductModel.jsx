import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ProductInfo from "./ProductInfo"



function ProductModel() {
  // Refs for Three.js 3D model canvas and controls
  const modelCanvasRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const autoRotateRef = useRef(true);
  const lastInteractionRef = useRef(Date.now());
  
  // Refs for particle animation system
  const particleCanvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef();
  const circlesRef = useRef([]);

  // Particle class for animated background circles
  class Circle {
    constructor(x, y, dx, dy, radius, color) {
      this.x = x;                    // X position
      this.y = y;                    // Y position
      this.dx = dx;                  // X velocity
      this.dy = dy;                  // Y velocity
      this.radius = radius;          // Current radius
      this.minRadius = radius;       // Minimum radius
      this.color = color;            // Circle color
      this.maxRadius = 1.5;          // Maximum radius when mouse hovers
    }

    // Draw circle on canvas context
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update circle position and handle mouse interaction
    update(ctx, canvas, mouse) {
      // Bounce off canvas edges
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      // Move circle based on velocity
      this.x += this.dx;
      this.y += this.dy;

      // Mouse interaction - expand circle when mouse is nearby
      const mouseDistance = 50;
      if (
        mouse.x - this.x < mouseDistance &&
        mouse.x - this.x > -mouseDistance &&
        mouse.y - this.y < mouseDistance &&
        mouse.y - this.y > -mouseDistance
      ) {
        if (this.radius < this.maxRadius) {
          this.radius += 1;
        }
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw(ctx);
    }
  }

  // Initialize particle system with 800 animated circles
  const initParticles = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    // Color palette for particles
    const colorArray = ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'];
    const circles = [];

    // Create 800 random particles
    for (let i = 0; i < 800; i++) {
      const radius = 0.5;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 1.5;
      const dy = (Math.random() - 1) * 1.5;
      const color = colorArray[Math.floor(Math.random() * colorArray.length)];

      circles.push(new Circle(x, y, dx, dy, radius, color));
    }

    circlesRef.current = circles;
  };

  // Animation loop for particle system
  const animateParticles = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all particles
    circlesRef.current.forEach(circle => {
      circle.update(ctx, canvas, mouseRef.current);
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  // Track mouse position for particle interaction
  const handleMouseMove = (e) => {
    const rect = particleCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  // Handle window resize for particle canvas
  const handleParticleResize = () => {
    const canvas = particleCanvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    // Initialize particle animation system
    const particleCanvas = particleCanvasRef.current;
    if (particleCanvas) {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
      
      initParticles();
      animateParticles();
      
      window.addEventListener('resize', handleParticleResize);
      particleCanvas.addEventListener('mousemove', handleMouseMove);
    }

    // Initialize Three.js 3D model viewer
    const canvas = modelCanvasRef.current;
    const heroSection = document.querySelector(".main-hero-section");
    const modelContainer = document.querySelector(".model-container");
    
    if (!canvas || !heroSection || !modelContainer) return;

    // Create Three.js scene
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    
    // Set canvas dimensions based on container size
    const sizes = {
      width: modelContainer.clientWidth,
      height: modelContainer.clientHeight,
    };

    // Create perspective camera with optimal settings
    const camera = new THREE.PerspectiveCamera(
      25,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = -10;
    camera.position.y = 4;
    camera.position.z = 12;
    scene.add(camera);

    // Setup orbit controls for 3D model interaction
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 18;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Handle user interaction with 3D model
    const onInteractionStart = () => {
      autoRotateRef.current = true;
      lastInteractionRef.current = Date.now();
    };

    const onInteractionEnd = () => {
      setTimeout(() => {
        if (Date.now() - lastInteractionRef.current >= 30) {
          autoRotateRef.current = true;
        }
      }, 30);
    };

    // Add event listeners for user interaction
    canvas.addEventListener('mousedown', onInteractionStart);
    canvas.addEventListener('touchstart', onInteractionStart);
    canvas.addEventListener('mouseup', onInteractionEnd);
    canvas.addEventListener('touchend', onInteractionEnd);
    canvas.addEventListener('wheel', onInteractionStart);

    // Setup WebGL renderer with optimal settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);

    // Setup lighting system for optimal model visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight1.position.set(5, 5, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight3.position.set(0, -5, 5);
    scene.add(directionalLight3);

    // Load 3D model using GLTF loader
    const loader = new GLTFLoader();

    loader.load(
      "/Waste1.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        
        // Center and scale the model appropriately
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.sub(center);
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxSize;
        model.scale.setScalar(scale);
        
        scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );

    // Handle window resize for 3D canvas
    const handleResize = () => {
      const newSizes = {
        width: modelContainer.clientWidth,
        height: modelContainer.clientHeight,
      };
      
      camera.aspect = newSizes.width / newSizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newSizes.width, newSizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Main animation loop for 3D scene
    const tick = () => {
      // Auto-rotate the model when not being interacted with
      if (autoRotateRef.current && modelRef.current) {
        modelRef.current.rotation.y += 0.002;
      }
      
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // Cleanup function
    return () => {
      // Cleanup particle animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleParticleResize);
      particleCanvas?.removeEventListener('mousemove', handleMouseMove);
      
      // Cleanup Three.js resources
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener('mousedown', onInteractionStart);
      canvas.removeEventListener('touchstart', onInteractionStart);
      canvas.removeEventListener('mouseup', onInteractionEnd);
      canvas.removeEventListener('touchend', onInteractionEnd);
      canvas.removeEventListener('wheel', onInteractionStart);
      
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="main-hero-section">
      {/* Particle animation canvas background */}
      <canvas 
        ref={particleCanvasRef}
        className="particle-background-canvas"
      />
      
      {/* Left section - 3D Model Viewer */}
      <div className="model-section">
        <div className="model-container">
          <canvas ref={modelCanvasRef} className="model-canvas"></canvas>
        </div>
      </div>

      {/* Right section - Product Information */}
      <div className="product-info-section">
        <ProductInfo />
      </div>

      <style jsx>{`
        /* Main hero section with responsive 2-column layout */
        .main-hero-section {
          display: flex;
          width: 100%;
          min-height: 500px;
          position: relative;
          overflow: hidden;
        }

        /* Particle background canvas - fixed position behind content */
        .particle-background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        /* Left section - 3D Model Viewer (50% width) */
        .model-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 10px 10px;
        }

        .model-container {
          width: 100%;
          height: 85vh;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
        }

        /* 3D model canvas with interactive cursor styles */
        .model-canvas {
          width: 100%;
          height: 100%;
          cursor: grab;
          border-radius: 20px;
        }

        .model-canvas:active {
          cursor: grabbing;
        }

        /* Interaction hint for user guidance */
        .interaction-hint {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          animation: fadeInOut 3s ease-in-out infinite;
          z-index: 10;
        }

        .hint-text {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .hand-icon {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Right section - Product Information (50% width) */
        .product-info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 10px 10px;
          position: relative;
        }

        .product-info-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          backdrop-filter: blur(5px);
        }

        .product-info-section > * {
          position: relative;
          z-index: 2;
        }

        /* Product content styling */
        .product-content {
          margin-bottom: 50px;
        }

        .product-content h1 {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 30px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .product-description {
          margin-bottom: 40px;
        }

        .product-description p {
          font-size: 1.3rem;
          margin-bottom: 15px;
          line-height: 1.6;
        }

        /* Call-to-action button styling */
        .cta-button {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 35px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 1.1rem;
          width: fit-content;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .cta-button img {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
        }

        /* Statistics section styling */
        .product-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 50px;
        }

        .stat-item {
          flex: 1;
          text-align: center;
          padding: 25px 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
        }

        .stat-item h3 {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 8px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .stat-item p {
          font-size: 1rem;
          font-weight: 500;
        }

        /* Features section styling */
        .product-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 25px;
          padding: 25px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateX(10px);
        }

        .feature-icon {
          font-size: 2rem;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
        }

        .feature-text {
          flex: 1;
        }

        .feature-item h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .feature-item p {
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Responsive Design for different screen sizes */
        @media (max-width: 1200px) {
          .product-content h1 {
            font-size: 3.5rem;
          }
          
          .model-container {
            height: 75vh;
          }
          
          .product-info-section {
            padding: 20px 10px;
          }
        }

        /* Tablet responsive design */
        @media (max-width: 992px) {
          .main-hero-section {
            flex-direction: column;
            min-height: auto;
          }
          
          .model-section,
          .product-info-section {
            flex: none;
            width: 100%;
          }
          
          .model-section {
            order: 1;
            padding: 20px 10px;
          }
          
          .product-info-section {
            order: 2;
            padding: 20px 10px;
          }
          
          .model-container {
            height: 60vh;
          }
          
          .product-content h1 {
            font-size: 3rem;
          }
          
          .product-stats {
            flex-direction: column;
            gap: 20px;
          }
          
          .stat-item {
            padding: 20px;
          }
        }

        /* Mobile responsive design */
        @media (max-width: 768px) {
          .model-section,
          .product-info-section {
            padding: 20px 10px;
          }
          
          .product-content h1 {
            font-size: 2.5rem;
          }
          
          .product-description p {
            font-size: 1.1rem;
          }
          
          .model-container {
            height: 50vh;
          }
          
          .stat-item h3 {
            font-size: 2.2rem;
          }
          
          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .feature-icon {
            width: 60px;
            height: 60px;
          }
        }

        /* Small mobile responsive design */
        @media (max-width: 480px) {
          .product-content h1 {
            font-size: 2rem;
          }
          
          .model-container {
            height: 45vh;
            margin: 0 10px;
          }
          
          .cta-button {
            padding: 15px 25px;
            font-size: 1rem;
          }
          
          .stat-item,
          .feature-item {
            padding: 20px 15px;
          }
          
          .interaction-hint {
            bottom: 20px;
            padding: 10px 20px;
          }
          
          .hint-text {
            font-size: 0.8rem;
          }
          
          .product-info-section {
            padding: 20px 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductModel;