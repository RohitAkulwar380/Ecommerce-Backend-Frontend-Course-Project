import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { getAbsoluteUrl } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

interface ProfileData {
  name: string
  email: string
  avatar?: string
}

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.put('/api/profile/profile', profileData)
      if (response.data?.success) {
        const userData = response.data.data;
        // Preserve the full URL for the avatar when updating the user data
        if (userData.avatar) {
          userData.avatar = getAbsoluteUrl(userData.avatar);
        }
        setUser(userData);
        setProfileData({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar
        });
        toast.success('Profile updated successfully')
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      toast.error(error?.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    // Clear the file input immediately to allow the same file to be selected again
    fileInput.value = '';

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await api.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response:', JSON.stringify(response.data, null, 2));
      
      if (response.data?.success) {
        const userData = response.data.data;
        console.log('New user data:', JSON.stringify(userData, null, 2));
        console.log('Avatar URL:', userData.avatar);
        
        if (userData.avatar) {
          const fullUrl = getAbsoluteUrl(userData.avatar);
          setProfileData({
            name: userData.name,
            email: userData.email,
            avatar: fullUrl
          });
          setUser({
            ...userData,
            avatar: fullUrl
          });
        }
        
        toast.success('Avatar updated successfully');
      }
    } catch (error: any) {
      console.error('Failed to upload avatar:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error?.response?.data?.message || 'Failed to upload avatar');
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        Please log in to view your profile.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="brutal">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  key={profileData.avatar} 
                  className="avatar-image"
                  src={profileData.avatar ? `${getAbsoluteUrl(profileData.avatar)}?t=${Date.now()}` : undefined}
                  alt={profileData.name} 
                />
                <AvatarFallback>{profileData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="brutal"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="brutal"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="brutal"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="brutal"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}