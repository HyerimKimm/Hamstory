"use client";

// import { Model } from "@/utils/hamster/Scene";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Model } from "./Pedal_board_ass_y";

export default function Three() {
  return (
    <Canvas
      style={{
        width: "700px",
        height: "700px",
        maxWidth: "100vw",
        maxHeight: "100vh",
        // backgroundColor: "rgba(255,255,255,0.1)",
        // borderRadius: "50%",
      }}
      camera={{
        aspect: 1,
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [5, 5, 5],
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />
        <Model scale={[3, 3, 3]} />
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          enablePan={true}
          minDistance={1}
          maxDistance={50}
        />
      </Suspense>
    </Canvas>
  );
}
