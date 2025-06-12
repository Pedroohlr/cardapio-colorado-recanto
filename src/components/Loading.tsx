import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#ae3537] h-screen"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <img
        src="imgs/logo-colorado.png"
        alt="Logo Colorado"
        className="w-40 h-auto rounded-[12px]"
        loading="eager"
      />
    </motion.div>
  );
};
