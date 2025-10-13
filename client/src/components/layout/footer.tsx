import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
// Using standard <a> for Vite/React

const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <footer
      ref={ref}
      className="relative w-full bg-muted/50 border-t border-border text-foreground py-12 md:py-16"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8"
          variants={footerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Company Info */}
          <motion.div className="space-y-4" variants={linkVariants}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  G
                </span>
              </div>
              <h3 className="text-xl font-bold">Gebeya Go</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted peer-to-peer hub for buying, selling, and trading
              locally.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@gebayago.com</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={linkVariants}>
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/listings", label: "Browse Listings" },
                { href: "/sell", label: "Sell an Item" },
                { href: "/trade", label: "Trade" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={linkVariants}>
            <h4 className="text-base font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            className="md:col-span-2 lg:col-span-1"
            variants={linkVariants}
          >
            <h4 className="text-base font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/help", label: "Help Center" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Social & Divider */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div
            className="flex items-center gap-4"
            variants={iconVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {[
              { href: "https://facebook.com", Icon: Facebook },
              { href: "https://twitter.com", Icon: Twitter },
              { href: "https://instagram.com", Icon: Instagram },
              { href: "https://linkedin.com", Icon: Linkedin },
            ].map(({ href, Icon }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Gebeya Go. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
