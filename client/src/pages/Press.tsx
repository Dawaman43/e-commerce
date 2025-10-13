import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Newspaper,
  Award,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
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

// Mock press releases
const pressReleases = [
  {
    id: 1,
    title: "Gebeya Go Wins NYC Innovation Award 2025",
    excerpt:
      "Recognized for revolutionizing local commerce with peer-to-peer trading features.",
    date: "2025-10-10",
    source: "NY Tech News",
    link: "https://example.com/press1",
    image: "/assets/press1.jpg",
  },
  {
    id: 2,
    title: "How Gebeya Go is Transforming Neighborhood Economies",
    excerpt:
      "Feature on sustainable shopping and community building in urban areas.",
    date: "2025-09-20",
    source: "Forbes",
    link: "https://example.com/press2",
    image: "/assets/press2.jpg",
  },
  {
    id: 3,
    title: "Local Startup Raises $5M for Marketplace Expansion",
    excerpt: "Funding round to scale operations across more NYC boroughs.",
    date: "2025-08-15",
    source: "TechCrunch",
    link: "https://example.com/press3",
    image: "/assets/press3.jpg",
  },
  {
    id: 4,
    title: "Gebeya Go Partners with Local Shops for Trade Events",
    excerpt:
      "Collaborative events to boost small businesses through our platform.",
    date: "2025-07-30",
    source: "Business Insider",
    link: "https://example.com/press4",
    image: "/assets/press4.jpg",
  },
];

// Mock media mentions
const mediaMentions = [
  {
    id: 1,
    publication: "The New York Times",
    quote: "Gebeya Go is the future of local buying and selling.",
    date: "2025-10-05",
    link: "https://example.com/mention1",
  },
  {
    id: 2,
    publication: "CNN Business",
    quote: "Empowering communities one trade at a time.",
    date: "2025-09-12",
    link: "https://example.com/mention2",
  },
  {
    id: 3,
    publication: "Wired",
    quote: "Innovative app making sustainability accessible.",
    date: "2025-08-20",
    link: "https://example.com/mention3",
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

function PressPage() {
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
              In the Press
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Discover what the media is saying about Gebeya Go's impact on
              local commerce and community building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="#releases"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Press Releases
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/contact">Press Inquiries</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section id="releases" className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Press Releases
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with our latest announcements and milestones.
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {pressReleases.map((release) => (
              <motion.div
                key={release.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : hoverScale}
              >
                <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={release.image}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Newspaper className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {release.source}
                      </span>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {release.title}
                    </CardTitle>
                    <CardDescription className="mb-4 line-clamp-3">
                      {release.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(release.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <motion.a
                          href={release.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={shouldReduceMotion ? {} : { x: 2 }}
                          className="flex items-center gap-1"
                        >
                          Read More
                          <ExternalLink className="w-4 h-4" />
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

      {/* Media Mentions */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Media Mentions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Featured in top publications shaping the conversation on local
              economies.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {mediaMentions.map((mention) => (
              <motion.div
                key={mention.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : hoverScale}
              >
                <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors text-center">
                  <CardHeader>
                    <Badge variant="secondary" className="mx-auto mb-2">
                      {mention.publication}
                    </Badge>
                    <CardTitle className="text-lg font-semibold">
                      {mention.publication}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="italic mb-4">
                      "{mention.quote}"
                    </CardDescription>
                    <div className="text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(mention.date).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <motion.a
                        href={mention.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={shouldReduceMotion ? {} : { x: 2 }}
                      >
                        Read Article
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </motion.a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              Press Inquiries
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Interested in covering Gebeya Go? Reach out to our team for
              interviews, assets, or more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="mailto:press@gebayago.com?subject=Press%20Inquiry"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Contact Press Team
                  <Mail className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/contact">General Inquiries</a>
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
                <span>press@gebayago.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default PressPage;
