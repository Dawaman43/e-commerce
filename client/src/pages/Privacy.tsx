import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  User,
  Lock,
  Share2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { easeOut } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const hoverScale = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

function PrivacyPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              At Gebeya Go, your privacy is our priority. We are committed to
              protecting your personal information and ensuring transparency in
              how we handle your data.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: October 13, 2025
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="#policy"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Read Policy
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section id="policy" className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            ref={ref}
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">1. Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    Gebeya Go ("we," "our," or "us") respects your privacy and
                    is committed to protecting your personal data. This Privacy
                    Policy explains how we collect, use, disclose, and safeguard
                    your information when you visit our website or use our
                    services.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    By using our platform, you consent to the practices
                    described in this policy. If you do not agree, please do not
                    use our services.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <User className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    2. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    We collect information to provide better services to all
                    users. This includes:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>
                      • Personal Information: Name, email, phone number, and
                      location (when you create an account or list items).
                    </li>
                    <li>
                      • Usage Data: Device information, browsing actions, and
                      patterns.
                    </li>
                    <li>
                      • Transaction Data: Details of purchases, sales, or
                      trades.
                    </li>
                    <li>
                      • Cookies: To enhance user experience and analyze traffic.
                    </li>
                  </ul>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    We only collect what is necessary and with your consent
                    where required.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    3. How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    We use your information to:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>
                      • Provide and maintain our services (e.g., matching buyers
                      and sellers).
                    </li>
                    <li>• Improve our platform and user experience.</li>
                    <li>
                      • Communicate with you about updates, promotions, or
                      support.
                    </li>
                    <li>• Comply with legal obligations and prevent fraud.</li>
                  </ul>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    We do not sell your personal data to third parties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    4. Sharing Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    We may share your information with:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>
                      • Service providers (e.g., payment processors, analytics
                      tools) under strict confidentiality.
                    </li>
                    <li>
                      • Business partners for joint promotions (with your
                      consent).
                    </li>
                    <li>• Legal authorities if required by law.</li>
                  </ul>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    We ensure all third parties protect your data and use it
                    only for specified purposes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">5. Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    We implement robust security measures, including encryption,
                    firewalls, and access controls, to protect your information.
                    However, no system is completely secure, and we cannot
                    guarantee absolute security.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    In the event of a data breach, we will notify affected users
                    as required by law.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    6. Your Rights and Choices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    You have the right to:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>
                      • Access, update, or delete your personal information.
                    </li>
                    <li>• Opt-out of marketing communications.</li>
                    <li>• Withdraw consent at any time.</li>
                    <li>
                      • File a complaint with data protection authorities.
                    </li>
                  </ul>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    To exercise these rights, contact us at
                    privacy@gebayago.com.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">
                    7. Changes to This Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    We may update this Privacy Policy from time to time. We will
                    notify you of material changes by posting the new policy on
                    our site and updating the "Last updated" date.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Continued use of our services after changes constitutes
                    acceptance of the revised policy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">8. Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    If you have questions about this Privacy Policy, please
                    contact our Data Protection Officer:
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>privacy@gebayago.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>New York, NY</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're here to help. Reach out if you need clarification on any
              aspect of our privacy practices.
            </p>
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <motion.a
                href="mailto:privacy@gebayago.com?subject=Privacy%20Question"
                whileHover={shouldReduceMotion ? {} : hoverScale}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Contact Privacy Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPage;
