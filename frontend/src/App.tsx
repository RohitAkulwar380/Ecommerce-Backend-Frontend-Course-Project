import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { AdminProducts } from '@/pages/AdminProducts'
import { AdminCategories } from '@/pages/AdminCategories'
import { AdminCategoryEdit } from '@/pages/AdminCategoryEdit'
import { AdminProductCreate } from '@/pages/AdminProductCreate'
import { AdminProductEdit } from '@/pages/AdminProductEdit'
import { AdminSettings } from '@/pages/AdminSettings'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { AdminCategoryView } from '@/pages/AdminCategoryView'
import { CartPage } from '@/pages/CartPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { 
        path: 'admin', 
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/products', 
        element: (
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/categories', 
        element: (
          <AdminProtectedRoute>
            <AdminCategories />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/categories/:id', 
        element: (
          <AdminProtectedRoute>
            <AdminCategoryEdit />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/products/new', 
        element: (
          <AdminProtectedRoute>
            <AdminProductCreate />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/products/:id', 
        element: (
          <AdminProtectedRoute>
            <AdminProductEdit />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/settings', 
        element: (
          <AdminProtectedRoute>
            <AdminSettings />
          </AdminProtectedRoute>
        ) 
      },
      { 
        path: 'admin/category/:categoryId', 
        element: (
          <AdminProtectedRoute>
            <AdminCategoryView />
          </AdminProtectedRoute>
        ) 
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      { path: 'cart', element: <CartPage /> },
    ],
  },
])

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster richColors closeButton />
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
