import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  async function onSubmit(values: LoginValues) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('Login attempt:', { baseURL, values })
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, values, { withCredentials: true })
      console.log('Login response:', response.data)
      if (response.data.success) {
        const userData = response.data.data
        if (userData.avatar) {
          userData.avatar = `${baseURL}${userData.avatar}`
        }
        login(userData)
        toast.success('Logged in successfully')
        navigate('/')
      }
    } catch (e: any) {
      console.error('Login error:', e)
      console.error('Error response:', e?.response?.data)
      toast.error(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto brutal p-6">
      <h1 className="text-2xl font-black mb-4">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="brutal w-full">Sign in</Button>
        </form>
      </Form>
    </div>
  )
}
