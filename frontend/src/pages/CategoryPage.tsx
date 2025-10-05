import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useMemo } from 'react'

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

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const location = useLocation()
  const isFromAdmin = location.pathname.includes('/admin/') || location.pathname.includes('/admin')
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { addItem } = useCart()

  // Fetch category and products
  useEffect(() => {
    if (!categoryId) return

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    
    Promise.all([
      axios.get(`${baseURL}/api/categories/${categoryId}`),
      axios.get(`${baseURL}/api/products?category=${categoryId}`)
    ])
    .then(([categoryRes, productsRes]) => {
      if (categoryRes.data?.success) {
        setCategory(categoryRes.data.data)
      }
      if (productsRes.data?.success && Array.isArray(productsRes.data.data)) {
        setProducts(productsRes.data.data)
      }
    })
    .catch((e) => {
      setError(e?.response?.data?.message || 'Failed to load category data')
    })
    .finally(() => setLoading(false))
  }, [categoryId])

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to={isFromAdmin ? "/admin/categories" : "/categories"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <div className="h-8 w-48 brutal bg-muted" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 w-full brutal bg-muted" />
              <div className="h-4 w-1/2 brutal bg-muted" />
              <div className="h-4 w-1/3 brutal bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to={isFromAdmin ? "/admin/categories" : "/categories"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
        </div>
        <div className="brutal p-6 text-center text-destructive">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" className="brutal">
          <Link to={isFromAdmin ? "/admin/categories" : "/categories"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black">{category?.name || 'Category'}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${category?.name || 'products'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 brutal"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="brutal p-6 text-center text-muted-foreground">
          {searchTerm ? 'No products found matching your search.' : 'No products available in this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const price = Number(product.price)
            const safePrice = Number.isFinite(price) ? price : 0
            return (
              <div key={product._id} className="relative pt-4 pr-4">
                <ProductAddedCount productId={product._id} />
                <Card className="brutal h-full">
                  <div className="aspect-square w-full overflow-hidden">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{product.name}</span>
                      <Badge className="brutal">${safePrice.toFixed(2)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground min-h-12">
                      {product.description || 'No description available'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
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
                      <ShoppingCart size={16} /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
          })}
        </div>
      )}
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
