import { Button } from "@/components/ui/button";
import {
  easeInOut,
  easeOut,
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import Headlines from "../hero/headlines";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
};

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const x = useMotionValue(0);
  const yMotion = useMotionValue(0);
  const rotateX = useSpring(useTransform(yMotion, [0, 1], [-5, 5]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-5, 5]), {
    stiffness: 100,
    damping: 30,
  });

  const transform = useTransform(
    [rotateX, rotateY],
    (latest: number[]) => `rotateX(${latest[0]}deg) rotateY(${latest[1]}deg)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    x.set((e.clientX - rect.left) / width);
    yMotion.set(1 - (e.clientY - rect.top) / height);
  };

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.section
      className="relative flex flex-col w-full min-h-[90vh] overflow-hidden bg-gradient-to-br from-background to-muted/50 text-foreground"
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{
        transform: shouldReduceMotion ? undefined : transform,
        perspective: shouldReduceMotion ? undefined : 1000,
      }}
    >
      {/* Parallax Background Image Overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-10 md:opacity-20"
        style={{
          backgroundImage: "url('/assets/hero-image.png')",
          y,
        }}
      />

      {/* Dynamic Blob */}
      {!shouldReduceMotion && (
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <motion.path
            d="M 0 200 Q 50 100 100 200 T 200 200 T 300 100 Q 350 200 400 200 L 400 400 Q 350 300 300 400 T 200 400 T 100 300 Q 50 400 0 400 Z"
            fill="currentColor"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: easeInOut,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.svg>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-[90vh] px-4 md:px-8 lg:px-16 py-8">
        {/* Content */}
        <motion.div
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="space-y-4" variants={staggerVariants}>
            <motion.div variants={childVariants}>
              <Headlines />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl"
            variants={itemVariants}
          >
            A safe and transparent peer-to-peer marketplace where you can buy,
            sell, or trade confidently with real people near you.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl w-full sm:w-auto border-border hover:bg-muted/50 transition-colors"
              asChild
            >
              <motion.button
                whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
              >
                Learn More
              </motion.button>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
