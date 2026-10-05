import React, { useRef, useEffect } from 'react';

export default function PixelSculpt({ src, pixelSize = 8, hoverRadius = 80, speed = 14 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;
    
    const image = new Image();
    image.src = src;
    
    let pixels = [];
    let mouse = { x: -1000, y: -1000 };
    let time = 0;
    
    image.onload = () => {
      // Set canvas size (cap it so we don't process millions of pixels)
      const MAX_WIDTH = 700;
      let width = image.width;
      let height = image.height;
      
      if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;
        width = MAX_WIDTH;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image to get data
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Sample pixels
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const i = (y * width + x) * 4;
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          if (a > 10) { // Only store non-transparent pixels
            pixels.push({
              ox: x, oy: y, // original
              x: x, y: y,   // current
              vx: 0, vy: 0, // velocity
              r, g, b, a
            });
          }
        }
      }
      
      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Very heavily damped oscillation
        const actualVel = Math.abs(window.__carouselVelocity || 0);
        // Base amplitude is 3, caps strictly at 15
        const amplitude = Math.min(15, 3 + actualVel * 0.015);
        
        // Slower bobbing
        const bobSpeed = 1 + Math.min(1.5, actualVel * 0.005);
        time += 0.04 * bobSpeed;
        
        const yOffset = Math.sin(time) * amplitude;
        
        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          
          // Distance to mouse
          const dx = mouse.x - p.ox;
          const dy = mouse.y - (p.oy + yOffset);
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          let targetSize = pixelSize;
          let targetAlphaMulti = 1;
          
          // Gentle ripple effect on hover
          if (dist < hoverRadius) {
            const force = (hoverRadius - dist) / hoverRadius;
            targetSize = pixelSize + force * 2; 
            targetAlphaMulti = 1 + force * 0.8; // Brighten
          }
          
          // Smooth spring physics for size and alpha
          if (p.size === undefined) {
            p.size = pixelSize;
            p.alpha = 1;
            p.vSize = 0;
            p.vAlpha = 0;
          }
          
          p.vSize += (targetSize - p.size) * 0.25;
          p.vSize *= 0.65; // stronger friction
          p.size += p.vSize;
          
          p.vAlpha += (targetAlphaMulti - p.alpha) * 0.25;
          p.vAlpha *= 0.65; // stronger friction
          p.alpha += p.vAlpha;
          
          p.x = p.ox;
          p.y = p.oy + yOffset;
          
          const finalAlpha = Math.min(1, (p.a / 255) * p.alpha);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${finalAlpha})`;
          
          // Draw rect strictly larger (+1.5px) to guarantee overlap and prevent anti-aliasing gaps
          const offset = (pixelSize - p.size) / 2;
          ctx.fillRect(p.x + offset - 0.75, p.y + offset - 0.75, p.size + 1.5, p.size + 1.5);
        }
        
        animationFrameId = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [src, pixelSize, hoverRadius, speed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-contain pointer-events-auto cursor-crosshair" 
      style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
    />
  );
}
