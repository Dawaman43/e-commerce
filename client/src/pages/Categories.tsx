import { useState, useEffect } from "react";
import { Search, Filter, ArrowRight, ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/api/product";
import type { Product } from "@/types/product";

function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Hardcoded filter tags (since backend doesn't have condition field; can extend later)
  const filterTags = [
    { name: "New", count: 450, slug: "new" },
    { name: "Used", count: 380, slug: "used" },
    { name: "Vintage", count: 120, slug: "vintage" },
    { name: "Local Pickup", count: 600, slug: "local" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProducts(); // Fetch all products
        const products = response.products || [];

        // Compute unique categories with counts and featured items
        const categoryMap = new Map();
        products.forEach((product: Product) => {
          const cat = product.category || "Uncategorized";
          if (!categoryMap.has(cat)) {
            categoryMap.set(cat, {
              name: cat,
              count: 0,
              featuredItems: [],
              slug: cat.toLowerCase().replace(/\s+/g, "-"),
            });
          }
          const entry = categoryMap.get(cat);
          entry.count += 1;
          if (entry.featuredItems.length < 3) {
            entry.featuredItems.push(product.name);
          }
        });

        const computedCategories = Array.from(categoryMap.values()).map(
          (cat) => ({
            ...cat,
            description: `${cat.name} items for every interest.`,
            icon: "📦", // Generic icon; can map based on category if needed
          })
        );

        setCategories(computedCategories);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setCategories([]); // Fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter categories based on search and tags
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTags.size === 0 ||
      Array.from(selectedTags).some((tag: string) =>
        category.name.toLowerCase().includes(tag.toLowerCase())
      );
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-4 md:mb-6">
              Explore Categories
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6 md:mb-8 px-4">
              Find what you're looking for in our curated collection of local
              listings.
            </p>
            <div className="max-w-md sm:max-w-2xl mx-auto w-full">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories or items..."
                  className="pl-10 sm:pl-12 pr-4 py-3 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {filteredCategories.length} Categories
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="w-full lg:w-auto"
              asChild
            >
              <a
                href="/sell"
                className="justify-between w-full lg:justify-start"
              >
                Sell in a Category
                <ChevronRight className="w-4 h-4 ml-1 hidden lg:inline" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Categories Grid */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No categories found. Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredCategories.map((category) => (
                    <div key={category.name}>
                      <a href={`/categories/${category.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer w-full">
                          <div className="relative h-32 sm:h-48 bg-gradient-to-br from-muted to-muted-foreground/10 overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute top-4 left-4 text-3xl sm:text-4xl">
                              {category.icon}
                            </div>
                          </div>
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                              <CardTitle className="text-base sm:text-xl group-hover:text-primary transition-colors line-clamp-1">
                                {category.name}
                              </CardTitle>
                              <Badge variant="secondary" className="w-fit">
                                {category.count} items
                              </Badge>
                            </div>
                            <CardDescription className="mb-4 line-clamp-2 text-sm">
                              {category.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {category.featuredItems
                                .slice(0, 3)
                                .map((item: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                              <span>Explore Now</span>
                              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 order-1 lg:order-2 space-y-4 lg:space-y-6 w-full lg:w-auto">
              {/* Tags Filter */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ul className="space-y-2">
                    {filterTags.map((tag) => (
                      <li key={tag.slug}>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <Checkbox
                              className="w-4 h-4"
                              checked={selectedTags.has(tag.name)}
                              onCheckedChange={(checked: boolean) => {
                                const newSet = new Set(selectedTags);
                                if (checked) {
                                  newSet.add(tag.name);
                                } else {
                                  newSet.delete(tag.name);
                                }
                                setSelectedTags(newSet);
                              }}
                            />
                            <span>{tag.name}</span>
                          </label>
                          <span className="text-xs text-muted-foreground">
                            ({tag.count})
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      asChild
                    >
                      <a href="/sell">
                        <Tag className="w-4 h-4 mr-2" />
                        Sell an Item
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      asChild
                    >
                      <a href="/trade">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Propose a Trade
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;
