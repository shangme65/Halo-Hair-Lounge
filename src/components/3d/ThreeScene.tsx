"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d946ef"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time / 2;
      meshRef.current.rotation.y = time / 3;
      meshRef.current.position.y = Math.sin(time) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#c026d3"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function WaveGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 2 + time) * Math.cos(y * 2 + time) * 0.3;
        positions.setZ(i, wave);
      }

      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 3;
      meshRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -3]}>
      <planeGeometry ref={geometryRef} args={[10, 10, 50, 50]} />
      <meshStandardMaterial
        color="#a21caf"
        wireframe
        side={THREE.DoubleSide}
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          color="#d946ef"
          intensity={0.5}
        />

        <ParticleField />
        <AnimatedSphere />
        <WaveGeometry />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
