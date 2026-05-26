import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import Lenis from 'lenis';

function GlassShape({ scrollProgress }) {
  const meshRef = useRef();
  const lastScrollVal = useRef(0);

  // Scale multiplier in/out based on scroll progress
  const scaleMultiplier = useTransform(
    scrollProgress,
    [0.05, 0.20, 0.70, 0.85],
    [0, 1, 1, 0]
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Calculate scroll speed for dynamic rotation tilt
      const scrollVal = scrollProgress.get();
      const scrollSpeed = Math.min(Math.abs(scrollVal - lastScrollVal.current) / (delta || 0.016), 5);
      lastScrollVal.current = scrollVal;

      // Constant slow rotation + scroll speed reactive rotation
      meshRef.current.rotation.y += delta * 0.15 + scrollSpeed * 0.05;
      meshRef.current.rotation.x += delta * 0.08 + scrollSpeed * 0.03;

      // Responsive scale calculation based on 3D viewport width
      const { width } = state.viewport;
      const baseScale = width < 6 ? 1.2 : 2.2;
      const targetScale = scaleMultiplier.get() * baseScale;

      // Smooth lerped scaling transition
      const currentScale = meshRef.current.scale.x;
      const nextScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          resolution={256}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.15}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 1200]}
          color="#ffffff"
          roughness={0.05}
          transmission={1}
        />
      </mesh>
    </Float>
  );
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth scroll progress using spring physics for ultra-buttery transitions on all browsers
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 80,
    mass: 0.5,
    restDelta: 0.0001
  });

  // SVG Line drawing mapped directly to smooth scroll progress
  const pathLength = useTransform(smoothProgress, [0.1, 0.9], [0, 1]);

  // Section 1: Customer Success & Technical Support (Center @ 0.25)
  const opacity1 = useTransform(smoothProgress, [0.05, 0.18, 0.32, 0.45], [0, 1, 1, 0]);
  const scale1 = useTransform(smoothProgress, [0.05, 0.25, 0.45], [0.9, 1.0, 0.9]);
  const y1 = useTransform(smoothProgress, [0.05, 0.25, 0.45], [60, 0, -60]);

  // Section 2: "Explore My Work" (Center @ 0.55)
  const opacity2 = useTransform(smoothProgress, [0.40, 0.50, 0.60, 0.70], [0, 1, 1, 0]);
  const scale2 = useTransform(smoothProgress, [0.40, 0.55, 0.70], [0.9, 1.0, 0.9]);
  const y2 = useTransform(smoothProgress, [0.40, 0.55, 0.70], [60, 0, -60]);

  // Section 3: Call to Action (Center @ 0.85)
  const opacity3 = useTransform(smoothProgress, [0.72, 0.82, 0.98], [0, 1, 1]);
  const scale3 = useTransform(smoothProgress, [0.72, 0.85, 0.98], [0.9, 1.0, 1.0]);
  const y3 = useTransform(smoothProgress, [0.72, 0.85, 0.98], [60, 0, 0]);

  return (
    <>
      {/* Additional Custom Section */}
      <section
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-color)',
          position: 'relative',
          zIndex: 20
        }}
      >
        <div className="text-content" style={{ textAlign: 'center' }}>
          <h1 className="serif-title">Daniel Patino.</h1>
          <p className="subtitle">
            A multi-disciplinary tech professional with experience in support and client success.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator"
          onClick={() =>
            sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          ↓
        </div>
      </section>

      <div ref={containerRef} className="scrollytelling-container">
        {/* Sticky Background Container */}
        <div className="sticky-background">
          <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
              <color attach="background" args={['#000000']} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <GlassShape scrollProgress={smoothProgress} />
              <Environment preset="city" />
              <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
          </div>

          {/* SVG Guide Line */}
          <div className="svg-container">
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="guide-line">
              <motion.path
                d="M 50 0 L 50 1000"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
                style={{ pathLength }}
              />
            </svg>
          </div>
        </div>

        {/* Scrollable Content Layers */}
        <div className="content-layers">
          {/* Section 1 */}
          <section ref={sectionRef} className="scroll-section">
            <motion.div style={{ opacity: opacity1, scale: scale1, y: y1 }} className="text-content">
              <h1 className="serif-title">Customer Success & Technical Support</h1>
              <p className="subtitle">
                I have experience in customer service, tech support, and client success roles, helping users resolve issues and significantly improve their experience.
              </p>
            </motion.div>
          </section>

          {/* Section 2 */}
          <section className="scroll-section">
            <motion.div style={{ opacity: opacity2, scale: scale2, y: y2 }} className="text-content">
              <h3 className="serif-title">Technology & Development</h3>
              <p className="subtitle">I have experience working across different tools, systems, CRMs, and digital solutions to build, troubleshoot, and improve user experiences. My background includes web development, problem-solving, and adapting quickly to new technologies and workflows.</p>
            </motion.div>
          </section>

          {/* Section 3 */}
          <section className="scroll-section bottom-align">
            <motion.div style={{ opacity: opacity3, scale: scale3, y: y3 }} className="text-content cta-section">
              <h1 className="serif-title">Explore My Work.</h1>
              <button
                className="cta-button"
                onClick={() => window.location.href = 'https://danielpatinoportfolio.onrender.com'}
              >
                Visit My Portfolio
              </button>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
}
