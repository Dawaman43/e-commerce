import { motion, useInView } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import {
  ArrowRightLeft,
  Upload,
  Image,
  Tag,
  MapPin,
  FileText,
  Send,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Search,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { easeOut } from "framer-motion";

// Mock categories
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "music", label: "Musical Instruments" },
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

function TradePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [formData, setFormData] = useState({
    yourItem: "",
    yourDescription: "",
    wantItem: "",
    wantDescription: "",
    category: "",
    location: "",
    images: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: File[] = [...formData.images, ...files];
    setFormData({ ...formData, images: newImages });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., API call)
    console.log("Trade proposal submitted:", formData);
  };

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
              Propose a Trade
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Swap your items with others in your community. Find the perfect
              match and trade locally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="#trade-form"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Start Trading
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/listings">Browse Listings</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trade Form */}
      <section id="trade-form" className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Create Trade Proposal
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Describe what you have to offer and what you're looking for in
              return.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Images Upload */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="images">
                Upload Photos of Your Item (Up to 5)
              </Label>
              <div className="mt-2">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById("images")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.images.length === 0
                    ? "Choose Files"
                    : `${formData.images.length}/5 Photos Selected`}
                </Button>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewImages.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Your Item */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="yourItem">What You Have to Offer</Label>
              <Input
                id="yourItem"
                placeholder="e.g., Acoustic Guitar in good condition"
                value={formData.yourItem}
                onChange={(e) =>
                  setFormData({ ...formData, yourItem: e.target.value })
                }
                required
              />
            </motion.div>

            {/* Your Description */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="yourDescription">Description of Your Item</Label>
              <Textarea
                id="yourDescription"
                placeholder="Describe your item in detail..."
                value={formData.yourDescription}
                onChange={(e) =>
                  setFormData({ ...formData, yourDescription: e.target.value })
                }
                rows={3}
                required
              />
            </motion.div>

            {/* What You Want */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="wantItem">What You're Looking For</Label>
              <Input
                id="wantItem"
                placeholder="e.g., Guitar Amp or similar value"
                value={formData.wantItem}
                onChange={(e) =>
                  setFormData({ ...formData, wantItem: e.target.value })
                }
                required
              />
            </motion.div>

            {/* Want Description */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="wantDescription">Details on What You Want</Label>
              <Textarea
                id="wantDescription"
                placeholder="Any specifics on condition, brand, etc..."
                value={formData.wantDescription}
                onChange={(e) =>
                  setFormData({ ...formData, wantDescription: e.target.value })
                }
                rows={3}
                required
              />
            </motion.div>

            {/* Category */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Location */}
            <motion.div variants={itemVariants} className="mb-6">
              <Label htmlFor="location">Preferred Trade Location</Label>
              <Input
                id="location"
                placeholder="e.g., Brooklyn, NY"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                whileHover={shouldReduceMotion ? {} : hoverScale}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Send Trade Proposal
                <Send className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tips for Successful Trading
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Make your trades smooth and fair with these expert tips.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Image className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">Clear Descriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Be specific about item conditions and what you expect in
                    return to avoid misunderstandings.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">Meet Safely</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Always trade in public places and verify items before
                    exchanging.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Tag className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">Communicate Openly</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Use our messaging to negotiate and confirm details before
                    meeting.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
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
              Ready to Trade?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your proposal will be sent to potential matches in your area.
              Happy trading!
            </p>
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <motion.a
                href="#trade-form"
                whileHover={shouldReduceMotion ? {} : hoverScale}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Back to Form
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default TradePage;
