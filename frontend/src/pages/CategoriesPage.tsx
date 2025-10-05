import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'

interface Category {
  _id: string
  name: string
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    axios
      .get(`${baseURL}/api/categories`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data)
        }
      })
      .catch((e) => {
        setError(e?.response?.data?.message || 'Failed to load categories')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="h-8 w-48 brutal bg-muted" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-32 w-full brutal bg-muted" />
              <div className="h-4 w-1/2 brutal bg-muted" />
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
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
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
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black">All Categories</h1>
          <p className="text-muted-foreground">
            Browse products by category
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category._id} className="brutal hover:scale-105 transition-transform flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 flex-1 flex flex-col">
              <p className="text-muted-foreground flex-1">
                Explore our collection of {category.name.toLowerCase()} products
              </p>
              <Button asChild className="brutal w-full mt-auto">
                <Link to={`/category/${category._id}`}>
                  View {category.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
