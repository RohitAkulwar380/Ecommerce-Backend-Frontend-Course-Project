import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdmin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="brutal w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-8 w-8 mx-auto brutal bg-muted animate-pulse" />
              <p className="text-muted-foreground">Checking admin access...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="brutal w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto text-destructive" />
              <div>
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground">
                  You need admin privileges to access this page.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="outline" className="brutal">
                  <Link to="/admin/login">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="brutal">
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Site
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

