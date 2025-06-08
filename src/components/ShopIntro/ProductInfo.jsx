import { useState, useEffect, useRef } from 'react';

const ProductInfo = () => {
  // Canvas reference for particle animation background
  const canvasRef = useRef(null);
  
  // State management for loading animation sequence
  const [identityState, setIdentityState] = useState('loading');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // References for animation and mouse tracking
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
      this.maxRadius = 1.5;          // Maximum radius when hovering
    }

    // Draw circle on canvas
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

      // Move circle
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

  // Initialize particle system with 800 circles
  const initParticles = () => {
    const canvas = canvasRef.current;
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

  // Animation loop for particles
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all particles
    circlesRef.current.forEach(circle => {
      circle.update(ctx, canvas, mouseRef.current);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Track mouse position for particle interaction
  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  // Handle window resize - update canvas dimensions
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  // Animate the loading dots sequence
  const animateIdentity = () => {
    // First phase: working animation
    setIdentityState('working');
    
    setTimeout(() => {
      // Second phase: robot animation
      setIdentityState('robot');
      setTimeout(() => {
        // Final phase: rest state
        setIdentityState('rest');
        setIsLoaded(true);
      }, 2000);
    }, 2000);
  };

  // Initialize canvas and start animations when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas to full viewport size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize particle system and start animation
      initParticles();
      animate();
      
      // Add event listeners
      window.addEventListener('resize', handleResize);
      canvas.addEventListener('mousemove', handleMouseMove);
      
      // Start loading animation sequence after 500ms
      setTimeout(animateIdentity, 500);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Render animated loading dots with different states
  const renderIdentityDots = () => {
    const colors = ['rgb(0 55 193 / 1)', '#ffde59', '#d9594c'];
    const positions = [
      { top: '-12px', left: '-12px' },
      { top: '12px', left: '-12px' },
      { top: '-12px', left: '12px' },
      { top: '12px', left: '12px' }
    ];

    // Arrange dots in a line when in rest state
    if (identityState === 'rest') {
      positions.forEach((pos, i) => {
        pos.top = '0';
        pos.left = `${i * 30}px`;
      });
    }

    return colors.map((color, index) => (
      <div
        key={index}
        className="loading-dot"
        style={{
          backgroundColor: color,
          ...positions[index],
          animation: identityState === 'working' ? `identityWorking${index} 1.4s ease infinite` :
                    identityState === 'robot' ? `identityRobot 1.4s ease-in-out infinite ${index * 0.15}s` : 'none'
        }}
      />
    ));
  };

  return (
    <div className="main-wrapper">
      {/* Particle animation canvas background */}
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {/* Main content container */}
      <div className="content-container">
        <div className="content-template">
          <main className="main-content">
            {/* Main heading with animated spans */}
            <h1 className="main-heading">
              <span className="heading-span span-delay-1">
                Place <span className="highlighted-text">your order </span>
              </span>
              <span className="heading-span span-delay-2">
                Change begins now
              </span>
            </h1>
            
            {/* Product description */}
            <div className="description-text">
              <span style={{display: 'block'}}>Choose the right size to match your needs</span>
              <span style={{display: 'block'}}>From small to extra large </span>
            </div>
            
            {/* Feature links with different colors */}
            <div className="feature-links">
              <a className="feature-link link-yellow">
                Fast delivery 
              </a>
              <a className="feature-link link-blue">
                Durable materials.
              </a>
              <a className="feature-link link-red">
                Fits any budget
              </a>
            </div>
          </main>
        </div>
        
        {/* Loading animation dots */}
        <div className="loading-identity" style={{opacity: isLoaded ? 0.7 : 1}}>
          {renderIdentityDots()}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto+Slab:wght@700&display=swap');

        .main-wrapper {
          position: relative;
          overflow: hidden;
          min-height: 500px;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 28px;
          color: #ddd;
        }

        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .content-container {
          position: relative;
          width: 90%;
          max-width: 1000px;
          height: 100%;
          margin: 0 auto;
          z-index: 1;
        }

        .content-template {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          white-space: nowrap;
        }

        .main-content {
          position: absolute;
          top: 168px;
          left: 0;
          bottom: 77px;
          width: 100%;
          transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .main-heading {
          margin: 0;
          margin-bottom: 28px;
          font-family: 'Roboto Slab', serif;
          font-size: 46px;
          font-weight: 700;
          line-height: 63px;
          color: #fff;
        }

        .heading-span {
          display: block;
          opacity: 0;
          transform: translateY(70px) rotate(5deg);
          animation: fadeInUp 0.3s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .highlighted-text {
          display: inline-block;
          position: relative;
          margin: 0;
          padding: 0;
          background-color: transparent;
          color: #ffde59;
        }

        .description-text {
          margin: 0;
          margin-bottom: 21px;
        }

        .feature-links {
          display: flex;
          flex-direction: row;
          gap: 30px;
          align-items: center;
        }

        .feature-link {
          font-weight: 700;
          display: inline-block;
          position: relative;
          text-decoration: none;
          transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .loading-identity {
          position: absolute;
          top: 49px;
          left: 0;
          transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .loading-dot {
          height: 10px;
          width: 10px;
          margin-top: 5px;
          margin-left: -5px;
          border-radius: 50%;
          position: absolute;
          transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* Animations */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(70px) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }

        @keyframes identityWorking0 {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
        }

        @keyframes identityWorking1 {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
        }

        @keyframes identityWorking2 {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
        }

        @keyframes identityWorking3 {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
        }

        @keyframes identityRobot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Link colors and hover effects */
        .link-yellow { 
          color: #ffde59; 
        }

        .link-blue { 
          color: rgb(0 55 193 / 1); 
        }

        .link-red { 
          color: #d9594c; 
        }

        .link-yellow:hover, 
        .link-blue:hover, 
        .link-red:hover {
          opacity: 0.8;
        }

        /* Underline effects for links */
        .link-yellow::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 21px;
          height: 2px;
          background-color: #ffde59;
          transition: width 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .link-blue::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 21px;
          height: 2px;
          background-color: rgb(0 55 193 / 1);
          transition: width 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .link-red::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 21px;
          height: 2px;
          background-color: #d9594c;
          transition: width 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .link-yellow:hover::before,
        .link-blue:hover::before,
        .link-red:hover::before {
          width: 100%;
        }

        /* Animation delays for heading spans */
        .span-delay-1 { 
          animation-delay: 0.1s; 
        }

        .span-delay-2 { 
          animation-delay: 0.2s; 
        }

        /* Responsive Design for tablets and smaller screens */
        @media (max-width: 768px) {
          .feature-links {
            flex-direction: column;
            gap: 14px;
            align-items: flex-start;
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 599px) {
          .main-content {
            top: 119px !important;
            height: 100vh;
          }
          
          .main-heading {
            font-size: 29px !important;
            line-height: 38px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductInfo;