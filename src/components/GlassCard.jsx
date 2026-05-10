import { motion } from 'framer-motion';

const variants = {
  standard: 'glass',
  elevated: 'glass-elevated',
  gold: 'glass-gold',
  dark: 'glass-dark',
};

export default function GlassCard({
  children,
  variant = 'standard',
  className = '',
  hover = true,
  padding = 'p-6',
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.4, ease: 'easeOut' } } : {}}
      onClick={onClick}
      className={`${variants[variant]} ${padding} ${className} ${
        onClick ? 'cursor-pointer' : ''
      } transition-all duration-500`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
