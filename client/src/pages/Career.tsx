import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MapPin,
  Users,
  Award,
  Zap,
  Heart,
  ArrowRight,
  Download,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { easeOut } from "framer-motion";

// Mock job openings
const jobOpenings = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$120k - $160k",
    description:
      "Lead development of our marketplace platform, focusing on scalable React and Node.js solutions.",
    requirements: ["5+ years experience", "React, Node.js", "AWS or similar"],
    applyLink: "#",
  },
  {
    id: 2,
    title: "Community Manager",
    department: "Marketing",
    location: "New York, NY (Remote)",
    type: "Full-time",
    salary: "$80k - $110k",
    description:
      "Build and engage our local community through events, social media, and partnerships.",
    requirements: [
      "3+ years in community building",
      "Social media savvy",
      "Event planning",
    ],
    applyLink: "#",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY (On-site)",
    type: "Full-time",
    salary: "$100k - $140k",
    description:
      "Design intuitive user experiences for our peer-to-peer trading app.",
    requirements: [
      "Figma, Adobe XD",
      "UX/UI principles",
      "Portfolio of mobile/web designs",
    ],
    applyLink: "#",
  },
  {
    id: 4,
    title: "Growth Marketer",
    department: "Marketing",
    location: "New York, NY (Hybrid)",
    type: "Part-time",
    salary: "$50k - $70k (pro-rated)",
    description:
      "Drive user acquisition and retention through targeted campaigns and analytics.",
    requirements: [
      "SEO/SEM experience",
      "Analytics tools",
      "Creative campaigns",
    ],
    applyLink: "#",
  },
];

// Why join us benefits
const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description:
      "Work with passionate innovators in a diverse, inclusive environment.",
  },
  {
    icon: Award,
    title: "Competitive Compensation",
    description:
      "Market-leading salaries, equity options, and performance bonuses.",
  },
  {
    icon: Zap,
    title: "Fast-Paced Growth",
    description:
      "Join a startup that's scaling rapidly with real impact on local communities.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "Flexible hours, remote options, and wellness programs to support you.",
  },
];

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

function CareerPage() {
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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Be part of a movement revolutionizing local commerce. We're hiring
              talented individuals to build the future of peer-to-peer trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="#jobs"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  View Open Positions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="jobs" className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Open Positions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore exciting opportunities to grow with us. We're looking for
              builders, thinkers, and doers.
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {jobOpenings.map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : hoverScale}
              >
                <Card className="h-full border-border hover:border-primary/50 transition-colors overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge>{job.type}</Badge>
                    </div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-1">
                          • {req}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {job.salary}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        asChild
                      >
                        <motion.a
                          href={job.applyLink}
                          whileHover={shouldReduceMotion ? {} : { x: 2 }}
                        >
                          Apply Now
                          <Download className="w-4 h-4 ml-1" />
                        </motion.a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join Gebeya Go?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're more than a company—we're a community driving positive
              change in local economies.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  className="text-center"
                >
                  <Card className="h-full flex flex-col items-center p-6 border-border hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg mb-2">
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
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
              Ready to Make an Impact?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Can't find the perfect role? We'd love to hear from you anyway.
              Send us your resume.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="mailto:careers@gebayago.com?subject=Job%20Inquiry"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Email Us
                  <Mail className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/contact">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
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
                <span>careers@gebayago.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default CareerPage;
