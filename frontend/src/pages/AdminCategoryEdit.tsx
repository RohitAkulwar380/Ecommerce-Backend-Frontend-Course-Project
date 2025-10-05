import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  _id: string
  name: string
  slug: string
}

export function AdminCategoryEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')

  // Fetch category
  useEffect(() => {
    if (!id) return

    const fetchCategory = async () => {
      try {
        const response = await api.get(`/api/categories/${id}`)
        if (response.data?.success) {
          setCategory(response.data.data)
          setName(response.data.data.name)
        }
      } catch (e: any) {
        console.error('Failed to fetch category:', e)
        setError(e?.response?.data?.message || 'Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const response = await api.put(`/api/categories/${id}`, {
        name: name.trim()
      })
      
      if (response.data?.success) {
        toast.success('Category updated successfully')
        navigate('/admin/categories')
      }
    } catch (e: any) {
      console.error('Failed to update category:', e)
      toast.error(e?.response?.data?.message || 'Failed to update category')
    }
  }

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
          <h1 className="text-3xl font-black">Edit Category</h1>
          <p className="text-muted-foreground">
            Update category information
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="brutal">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Category name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="brutal"
              />
              {category && (
                <p className="text-sm text-muted-foreground">
                  Slug: {category.slug}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="brutal">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}