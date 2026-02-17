"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

interface VortexProps {
   children?: any;
   className?: string;
   containerClassName?: string;
   particleCount?: number;
   rangeY?: number;
   baseHue?: number;
   baseSpeed?: number;
   rangeSpeed?: number;
   baseRadius?: number;
   rangeRadius?: number;
   backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const particleCount = props.particleCount || 700;
   const particlePropCount = 9;
   const particlePropsLength = particleCount * particlePropCount;
   const baseHue = props.baseHue || 220;
   const rangeHue = 100;
   const baseSpeed = props.baseSpeed || 0.0;
   const rangeSpeed = props.rangeSpeed || 1.5;
   const baseRadius = props.baseRadius || 1;
   const rangeRadius = props.rangeRadius || 2;
   const backgroundColor = props.backgroundColor || "#000000";
   const noise3D = createNoise3D();
   let particleProps = new Float32Array(particlePropsLength);
   let center: [number, number] = [0, 0];
   let tick = 0;

   const lerp = (n1: number, n2: number, speed: number) => {
      return (1 - speed) * n1 + speed * n2;
   };

   const fadeInOut = (t: number, m: number) => {
      let hm = 0.5 * m;
      return Math.abs(((t + hm) % m) - hm) / hm;
   };

   const initParticle = (i: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let x, y, vx, vy, life, ttl, speed, radius, hue;

      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      vx = 0;
      vy = 0;
      life = 0;
      ttl = 100 + Math.random() * 100;
      speed = baseSpeed + Math.random() * rangeSpeed;
      radius = baseRadius + Math.random() * rangeRadius;
      hue = baseHue + Math.random() * rangeHue;

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
   };

   const drawParticle = (
      i: number,
      x: number,
      y: number,
      vx: number,
      vy: number,
      life: number,
      ttl: number,
      speed: number,
      radius: number,
      hue: number,
      ctx: CanvasRenderingContext2D
   ) => {
      let n = noise3D(x * 0.00125, y * 0.00125, tick * 0.0005) * Math.PI * 2;
      vx = lerp(vx, Math.cos(n) * speed, 0.1);
      vy = lerp(vy, Math.sin(n) * speed, 0.1);
      x += vx;
      y += vy;
      life++;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - vx, y - vy);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);

      if (checkBounds(x, y, canvasRef.current!) || life > ttl) {
         initParticle(i);
      }
   };

   const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
      return x > canvas.width || x < 0 || y > canvas.height || y < 0;
   };

   const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { innerWidth, innerHeight } = window;

      canvas.width = innerWidth;
      canvas.height = innerHeight;

      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
   };

   const draw = (ctx: CanvasRenderingContext2D) => {
      tick++;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
         drawParticle(
            i,
            particleProps[i],
            particleProps[i + 1],
            particleProps[i + 2],
            particleProps[i + 3],
            particleProps[i + 4],
            particleProps[i + 5],
            particleProps[i + 6],
            particleProps[i + 7],
            particleProps[i + 8],
            ctx
         );
      }
   };

   const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      draw(ctx);
      window.requestAnimationFrame(render);
   };

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      resize();
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
         initParticle(i);
      }
      render();

      window.addEventListener("resize", resize);
      return () => {
         window.removeEventListener("resize", resize);
      };
   }, []);

   return (
      <div className={cn("relative h-full w-full", props.containerClassName)}>
         <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 h-full w-full"
         />
         <div className={cn("relative z-10", props.className)}>
            {props.children}
         </div>
      </div>
   );
};

