import { useState, type ChangeEvent } from "react";
import {
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
  Check,
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
import { Checkbox } from "@/components/ui/checkbox";
import { createProduct } from "@/api/product";
import type { CreateProductPayload } from "@/types/product";

// Static categories
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "music", label: "Musical Instruments" },
];

// Payment options
const paymentOptions = [
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "telebirr", label: "TeleBirr" },
  { id: "mepesa", label: "MePeSa" },
];

type PaymentOption = {
  method: "bank_transfer" | "telebirr" | "mepesa";
  accountNumber: string;
};

function SellPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    location: "",
    images: [] as File[],
    paymentOptions: [] as PaymentOption[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: File[] = [...formData.images, ...files];
    setFormData({ ...formData, images: newImages });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handlePaymentOptionChange = (
    optionId: "bank_transfer" | "telebirr" | "mepesa"
  ) => {
    setFormData((prev) => {
      const currentOptions = prev.paymentOptions;
      if (currentOptions.some((opt) => opt.method === optionId)) {
        return {
          ...prev,
          paymentOptions: currentOptions.filter(
            (opt) => opt.method !== optionId
          ),
        };
      } else {
        return {
          ...prev,
          paymentOptions: [
            ...currentOptions,
            { method: optionId, accountNumber: "" },
          ],
        };
      }
    });
  };

  const handleAccountNumberChange = (
    method: "bank_transfer" | "telebirr" | "mepesa",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentOptions: prev.paymentOptions.map((opt) =>
        opt.method === method ? { ...opt, accountNumber: value } : opt
      ),
    }));
  };

  const getAccountLabel = (method: string): string => {
    switch (method) {
      case "bank_transfer":
        return "Bank Account Number";
      case "telebirr":
        return "TeleBirr Phone Number";
      case "mepesa":
        return "MePeSa Phone Number";
      default:
        return "Account Number";
    }
  };

  const getAccountPlaceholder = (method: string): string => {
    switch (method) {
      case "bank_transfer":
        return "e.g., 1234567890";
      case "telebirr":
        return "e.g., +251911234567";
      case "mepesa":
        return "e.g., +251911234567";
      default:
        return "Enter account number";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      formData.images.length === 0 ||
      formData.paymentOptions.length === 0 ||
      formData.paymentOptions.some((p) => !p.accountNumber.trim())
    ) {
      setError(
        "Please fill in all required fields, upload at least one image, select at least one payment method, and provide account details for each."
      );
      return;
    }

    const payload: CreateProductPayload = {
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category || undefined,
      price: formData.price,
      stock: formData.stock,
      images: formData.images,
      paymentOptions: formData.paymentOptions,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await createProduct(payload);
      setSuccess(true);
      // Reset form on success
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        location: "",
        images: [],
        paymentOptions: [],
      });
      setPreviewImages([]);
    } catch (err) {
      console.error("Failed to create product:", err);
      setError("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6">
              Sell Your Item
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Turn your unused treasures into cash. List your item in minutes
              and reach local buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <a href="#sell-form">
                  Start Listing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/listings">Browse First</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sell Form */}
      <section id="sell-form" className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Create Your Listing
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fill in the details below to get your item in front of local
              buyers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-800">
                Listing created successfully!
              </div>
            )}

            {/* Images Upload */}
            <div className="mb-6">
              <Label htmlFor="images">Upload Photos (Up to 5)</Label>
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
                  disabled={loading}
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
            </div>

            {/* Title */}
            <div className="mb-6">
              <Label htmlFor="name">Item Title</Label>
              <Input
                id="name"
                placeholder="e.g., Vintage Vinyl Record Player"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={loading}
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
            </div>

            {/* Description */}
            <div className="mb-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div className="mb-6">
              <Label htmlFor="price">Price or Trade Offer</Label>
              <Input
                id="price"
                placeholder="e.g., 1500 Birr or Trade for PS5"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Payment Options */}
            <div className="mb-6">
              <Label>Payment Methods *</Label>
              <div className="mt-2 space-y-2">
                {paymentOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.paymentOptions.some(
                        (opt) => opt.method === option.id
                      )}
                      onCheckedChange={() =>
                        handlePaymentOptionChange(option.id as any)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.paymentOptions.length > 0 && (
                <div className="mt-4 space-y-4">
                  {formData.paymentOptions.map((opt) => (
                    <div key={opt.method} className="pt-2 border-t">
                      <Label htmlFor={`account-${opt.method}`}>
                        {getAccountLabel(opt.method)} *
                      </Label>
                      <Input
                        id={`account-${opt.method}`}
                        placeholder={getAccountPlaceholder(opt.method)}
                        value={opt.accountNumber}
                        onChange={(e) =>
                          handleAccountNumberChange(opt.method, e.target.value)
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              )}
              {formData.paymentOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.paymentOptions.map((opt) => (
                    <Badge
                      key={opt.method}
                      variant="secondary"
                      className="text-xs"
                    >
                      {paymentOptions.find((p) => p.id === opt.method)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="1"
                placeholder="e.g., 5"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            {/* Location */}
            <div className="mb-6">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Addis Ababa"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Listing
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tips for Successful Selling
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Maximize your listing's visibility and sales with these quick
              tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Image className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">High-Quality Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Use clear, well-lit photos from multiple angles to showcase
                    your item.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">
                    Detailed Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Include condition, dimensions, and any unique features to
                    build trust.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full p-6 border-border hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <Check className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">Competitive Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Research similar listings to set a fair price that attracts
                    buyers quickly.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Sell?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Your listing will go live immediately after submission. Start
              earning today!
            </p>
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <a href="#sell-form">
                Back to Form
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SellPage;
