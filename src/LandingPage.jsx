import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import Lenis from 'lenis';

function GlassShape({ scrollProgress }) {
  const meshRef = useRef();

  // The shape rotates constantly on its axis
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  // Scale in/out between 0.3 and 0.7
  const scale = useTransform(
    scrollProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 2.8, 2.8, 0]
  );

  useFrame(() => {
    if (meshRef.current) {
      const currentScale = scale.get();
      meshRef.current.scale.set(currentScale, currentScale, currentScale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          thickness={0.5}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[0, 1400]}
          color="#ffffff"
          roughness={0}
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
    const lenis = new Lenis();
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

  // SVG Line drawing mapped directly to scroll
  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  // Section 1: "Get to Know Me" (Center @ 0.34)
  // FIX: Array mismatch fixed. Both arrays now have 4 elements.
  const opacity1 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const scale1 = useTransform(scrollYProgress, [0.15, 0.34, 0.5], [0.8, 1.2, 0.8]);
  const y1 = useTransform(scrollYProgress, [0.15, 0.34, 0.5], [50, 0, -50]);

  // Section 2: "Explore My Work" (Center @ 0.68)
  const opacity2 = useTransform(scrollYProgress, [0.5, 0.68, 0.85], [0, 1, 0]);
  const scale2 = useTransform(scrollYProgress, [0.5, 0.68, 0.85], [0.8, 1.2, 0.8]);
  const y2 = useTransform(scrollYProgress, [0.5, 0.68, 0.85], [50, 0, -50]);

  // Section 3: Call to Action (Center @ 1.0)
  const opacity3 = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const y3 = useTransform(scrollYProgress, [0.85, 1], [50, 0]);

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
            A multi-disciplinary designer and developer.
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
              <GlassShape scrollProgress={scrollYProgress} />
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
              <h1 className="serif-title">Get to Know Me</h1>
              <p className="subtitle">
                I’m a product designer with a passion for building meaningful digital experiences.
              </p>
            </motion.div>
          </section>

          {/* Section 2 */}
          <section className="scroll-section">
            <motion.div style={{ opacity: opacity2, scale: scale2, y: y2 }} className="text-content">
              <h3 className="serif-title">Explore My Work</h3>
              <p className="subtitle">A curated selection of my work, showcasing my skills and creativity.</p>
            </motion.div>
          </section>

          {/* Section 3 */}
          <section className="scroll-section bottom-align">
            <motion.div style={{ opacity: opacity3, y: y3 }} className="text-content cta-section">
              <h1 className="serif-title">The Future is Here.</h1>
              <button
                className="cta-button"
                onClick={() => window.location.href = 'https://danielpatinoportfolio.onrender.com'}
              >
                Visit my Portfolio
              </button>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
}
