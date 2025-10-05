import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Save, 
  X,
  Plus,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).optional()
})

type ProductForm = z.infer<typeof productSchema>

interface Category {
  _id: string
  name: string
}

export function AdminProductCreate() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const navigate = useNavigate()
  const { getAuthHeaders } = useAdminAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      images: []
    }
  })

  // Load categories
  useState(() => {
    const fetchCategories = async () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
      try {
        const response = await axios.get(`${baseURL}/api/categories`)
        if (response.data?.success) {
          setCategories(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls)
    setValue('images', newUrls.filter(url => url.trim() !== ''))
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
    setValue('images', newUrls.filter(url => url.trim() !== ''))
  }

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    
    try {
      const response = await axios.post(`${baseURL}/api/products`, {
        ...data,
        images: data.images?.filter(url => url.trim() !== '') || []
      }, {
        headers: getAuthHeaders()
      })

      if (response.data?.success) {
        toast.success('Product created successfully!')
        navigate('/admin/products')
      } else {
        toast.error('Failed to create product')
      }
    } catch (error: any) {
      console.error('Failed to create product:', error)
      toast.error(error.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <button onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </button>
          </Button>
          <div>
            <h1 className="text-3xl font-black">Create New Product</h1>
            <p className="text-muted-foreground">
              Add a new product to your store
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="brutal">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name *
                </label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  className="brutal"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <select
                  id="category"
                  className="w-full p-2 border-2 border-border rounded-sm brutal"
                  {...register('category')}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                placeholder="Enter product description"
                className="w-full p-2 border-2 border-border rounded-sm brutal min-h-24"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="brutal"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity *
                </label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  className="brutal"
                  {...register('stock', { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Product Images</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="brutal"
                  onClick={addImageUrl}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Image URL"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    className="brutal flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="brutal"
                    onClick={() => removeImageUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="brutal"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="brutal"
                disabled={loading}
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
