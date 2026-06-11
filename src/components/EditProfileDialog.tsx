import { useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { authService } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePicture || null)

  const isInstitution = user?.role === "institution"

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }

    setUploadingImage(true)
    try {
      const result = await authService.uploadProfilePicture(file)
      await refreshUser()
      setPreviewUrl(result?.user?.profilePicture || URL.createObjectURL(file))
      toast.success("Profile picture updated")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image")
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    setSaving(true)
    try {
      const payload: { name?: string; email?: string; bio?: string } = {}
      if (name !== user?.name) payload.name = name.trim()
      if (email !== user?.email) payload.email = email.trim()
      if (isInstitution && bio !== user?.bio) payload.bio = bio
      if (Object.keys(payload).length === 0) {
        onOpenChange(false)
        return
      }
      await authService.updateProfile(payload)
      await refreshUser()
      toast.success("Profile updated")
      onOpenChange(false)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update profile"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            {isInstitution ? "Update your institution profile." : "Update your name and email address."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border hover:border-primary/50 transition-colors overflow-hidden group"
            >
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : previewUrl ? (
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground/40">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border/40"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border/40"
              placeholder="your@email.com"
            />
          </div>
          {isInstitution && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border-border/40 min-h-[100px]"
                placeholder="Tell us about your institution..."
                maxLength={500}
              />
              <p className="text-[10px] text-muted-foreground text-right">{bio.length}/500</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-border/40">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
