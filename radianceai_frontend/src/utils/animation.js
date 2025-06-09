import { motion } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * MotionWrapper: Wraps children with a simple fade & slide-in effect on mount.
 * Use for page/content entry transitions.
 */
export function MotionWrapper({ children, style = {}, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{
        duration: 0.5,
        ease: [0.36, 1.05, 0.52, 0.98],
      }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * PUBLIC_INTERFACE
 * AppleFadeTransition:
 * For route/page transitions with fade and scale, like iOS modals and cards.
 */
export function AppleFadeTransition({ children, style = {}, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.42,
        ease: [0.38, 0.91, 0.44, 1],
      }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
