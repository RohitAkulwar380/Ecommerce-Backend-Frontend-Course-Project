import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type AdminLoginForm = z.infer<typeof adminLoginSchema>

export function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  })

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate('/admin')
      } else {
        setError('Invalid admin credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-black">Admin Login</h1>
          </div>
          <p className="text-muted-foreground">
            Access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="brutal">
          <CardHeader>
            <CardTitle>Sign in to Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="brutal"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="brutal pr-10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="brutal p-3 text-sm text-destructive bg-destructive/10">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="brutal w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in to Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Site */}
        <div className="text-center">
          <Button asChild variant="outline" className="brutal">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
        </div>

        {/* Admin Credentials Info */}
        <Card className="brutal bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Default Admin Credentials:</p>
              <p>Email: <code className="bg-background px-1 rounded">admin@example.com</code></p>
              <p>Password: <code className="bg-background px-1 rounded">Admin@12345</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

