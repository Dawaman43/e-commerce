import { motion, useInView } from "framer-motion";
import { useRef, type FormEvent } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., API call)
    console.log("Form submitted");
  };

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
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="#contact-form"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Send a Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="tel:+15551234567">Call Us</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Reach out to us via phone, email, or visit our office in New York.
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full text-center p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    hello@gebayago.com
                  </CardDescription>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="mailto:hello@gebayago.com"
                      className="flex items-center gap-2"
                    >
                      Send Email
                      <Send className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full text-center p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    +1 (555) 123-4567
                  </CardDescription>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="tel:+15551234567"
                      className="flex items-center gap-2"
                    >
                      Call Now
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full text-center p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    New York, NY 10001
                  </CardDescription>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="https://maps.google.com/?q=New+York,+NY+10001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      View on Map
                      <MapPin className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fill out the form below, and we'll get back to you within 24
              hours.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What's this about?" required />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us more..."
                rows={5}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full md:w-auto rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                whileHover={shouldReduceMotion ? {} : hoverScale}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* Hours Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Business Hours
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're here to help during these hours. For urgent matters, email
              us anytime.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Monday - Friday</span>
                </div>
                <CardDescription>9:00 AM - 6:00 PM EST</CardDescription>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Saturday - Sunday</span>
                </div>
                <CardDescription>10:00 AM - 4:00 PM EST</CardDescription>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
