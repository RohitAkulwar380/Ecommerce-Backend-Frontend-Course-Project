import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Edit, Plus } from 'lucide-react'

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

export function AdminCategoryView() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch category and products
  useEffect(() => {
    if (!categoryId) return

    Promise.all([
      api.get(`/api/categories/${categoryId}`),
      api.get(`/api/products?category=${categoryId}`)
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
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/admin/categories">
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
            <Link to="/admin/categories">
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
          <Link to="/admin/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black">{category?.name || 'Category'}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} in this category
          </p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search products in ${category?.name || 'category'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 brutal"
          />
        </div>
        <Button asChild className="brutal">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
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
              <Card key={product._id} className="brutal">
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
                    asChild
                    className="brutal inline-flex items-center gap-2"
                  >
                    <Link to={`/admin/products/${product._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}