import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Check } from "lucide-react";

const newsletterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const successVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

function NewsletterSignup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - replace with API call (e.g., fetch('/api/newsletter'))
    console.log("Newsletter signup:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000); // Reset after 3s
  };

  return (
    <motion.section
      ref={ref}
      className="bg-muted/20 py-12 md:py-16"
      variants={newsletterVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label="Newsletter signup"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          className="text-center space-y-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Get the latest on new listings, local deals, and marketplace tips
              delivered to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={submitted}
              asChild
            >
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Signed Up!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </motion.button>
            </Button>
          </form>

          {submitted && (
            <motion.p
              className="text-sm text-green-600 flex items-center justify-center gap-1"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <Check className="w-4 h-4" />
              Thanks for subscribing! Check your inbox.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default NewsletterSignup;
