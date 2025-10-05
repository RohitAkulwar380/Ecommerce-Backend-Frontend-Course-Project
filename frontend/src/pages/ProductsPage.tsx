import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search, Filter, LayoutGrid, List } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category?: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current filters from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  // Update URL when filters change
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  // Fetch products with filters
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    const queryString = params.toString();
    const url = `${baseURL}/api/products${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching products from:", url);
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        console.log("Products response:", res.data);
        const list = (res.data?.data ?? res.data?.products) as unknown;
        if (Array.isArray(list)) {
          setProducts(list as Product[]);
          console.log("Products set:", list.length, "items");
        } else {
          console.log("No products array found in response");
          setProducts([]);
        }
      })
      .catch((e) => {
        console.error("Products fetch error:", e);
        setError(e?.response?.data?.message || "Failed to load products");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  // Fetch categories
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    console.log("Fetching categories from:", `${baseURL}/api/categories`);
    axios
      .get(`${baseURL}/api/categories`)
      .then((res) => {
        console.log("Categories response:", res.data);
        const list = (res.data?.data ?? res.data?.categories) as unknown;
        if (Array.isArray(list)) {
          setCategories(list as Category[]);
          console.log("Categories set:", list.length, "items");
        }
      })
      .catch((e) => {
        console.error("Failed to load categories:", e);
      });
  }, []);

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value === 'all' ? '' : value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value === 'default' ? '' : value });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black">Our Products</h1>
        <p className="text-muted-foreground">
          Discover amazing products at unbeatable prices
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="brutal">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 brutal"
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="brutal">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="brutal">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="-name">Name Z-A</SelectItem>
                <SelectItem value="price">Price Low to High</SelectItem>
                <SelectItem value="-price">Price High to Low</SelectItem>
                <SelectItem value="-createdAt">Newest First</SelectItem>
                <SelectItem value="createdAt">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="brutal"
              disabled={!search && !category && !sort}
            >
              Clear Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(search || category || sort) && (
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <Badge variant="secondary" className="brutal">
                    Search: "{search}"
                  </Badge>
                )}
                {category && (
                  <Badge variant="secondary" className="brutal">
                    Category:{" "}
                    {categories.find((c) => c._id === category)?.name ||
                      category}
                  </Badge>
                )}
                {sort && (
                  <Badge variant="secondary" className="brutal">
                    Sort: {sort}
                  </Badge>
                )}
              </div>
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
          )}
        </CardContent>
      </Card>

      {/* Products Container */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {error && (
          <div className="col-span-full brutal p-4 text-destructive">
            {error}
          </div>
        )}
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-40 w-full brutal bg-muted" />
                <div className="h-4 w-1/2 brutal bg-muted" />
                <div className="h-4 w-1/3 brutal bg-muted" />
              </div>
            ))
          : products.map((p) => {
              const price = Number(p.price);
              const safePrice = Number.isFinite(price) ? price : 0;
              return (
                <div
                  key={p._id || p.name}
                  className={
                    viewMode === "grid" ? "relative pt-4 pr-4" : "relative"
                  }
                >
                  {/* Count bubble */}
                  <ProductAddedCount productId={p._id || p.name} />
                  <Card className="brutal">
                    {viewMode === "grid" ? (
                      <>
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={p.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{p.name}</span>
                            <Badge className="brutal">
                              ${safePrice.toFixed(2)}
                            </Badge>
                          </CardTitle>
                          {p.category && (
                            <Badge variant="outline" className="brutal w-fit">
                              {p.category.name}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground min-h-12">
                            {p.description || "No description available"}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button
                            className="brutal inline-flex items-center gap-2"
                            onClick={() =>
                              addItem({
                                productId: p._id || p.name,
                                name: p.name,
                                price: safePrice,
                                quantity: 1,
                              })
                            }
                          >
                            <ShoppingCart size={16} /> Add to Cart
                          </Button>
                        </CardFooter>
                      </>
                    ) : (
                      <div className="flex gap-4 p-4">
                        <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                          <img
                            src={p.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow flex flex-col">
                          <CardHeader className="p-0">
                            <CardTitle className="flex items-center justify-between">
                              <span className="text-lg">{p.name}</span>
                              <Badge className="brutal">
                                ${safePrice.toFixed(2)}
                              </Badge>
                            </CardTitle>
                            {p.category && (
                              <Badge
                                variant="outline"
                                className="brutal w-fit mt-2"
                              >
                                {p.category.name}
                              </Badge>
                            )}
                          </CardHeader>
                          <CardContent className="p-0 mt-2">
                            <p className="text-sm text-muted-foreground">
                              {p.description || "No description available"}
                            </p>
                          </CardContent>
                          <div className="mt-auto pt-4 flex justify-end">
                            <Button
                              className="brutal inline-flex items-center gap-2"
                              onClick={() =>
                                addItem({
                                  productId: p._id || p.name,
                                  name: p.name,
                                  price: safePrice,
                                  quantity: 1,
                                })
                              }
                            >
                              <ShoppingCart size={16} /> Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
        {!loading && !error && products.length === 0 && (
          <div className="col-span-full brutal p-6 text-center text-muted-foreground">
            No products found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductAddedCount({ productId }: { productId: string }) {
  const { items } = useCart();
  const qty = useMemo(
    () => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items, productId]
  );
  if (!qty) return null;
  return (
    <div className="absolute top-0 right-0 brutal bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-sm z-10">
      +{qty}
    </div>
  );
}
