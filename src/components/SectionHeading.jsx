import { motion } from 'framer-motion';

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col ${alignClasses[align]} ${className}`}
    >
      {label && (
        <span className="font-body text-label uppercase tracking-[0.2em] text-luxury-gold mb-4">
          {label}
        </span>
      )}
      <div className="flex items-center gap-6 mb-4">
        <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
        <h2 className="font-display text-section font-semibold text-luxury-white">
          {title}
        </h2>
        <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
      </div>
      {subtitle && (
        <p className="font-body text-sm text-white/40 max-w-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
