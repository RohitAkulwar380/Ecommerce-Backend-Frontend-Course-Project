import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Edit,
  ArrowLeft,
  Settings
} from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalUsers: number
  totalOrders: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
      
      try {
        const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.allSettled([
          axios.get(`${baseURL}/api/products`),
          axios.get(`${baseURL}/api/categories`),
          axios.get(`${baseURL}/api/users`),
          axios.get(`${baseURL}/api/orders`)
        ])

        setStats({
          totalProducts: productsRes.status === 'fulfilled' ? (productsRes.value.data?.data?.length || 0) : 0,
          totalCategories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data?.data?.length || 0) : 0,
          totalUsers: usersRes.status === 'fulfilled' ? (usersRes.value.data?.data?.length || 0) : 0,
          totalOrders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data?.length || 0) : 0
        })
      } catch (e) {
        console.error('Failed to fetch stats:', e)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="brutal">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
          <div className="h-8 w-48 brutal bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              Back to Site
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
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your e-commerce store
            </p>
          </div>
        </div>
        <Badge variant="outline" className="brutal">
          Admin Panel
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="brutal">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in store
            </p>
          </CardContent>
        </Card>

        <Card className="brutal">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card className="brutal">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="brutal">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="brutal hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your product catalog, add new products, and update inventory.
            </p>
            <div className="flex gap-2">
              <Button asChild className="brutal flex-1">
                <Link to="/admin/products">
                  <Edit className="h-4 w-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="brutal">
                <Link to="/admin/products/new">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="brutal hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Organize your products with categories and manage product groupings.
            </p>
            <Button asChild className="brutal w-full">
              <Link to="/admin/categories">
                <Edit className="h-4 w-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="brutal hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure site settings, system information, and security features.
            </p>
            <Button asChild className="brutal w-full">
              <Link to="/admin/settings">
                <Edit className="h-4 w-4 mr-2" />
                Manage Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
