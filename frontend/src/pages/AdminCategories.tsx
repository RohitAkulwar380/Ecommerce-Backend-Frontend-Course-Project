import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Package
} from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/api/categories`)
        if (response.data?.success && Array.isArray(response.data.data)) {
          setCategories(response.data.data)
        }
      } catch (e) {
        console.error('Failed to fetch categories:', e)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    
    try {
      const response = await api.post('/api/categories', {
        name: newCategoryName.trim()
      })
      
      if (response.data?.success) {
        setCategories([...categories, response.data.data])
        setNewCategoryName('')
      }
    } catch (e: any) {
      console.error('Failed to create category:', e)
      alert(e?.response?.data?.message || 'Failed to create category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all products in this category.')) return
    
    try {
      await api.delete(`/api/categories/${categoryId}`)
      setCategories(categories.filter(c => c._id !== categoryId))
    } catch (e: any) {
      console.error('Failed to delete category:', e)
      alert(e?.response?.data?.message || 'Failed to delete category')
    }
  }

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
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black">Category Management</h1>
            <p className="text-muted-foreground">
              Organize your products with categories
            </p>
          </div>
        </div>
      </div>

      {/* Add New Category */}
      <Card className="brutal">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCategory} className="flex gap-4">
            <Input
              placeholder="Category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="brutal flex-1"
            />
            <Button type="submit" className="brutal">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 brutal"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="brutal p-6 text-center text-muted-foreground">
          {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category._id} className="brutal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <Badge variant="outline" className="brutal w-fit">
                  {category.slug}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Created: {new Date(category.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(category.updatedAt).toLocaleDateString()}</div>
                  <div>ID: <code className="text-xs">{category._id.slice(-6)}</code></div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="brutal flex-1">
                  <Link to={`/admin/categories/${category._id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="brutal">
                  <Link to={`/admin/category/${category._id}`}>
                    <Package className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="brutal"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
