import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowRight, ShoppingBag, Truck, Shield, Star, Search, ShoppingCart, LayoutGrid, List } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useMemo } from 'react'
import axios from 'axios'

interface Product {
  _id: string
  name: string
  price: number
  description?: string
  images?: string[]
  category?: {
    _id: string
    name: string
  }
}

interface Category {
  _id: string
  name: string
}

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { addItem } = useCart()

  // Fetch products and categories
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    
    Promise.all([
      axios.get(`${baseURL}/api/products`),
      axios.get(`${baseURL}/api/categories`)
    ])
    .then(([productsRes, categoriesRes]) => {
      if (productsRes.data?.success && Array.isArray(productsRes.data.data)) {
        setProducts(productsRes.data.data)
      }
      if (categoriesRes.data?.success && Array.isArray(categoriesRes.data.data)) {
        setCategories(categoriesRes.data.data)
      }
    })
    .catch((e) => {
      setError(e?.response?.data?.message || 'Failed to load data')
    })
    .finally(() => setLoading(false))
  }, [])

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {}
    
    filteredProducts.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized'
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(product)
    })
    
    return grouped
  }, [filteredProducts])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Welcome to{' '}
            <span className="text-primary">neo.shop</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="brutal">
            <Link to="/products">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="brutal">
            <Link to="/cart">
              View Cart <ShoppingBag className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="brutal text-center">
          <CardHeader>
            <Truck className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Fast Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get your orders delivered quickly and safely to your doorstep.
            </p>
          </CardContent>
        </Card>

        <Card className="brutal text-center">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Secure Shopping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your data and payments are protected with industry-standard security.
            </p>
          </CardContent>
        </Card>

        <Card className="brutal text-center">
          <CardHeader>
            <Star className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Quality Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We curate only the best products from trusted brands and suppliers.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Search Section */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Search Products</h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 brutal"
            />
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Our Products</h2>
          <p className="text-muted-foreground">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Browse our amazing collection'}
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="brutal"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="brutal"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-40 w-full brutal bg-muted" />
                <div className="h-4 w-1/2 brutal bg-muted" />
                <div className="h-4 w-1/3 brutal bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="brutal p-6 text-center text-destructive">
            {error}
          </div>
        ) : Object.keys(productsByCategory).length === 0 ? (
          <div className="brutal p-6 text-center text-muted-foreground">
            {searchTerm ? 'No products found matching your search.' : 'No products available.'}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">{categoryName}</h3>
                  <Badge variant="outline" className="brutal">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}
                  </Badge>
                </div>
                <div className={viewMode === 'grid' 
                  ? 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
                  : 'space-y-4'
                }>
                  {categoryProducts.map((product) => {
                    const price = Number(product.price)
                    const safePrice = Number.isFinite(price) ? price : 0
                    return (
                      <div key={product._id} className={viewMode === 'grid' 
                        ? 'relative flex-shrink-0 w-64 pt-4 pr-4'
                        : 'relative w-full'
                      }>
                        <ProductAddedCount productId={product._id} />
                        <Card className={`brutal ${viewMode === 'grid' ? 'h-full w-64' : 'w-full'}`}>
                          {viewMode === 'grid' ? (
                            <>
                              <div className="aspect-square w-full overflow-hidden">
                                <img 
                                  src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex flex-col gap-2">
                                  <span className="text-base font-bold">{product.name}</span>
                                  <Badge className="brutal w-fit">${safePrice.toFixed(2)}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-3">
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                  {product.description || 'No description available'}
                                </p>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button
                                  size="sm"
                                  className="brutal w-full inline-flex items-center gap-2"
                                  onClick={() =>
                                    addItem({ 
                                      productId: product._id, 
                                      name: product.name, 
                                      price: safePrice, 
                                      quantity: 1 
                                    })
                                  }
                                >
                                  <ShoppingCart size={14} /> Add to Cart
                                </Button>
                              </CardFooter>
                            </>
                          ) : (
                            <div className="flex gap-4 p-4">
                              <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                                <img 
                                  src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow flex flex-col">
                                <CardHeader className="p-0">
                                  <CardTitle className="flex items-center justify-between">
                                    <span className="text-lg">{product.name}</span>
                                    <Badge className="brutal">${safePrice.toFixed(2)}</Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 mt-2">
                                  <p className="text-sm text-muted-foreground">
                                    {product.description || 'No description available'}
                                  </p>
                                </CardContent>
                                <div className="mt-auto pt-4">
                                  <Button
                                    size="sm"
                                    className="brutal inline-flex items-center gap-2"
                                    onClick={() =>
                                      addItem({ 
                                        productId: product._id, 
                                        name: product.name, 
                                        price: safePrice, 
                                        quantity: 1 
                                      })
                                    }
                                  >
                                    <ShoppingCart size={14} /> Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Preview */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black">Shop by Category</h2>
          <p className="text-muted-foreground">
            Explore our wide range of product categories
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category._id} className="brutal hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" size="sm" className="brutal">
                  <Link to={`/category/${category._id}`}>
                    Shop {category.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-16 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-black">Ready to Start Shopping?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Browse our extensive collection of products and find exactly what you're looking for.
        </p>
        <Button asChild size="lg" className="brutal">
          <Link to="/products">
            Explore All Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}

function ProductAddedCount({ productId }: { productId: string }) {
  const { items } = useCart()
  const qty = useMemo(() => items.find((i) => i.productId === productId)?.quantity ?? 0, [items, productId])
  if (!qty) return null
  return (
    <div className="absolute top-0 right-0 brutal bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-sm z-10">
      +{qty}
    </div>
  )
}
