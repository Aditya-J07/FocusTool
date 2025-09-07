import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidEtherProps {
  colors: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  resolution?: number;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  mouseForce = 20,
  cursorSize = 100,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Shader material for liquid effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(width, height) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        colors: { value: colors.map(color => new THREE.Color(color)) },
        mouseForce: { value: mouseForce / 100 },
        autoDemo: { value: autoDemo ? 1.0 : 0.0 },
        autoSpeed: { value: autoSpeed },
        autoIntensity: { value: autoIntensity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform vec3 colors[3];
        uniform float mouseForce;
        uniform float autoDemo;
        uniform float autoSpeed;
        uniform float autoIntensity;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = vUv;
          vec2 st = uv * 2.0 - 1.0;
          st.x *= resolution.x / resolution.y;

          float t = time * autoSpeed;
          
          // Auto demo movement
          vec2 autoMouse = vec2(
            sin(t * 0.7) * 0.3 + cos(t * 0.3) * 0.2,
            cos(t * 0.5) * 0.3 + sin(t * 0.4) * 0.2
          ) * autoIntensity * autoDemo;

          // Combine auto demo with actual mouse
          vec2 effectiveMouse = mix(mouse * 2.0 - 1.0, autoMouse, autoDemo);
          
          float dist = distance(st, effectiveMouse);
          float influence = exp(-dist * 3.0) * mouseForce;
          
          // Create flowing liquid effect
          vec2 flowUv = uv + vec2(
            sin(uv.y * 8.0 + t * 2.0) * 0.1,
            cos(uv.x * 6.0 + t * 1.5) * 0.1
          );
          
          flowUv += influence * normalize(effectiveMouse - st) * 0.2;
          
          float pattern = fbm(flowUv * 3.0 + t * 0.5);
          pattern += influence * 0.5;
          
          // Create multiple layers
          float layer1 = sin(pattern * 6.28 + t) * 0.5 + 0.5;
          float layer2 = sin(pattern * 4.0 + t * 1.3) * 0.5 + 0.5;
          float layer3 = sin(pattern * 2.5 + t * 0.8) * 0.5 + 0.5;
          
          // Mix colors based on layers
          vec3 color = mix(colors[0], colors[1], layer1);
          color = mix(color, colors[2], layer2 * 0.7);
          color += colors[1] * layer3 * 0.3;
          
          // Add some shimmer
          float shimmer = sin(pattern * 20.0 + t * 3.0) * 0.1 + 0.9;
          color *= shimmer;
          
          // Fade edges
          float alpha = smoothstep(0.0, 0.1, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
          
          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,
      transparent: true
    });

    materialRef.current = material;

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouseRef.current.x = (event.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (event.clientY - rect.top) / rect.height;
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      if (material.uniforms) {
        material.uniforms.time.value += 0.016;
        material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      renderer.setSize(newWidth, newHeight);
      if (material.uniforms) {
        material.uniforms.resolution.value.set(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [colors, mouseForce, autoDemo, autoSpeed, autoIntensity]);

  return <div ref={mountRef} className="w-full h-full" />;
}