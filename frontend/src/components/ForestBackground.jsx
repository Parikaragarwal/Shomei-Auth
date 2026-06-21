import { motion } from 'framer-motion';
import { Bird, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ForestBackground() {
  const [leaves, setLeaves] = useState([]);
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    // Generate random leaves
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 10,
      scale: 0.4 + Math.random() * 0.6,
      rotation: Math.random() * 360,
    }));
    setLeaves(newLeaves);

    // Generate random birds
    const newBirds = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      y: 10 + Math.random() * 30,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 15,
      scale: 0.5 + Math.random() * 0.5,
    }));
    setBirds(newBirds);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        backgroundImage: "url('/canopy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Falling Leaves Overlay */}
      {leaves.map((leaf) => (
        <motion.div
          key={`leaf-${leaf.id}`}
          initial={{ y: leaf.y + 'vh', x: leaf.x + 'vw', rotate: leaf.rotation, opacity: 0 }}
          animate={{
            y: '120vh',
            x: (leaf.x - 10 + Math.random() * 20) + 'vw',
            rotate: leaf.rotation + 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ position: 'absolute', color: '#2F4F2F' }}
        >
          <Leaf size={24 * leaf.scale} />
        </motion.div>
      ))}

      {/* Flying Birds Overlay */}
      {birds.map((bird) => (
        <motion.div
          key={`bird-${bird.id}`}
          initial={{ x: '-10vw', y: bird.y + 'vh', opacity: 0 }}
          animate={{
            x: '110vw',
            y: (bird.y - 5 + Math.random() * 10) + 'vh',
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{
            duration: bird.duration,
            delay: bird.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ position: 'absolute', color: '#1B261B' }}
        >
          <Bird size={32 * bird.scale} />
        </motion.div>
      ))}

      {/* Dark overlay to ensure text remains readable */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(3, 13, 8, 0.65)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
