"use client";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

export const CanvasRevealEffect = ({
   animationSpeed = 0.4,
   opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
   colors = [[0, 255, 255]],
   containerClassName,
   dotSize,
   showGradient = true,
}: {
   animationSpeed?: number;
   opacities?: number[];
   colors?: number[][];
   containerClassName?: string;
   dotSize?: number;
   showGradient?: boolean;
}) => {
   return (
      <div className={cn("h-full relative w-full", containerClassName)}>
         <div className="h-full w-full">
            <Canvas>
               <DotMatrix
                  colors={colors}
                  dotSize={dotSize}
                  opacities={opacities}
                  animationSpeed={animationSpeed}
                  center={["x", "y"]}
               />
            </Canvas>
         </div>
         {showGradient && (
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
         )}
      </div>
   );
};

interface DotMatrixProps {
   colors?: number[][];
   opacities?: number[];
   totalSize?: number;
   dotSize?: number;
   shader?: string;
   center?: ("x" | "y")[];
   animationSpeed?: number;
}

const DotMatrix: React.FC<DotMatrixProps> = ({
   colors = [[0, 0, 0]],
   opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
   totalSize = 4,
   dotSize = 2,
   animationSpeed = 1,
}) => {
   const uniforms = useMemo(() => {
      let colorsArray = [
         colors[0][0] / 255,
         colors[0][1] / 255,
         colors[0][2] / 255,
      ];
      if (colors.length >= 2) {
         colorsArray.push(colors[1][0] / 255, colors[1][1] / 255, colors[1][2] / 255);
      } else {
         colorsArray.push(colors[0][0] / 255, colors[0][1] / 255, colors[0][2] / 255);
      }
      if (colors.length >= 3) {
         colorsArray.push(colors[2][0] / 255, colors[2][1] / 255, colors[2][2] / 255);
      } else {
         colorsArray.push(colors[0][0] / 255, colors[0][1] / 255, colors[0][2] / 255);
      }

      return {
         u_colors: {
            value: colorsArray,
         },
         u_opacities: {
            value: opacities,
         },
         u_total_size: {
            value: totalSize,
         },
         u_dot_size: {
            value: dotSize,
         },
         u_time: {
            value: 0,
         },
         u_canvassize: {
            value: new THREE.Vector2(0, 0),
         },
      };
   }, [colors, opacities, totalSize, dotSize]);

   return (
      <ShaderMaterialComponent
         materialProps={{
            uniforms,
            vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
            fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_opacities[10];
      uniform float u_colors[9];
      uniform float u_total_size;
      uniform float u_dot_size;
      uniform vec2 u_canvassize;
      void main() {
        vec2 st = vUv * u_canvassize;
        vec2 grid = fract(st / u_total_size);
        float size = u_dot_size / u_total_size;
        float mask = step(size, grid.x) * step(size, grid.y);
        float noise = fract(sin(dot(floor(st / u_total_size), vec2(12.9898,78.233))) * 43758.5453);
        float time_noise = fract(sin(dot(floor(st / u_total_size) + floor(u_time), vec2(12.9898,78.233))) * 43758.5453);
        float opacity = u_opacities[int(noise * 10.0)];
        vec3 color = vec3(u_colors[0], u_colors[1], u_colors[2]);
        if (time_noise > 0.5) {
          color = vec3(u_colors[3], u_colors[4], u_colors[5]);
        }
        gl_FragColor = vec4(color, (1.0 - mask) * opacity);
      }
    `,
         }}
         animationSpeed={animationSpeed}
      />
   );
};

const ShaderMaterialComponent = ({
   materialProps,
   animationSpeed,
}: {
   materialProps: any;
   animationSpeed: number;
}) => {
   const meshRef = useRef<THREE.Mesh>(null!);
   const { size } = useThree();

   useFrame((state) => {
      if (!meshRef.current) return;
      materialProps.uniforms.u_time.value = state.clock.getElapsedTime() * animationSpeed;
      materialProps.uniforms.u_canvassize.value.set(size.width, size.height);
   });

   return (
      <mesh ref={meshRef}>
         <planeGeometry args={[2, 2]} />
         <shaderMaterial
            {...materialProps}
            transparent={true}
            depthTest={false}
            depthWrite={false}
         />
      </mesh>
   );
};
