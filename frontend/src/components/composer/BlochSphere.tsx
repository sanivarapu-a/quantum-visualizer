"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface BlochSphereProps {
  x: number;
  y: number;
  z: number;
  label?: string;
}

export default function BlochSphere({ x, y, z, label }: BlochSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.2, 1.6, 2.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Wireframe sphere — the Bloch sphere surface itself
    const sphereGeo = new THREE.SphereGeometry(1, 24, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    scene.add(new THREE.Mesh(sphereGeo, sphereMat));

    // X / Y / Z axes for orientation
    const axisMat = (color: number) => new THREE.LineBasicMaterial({ color });
    function addAxis(dir: THREE.Vector3, color: number) {
      const points = [dir.clone().multiplyScalar(-1.3), dir.clone().multiplyScalar(1.3)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geo, axisMat(color)));
    }
    addAxis(new THREE.Vector3(1, 0, 0), 0xef4444); // X - red
    addAxis(new THREE.Vector3(0, 1, 0), 0x22c55e); // Y - green
    addAxis(new THREE.Vector3(0, 0, 1), 0x3b82f6); // Z - blue

    // The state vector itself — arrow from origin to (x, y, z)
    const dir = new THREE.Vector3(x, y, z);
    const len = dir.length();
    if (len > 1e-6) {
      const arrow = new THREE.ArrowHelper(
        dir.clone().normalize(),
        new THREE.Vector3(0, 0, 0),
        len,
        0x7c3aed,
        0.18,
        0.1,
      );
      scene.add(arrow);
    } else {
      // Center point (maximally mixed / entangled) — draw a small dot instead of an arrow
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x7c3aed }),
      );
      scene.add(dot);
    }

    let frameId: number;
    function animate() {
      scene.rotation.y += 0.004; // slow auto-rotate so users can see depth
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [x, y, z]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div ref={containerRef} className="h-full w-full" />
      {label && <span className="text-xs text-gray-500 dark:text-zinc-400">{label}</span>}
    </div>
  );
}