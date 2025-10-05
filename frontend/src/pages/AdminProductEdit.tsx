import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  Trash2
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

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: {
    _id: string
    name: string
  }
}

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const navigate = useNavigate()
  const { getAuthHeaders } = useAdminAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema)
  })

  // Load product and categories
  useEffect(() => {
    const fetchData = async () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
      
      try {
        const [productRes, categoriesRes] = await Promise.all([
          axios.get(`${baseURL}/api/products/${id}`),
          axios.get(`${baseURL}/api/categories`)
        ])

        if (productRes.data?.success) {
          const product: Product = productRes.data.data
          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category._id,
            images: product.images || []
          })
          setImageUrls(product.images?.length ? product.images : [''])
        }

        if (categoriesRes.data?.success) {
          setCategories(categoriesRes.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load product data')
        navigate('/admin/products')
      } finally {
        setLoadingProduct(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, navigate, reset])

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
      const response = await axios.put(`${baseURL}/api/products/${id}`, {
        ...data,
        images: data.images?.filter(url => url.trim() !== '') || []
      }, {
        headers: getAuthHeaders()
      })

      if (response.data?.success) {
        toast.success('Product updated successfully!')
        navigate('/admin/products')
      } else {
        toast.error('Failed to update product')
      }
    } catch (error: any) {
      console.error('Failed to update product:', error)
      toast.error(error.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    setLoading(true)
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
    
    try {
      await axios.delete(`${baseURL}/api/products/${id}`, {
        headers: getAuthHeaders()
      })
      toast.success('Product deleted successfully!')
      navigate('/admin/products')
    } catch (error: any) {
      console.error('Failed to delete product:', error)
      toast.error(error.response?.data?.message || 'Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-32 brutal bg-muted" />
          <div className="h-8 w-48 brutal bg-muted" />
        </div>
        <div className="h-96 w-full brutal bg-muted" />
      </div>
    )
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
            <h1 className="text-3xl font-black">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="brutal"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Product
        </Button>
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
                  'Updating...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Product
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
