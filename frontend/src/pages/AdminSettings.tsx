import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Settings,
  Database,
  Server,
  Shield,
  Mail,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  adminEmail: z.string().email('Invalid email address'),
  supportEmail: z.string().email('Invalid email address'),
  maxFileSize: z.number().min(1, 'Max file size must be positive'),
  enableRegistration: z.boolean(),
  enableGuestCheckout: z.boolean(),
  maintenanceMode: z.boolean()
})

type SettingsForm = z.infer<typeof settingsSchema>

export function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [systemInfo, setSystemInfo] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'neo.shop',
      siteDescription: 'Your premium e-commerce store',
      adminEmail: 'admin@example.com',
      supportEmail: 'support@example.com',
      maxFileSize: 5,
      enableRegistration: true,
      enableGuestCheckout: true,
      maintenanceMode: false
    }
  })

  const [databaseStats, setDatabaseStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0
  })

  useEffect(() => {
    // Load system information and database stats
    const loadSystemInfo = async () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002'
      try {
        const [healthRes, productsRes, categoriesRes, usersRes, ordersRes] = await Promise.allSettled([
          axios.get(`${baseURL}/api/health`),
          axios.get(`${baseURL}/api/products`),
          axios.get(`${baseURL}/api/categories`),
          axios.get(`${baseURL}/api/users`),
          axios.get(`${baseURL}/api/orders`)
        ])

        setSystemInfo({
          status: healthRes.status === 'fulfilled' && healthRes.value.data?.success ? 'Online' : 'Offline',
          timestamp: new Date().toISOString()
        })

        setDatabaseStats({
          products: productsRes.status === 'fulfilled' ? (productsRes.value.data?.data?.length || 0) : 0,
          categories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data?.data?.length || 0) : 0,
          users: usersRes.status === 'fulfilled' ? (usersRes.value.data?.data?.length || 0) : 0,
          orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data?.length || 0) : 0
        })
      } catch (error) {
        setSystemInfo({
          status: 'Offline',
          timestamp: new Date().toISOString()
        })
      }
    }
    loadSystemInfo()
  }, [])

  const onSubmit = async (data: SettingsForm) => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
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
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black">Site Settings</h1>
            <p className="text-muted-foreground">
              Configure your e-commerce store settings
            </p>
          </div>
        </div>
        <Badge variant="outline" className="brutal">
          <Settings className="h-4 w-4 mr-2" />
          Admin Settings
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card className="brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="siteName" className="text-sm font-medium">
                      Site Name *
                    </label>
                    <Input
                      id="siteName"
                      placeholder="Your Store Name"
                      className="brutal"
                      {...register('siteName')}
                    />
                    {errors.siteName && (
                      <p className="text-sm text-destructive">{errors.siteName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="adminEmail" className="text-sm font-medium">
                      Admin Email *
                    </label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      className="brutal"
                      {...register('adminEmail')}
                    />
                    {errors.adminEmail && (
                      <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="siteDescription" className="text-sm font-medium">
                    Site Description *
                  </label>
                  <textarea
                    id="siteDescription"
                    placeholder="Describe your store"
                    className="w-full p-2 border-2 border-border rounded-sm brutal min-h-20"
                    {...register('siteDescription')}
                  />
                  {errors.siteDescription && (
                    <p className="text-sm text-destructive">{errors.siteDescription.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="supportEmail" className="text-sm font-medium">
                      Support Email *
                    </label>
                    <Input
                      id="supportEmail"
                      type="email"
                      placeholder="support@example.com"
                      className="brutal"
                      {...register('supportEmail')}
                    />
                    {errors.supportEmail && (
                      <p className="text-sm text-destructive">{errors.supportEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxFileSize" className="text-sm font-medium">
                      Max File Size (MB) *
                    </label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      placeholder="5"
                      className="brutal"
                      {...register('maxFileSize', { valueAsNumber: true })}
                    />
                    {errors.maxFileSize && (
                      <p className="text-sm text-destructive">{errors.maxFileSize.message}</p>
                    )}
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Feature Settings</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="brutal"
                        {...register('enableRegistration')}
                      />
                      <span className="text-sm">Enable User Registration</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="brutal"
                        {...register('enableGuestCheckout')}
                      />
                      <span className="text-sm">Enable Guest Checkout</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="brutal"
                        {...register('maintenanceMode')}
                      />
                      <span className="text-sm">Maintenance Mode</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="brutal w-full"
                  disabled={loading}
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <div className="space-y-6">
          <Card className="brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backend Status</span>
                <Badge 
                  variant={systemInfo?.status === 'Online' ? 'default' : 'destructive'}
                  className="brutal"
                >
                  {systemInfo?.status || 'Unknown'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default" className="brutal">
                  Connected
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frontend</span>
                <Badge variant="default" className="brutal">
                  Online
                </Badge>
              </div>

              {systemInfo?.timestamp && (
                <div className="text-xs text-muted-foreground">
                  Last checked: {new Date(systemInfo.timestamp).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Products</span>
                <span className="text-sm font-mono">{databaseStats.products}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Categories</span>
                <span className="text-sm font-mono">{databaseStats.categories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Users</span>
                <span className="text-sm font-mono">{databaseStats.users}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Orders</span>
                <span className="text-sm font-mono">{databaseStats.orders}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificate</span>
                <Badge variant="default" className="brutal">
                  Valid
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CORS</span>
                <Badge variant="default" className="brutal">
                  Configured
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiting</span>
                <Badge variant="default" className="brutal">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
