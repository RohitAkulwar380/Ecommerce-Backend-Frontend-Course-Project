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
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type SignupValues = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const form = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: SignupValues) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    console.log('Signup attempt:', { baseURL, values })
    try {
      const response = await axios.post(`${baseURL}/api/auth/register`, values, { withCredentials: true })
      console.log('Signup response:', response.data)
      if (response.data.success) {
        login(response.data.data)
        toast.success('Account created successfully')
        navigate('/')
      }
    } catch (e: any) {
      console.error('Signup error:', e)
      console.error('Error response:', e?.response?.data)
      toast.error(e?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto brutal p-6">
      <h1 className="text-2xl font-black mb-4">Create account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" className="brutal w-full">Sign up</Button>
        </form>
      </Form>
    </div>
  )
}
