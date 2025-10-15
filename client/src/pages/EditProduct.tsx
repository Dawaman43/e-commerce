// Updated EditProductPage component with logs
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X, Edit3, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getProductsBySeller,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/api/product";
import type { Product, UpdateProductPayload } from "@/types/product";
import { useAuth } from "@/components/auth-provider";

function EditProductPage() {
  const { user } = useAuth(); // Get current user from auth context/hook

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state for editing
  const [formData, setFormData] = useState<Partial<UpdateProductPayload>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [user?.id]);

  const fetchProducts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await getProductsBySeller(user.id);
      setProducts(response.products || []);
    } catch (err) {
      setError("Failed to fetch your products.");
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (productId: string) => {
    try {
      const response = await getProductById(productId);
      const prod = response.product;
      setSelectedProduct(prod);
      setFormData({
        name: prod.name,
        description: prod.description || "",
        category: prod.category,
        price: prod.price,
        stock: prod.stock,
      });
      setImages([]);
      setImagePreviews(prod.images || []);
      setExistingImages(prod.images || []); // Preserve existing images
    } catch (err) {
      setError("Failed to load product for editing.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === "string") {
            setImagePreviews((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("price", String(formData.price || 0));
      formDataToSend.append("stock", String(formData.stock || 0));

      // Append new images
      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Optional: keep existing images by sending them as JSON string
      if (existingImages && existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // ✅ ADD THESE LOGS TO DEBUG FRONTEND REQUEST
      console.log("=== FRONTEND UPDATE PRODUCT DEBUG ===");
      console.log("FormData entries:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
        if (value instanceof File) {
          console.log(
            `  - File size: ${(value as File).size} bytes, type: ${
              (value as File).type
            }`
          );
        }
      }
      console.log("FormData has 'name':", formDataToSend.has("name"));
      console.log("FormData has 'price':", formDataToSend.has("price"));
      console.log(
        "FormData has 'existingImages':",
        formDataToSend.has("existingImages")
      );
      console.log("Number of new images:", images.length);
      console.log("==============================================");

      await updateProduct(selectedProduct._id, formDataToSend);

      setSuccess("Product updated successfully!");
      setSelectedProduct(null);
      setImages([]);
      setImagePreviews([]);
      setExistingImages([]);

      // Refetch product list
      await fetchProducts();
    } catch (err) {
      setError("Failed to update product.");
      console.error("Update product error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      setSuccess("Product deleted successfully!");
      await fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  const closeEdit = () => {
    setSelectedProduct(null);
    setFormData({});
    setImages([]);
    setImagePreviews([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Products</CardTitle>
          <CardDescription>View and edit your posted products.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Products List */}
          <div className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product._id)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No products posted by you.
              </p>
            )}
          </div>

          {/* Edit Form - Shown when selected */}
          {selectedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Product: {selectedProduct.name}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={closeEdit}
                  className="absolute right-4 top-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <Label htmlFor="images">Images (New)</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {selectedProduct.images &&
                      selectedProduct.images.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Current images: {selectedProduct.images.length}
                        </p>
                      )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={closeEdit}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updating}>
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProductPage;
