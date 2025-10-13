import {
  motion,
  useInView,
  useScroll,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Users,
  Award,
  Target,
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Calendar,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { easeOut } from "framer-motion";

// Mock data
const storyTimeline = [
  { year: 2020, event: "Founded in NYC with a vision for local commerce." },
  { year: 2021, event: "Launched beta with 500+ users in Brooklyn." },
  { year: 2022, event: "Expanded to all NYC boroughs, hit 10k listings." },
  {
    year: 2023,
    event: "Introduced trade feature, partnered with local shops.",
  },
  { year: 2024, event: "Reached 50k users, won Local Innovation Award." },
];

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "Building connections in your neighborhood.",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Verified users and safe transactions.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description: "List, buy, trade in minutes.",
  },
  {
    icon: TrendingUp,
    title: "Sustainable",
    description: "Promoting reuse and reducing waste.",
  },
];

const teamMembers = [
  {
    name: "Aisha Johnson",
    role: "Founder & CEO",
    image: "/assets/team1.jpg",
    bio: "Passionate about local economies and tech for good.",
  },
  {
    name: "Marcus Lee",
    role: "CTO",
    image: "/assets/team2.jpg",
    bio: "Building scalable platforms with a focus on UX.",
  },
  {
    name: "Elena Vasquez",
    role: "Head of Community",
    image: "/assets/team3.jpg",
    bio: "Connecting people through events and support.",
  },
  {
    name: "Raj Patel",
    role: "Product Lead",
    image: "/assets/team4.jpg",
    bio: "Designing features that delight our users.",
  },
];

const stats = [
  { value: 50000, label: "Active Users", icon: Users },
  { value: 150000, label: "Items Listed", icon: Award },
  { value: 98, label: "Satisfaction", icon: Target, suffix: "%" },
];

// Counter Component
interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function Counter({ end, suffix = "", duration = 2 }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      animate(count, end, {
        duration,
        ease: easeOut,
      });
    }
  }, [isInView, count, end, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-4xl md:text-5xl font-bold text-primary mb-2"
    >
      {suffix ? (
        <>
          <motion.span>{rounded}</motion.span>
          {suffix}
        </>
      ) : (
        <motion.span>{rounded}</motion.span>
      )}
    </motion.div>
  );
}

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

function AboutUsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-muted/20 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              About Gebeya Go
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
              variants={itemVariants}
            >
              We're redefining local commerce by connecting neighbors for
              buying, selling, and trading goods with trust and ease.
            </motion.p>
            <motion.div className="mt-8" variants={itemVariants}>
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <motion.a
                  href="/listings"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Explore Our Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={ref} className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Born in the heart of New York City, Gebeya Go started as a simple
              idea: make local trading as easy as chatting with a neighbor.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                From garage sales to digital marketplaces, we've grown with the
                community. Today, thousands of New Yorkers use our platform
                daily to find treasures, make trades, and build lasting
                connections.
              </p>
              <div className="space-y-4">
                {storyTimeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center mt-1">
                      <Calendar className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-primary">
                        {item.year}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {item.event}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <img
                src="/assets/story.jpg" // Replace with actual image
                alt="Our journey in NYC"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At the core of everything we do are principles that guide our
              growth and community.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  className="text-center"
                >
                  <Card className="h-full flex flex-col items-center p-6 border-border hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A diverse group of innovators dedicated to empowering local
              communities.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : hoverScale}
              >
                <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <Counter end={stat.value} suffix={stat.suffix} />
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Community?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Get in touch or start browsing today. We're here to help you find
              what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="/contact"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <motion.a
                  href="/sell"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Sell Your First Item
                </motion.a>
              </Button>
            </div>
            {/* Contact Info */}
            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
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
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
