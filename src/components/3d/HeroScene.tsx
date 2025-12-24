"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface HeroSceneProps {
  colorScheme?: "purple" | "gold" | "teal" | "green";
}

const colorSchemes = {
  purple: { main: "#d946ef", accent: "#a21caf" },
  gold: { main: "#fbbf24", accent: "#f59e0b" },
  teal: { main: "#14b8a6", accent: "#0d9488" },

  green: { main: "#22c55e", accent: "#16a34a" },
};

function AnimatedBlob({
  colorScheme = "purple",
  isMobile,
}: HeroSceneProps & { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const colors = colorSchemes[colorScheme];
  const scale = isMobile ? 2.2 : 3.0;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={scale}>
      <MeshDistortMaterial
        color={colors.main}
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function FloatingRings({
  colorScheme = "purple",
  isMobile,
}: HeroSceneProps & { isMobile: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const colors = colorSchemes[colorScheme];
  const ringSize = isMobile ? 1.9 : 2.5;
  const ringThickness = isMobile ? 0.05 : 0.06;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.5;
      group.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringSize, ringThickness, 16, 100]} />
        <meshStandardMaterial
          color={colors.accent}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]} scale={1.2}>
        <torusGeometry args={[ringSize, ringThickness * 0.6, 16, 100]} />
        <meshStandardMaterial
          color={colors.main}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene({ colorScheme = "purple" }: HeroSceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 6], fov: isMobile ? 50 : 45 }}
        className="!absolute !inset-0"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />

        <AnimatedBlob colorScheme={colorScheme} isMobile={isMobile} />
        <FloatingRings colorScheme={colorScheme} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
