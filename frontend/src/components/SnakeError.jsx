import { motion, AnimatePresence } from 'framer-motion';

export default function SnakeError({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="snake-container"
        >
          <motion.div
            animate={{ x: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.2, repeat: 3 }}
            className="snake-icon"
          >
            🐍
          </motion.div>
          <div>
            <strong>Ssssorry!</strong> <br />
            {error}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
