import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Eye,
  LayoutGrid,
  List,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { getAuthHeaders } = useAdminAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002";

      try {
        const response = await axios.get(`${baseURL}/api/products`);
        if (response.data?.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002";

    try {
      await axios.delete(`${baseURL}/api/products/${productId}`, {
        headers: getAuthHeaders(),
      });
      setProducts(products.filter((p) => p._id !== productId));
    } catch (e) {
      console.error("Failed to delete product:", e);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="h-8 w-48 brutal bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 w-full brutal bg-muted" />
              <div className="h-4 w-1/2 brutal bg-muted" />
              <div className="h-4 w-1/3 brutal bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="brutal p-6 text-center text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild className="brutal">
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="brutal"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="brutal"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 brutal"
          />
        </div>
      </div>{" "}
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="brutal p-6 text-center text-muted-foreground">
          {searchTerm
            ? "No products found matching your search."
            : "No products available."}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <Card key={product._id} className="brutal">
              {viewMode === "grid" ? (
                <>
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{product.name}</span>
                      <Badge className="brutal">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </CardTitle>
                    {product.category && (
                      <Badge variant="outline" className="brutal w-fit">
                        {product.category.name}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Stock: <strong>{product.stock}</strong>
                      </span>
                      <span>
                        ID:{" "}
                        <code className="text-xs">{product._id.slice(-6)}</code>
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="brutal flex-1"
                    >
                      <Link to={`/admin/products/${product._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="brutal"
                    >
                      <Link to={`/admin/products/${product._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="brutal"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <div className="flex gap-4 p-4">
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <CardHeader className="p-0">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{product.name}</span>
                        <Badge className="brutal">
                          ${product.price.toFixed(2)}
                        </Badge>
                      </CardTitle>
                      {product.category && (
                        <Badge variant="outline" className="brutal w-fit mt-2">
                          {product.category.name}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          Stock: <strong>{product.stock}</strong>
                        </span>
                        <span>
                          ID:{" "}
                          <code className="text-xs">
                            {product._id.slice(-6)}
                          </code>
                        </span>
                      </div>
                    </CardContent>
                    <div className="mt-auto pt-4 flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="brutal flex-1"
                      >
                        <Link to={`/admin/products/${product._id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="brutal"
                      >
                        <Link to={`/admin/products/${product._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="brutal"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
