import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { eventService } from "@/services/eventService"
import { toast } from "sonner"
import { Upload, Trash2 } from "lucide-react"
import { CATEGORIES } from "@/lib/categories"

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location (City) is required"),
  venue: z.string().min(3, "Venue is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
})

type EventFormValues = z.infer<typeof eventSchema>

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      price: 0,
      capacity: 100,
      image: "",
    }
  })

  const imageValue = watch("image")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Max image size is 5MB."
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue("image", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setValue("image", "")
  }

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true)
    try {
      // Filter out empty image string so it defaults in the backend
      const payload = {
        ...data,
        image: data.image === "" ? undefined : data.image
      }
      await eventService.submitEvent(payload)
      toast.success("Event submitted!", {
        description: "Your event has been successfully submitted for moderation.",
      })
      navigate("/")
    } catch (error: any) {
      toast.error("Failed to create event", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 mesh-gradient">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Create New Event</CardTitle>
                <CardDescription>Fill in the details below to host your unforgettable experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Event Title</label>
                    <Input 
                      {...register("title")}
                      placeholder="e.g. Summer Music Festival" 
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Category</label>
                    <select
                      {...register("category")}
                      className={`flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.category ? "border-destructive" : "border-input"}`}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Date</label>
                      <Input 
                        {...register("date")}
                        type="date" 
                        className={errors.date ? "border-destructive" : ""}
                      />
                      {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Time</label>
                      <Input 
                        {...register("time")}
                        type="time" 
                        className={errors.time ? "border-destructive" : ""}
                      />
                      {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Price ($)</label>
                      <Input 
                        {...register("price")}
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Capacity</label>
                      <Input 
                        {...register("capacity")}
                        type="number" 
                        placeholder="100" 
                        className={errors.capacity ? "border-destructive" : ""}
                      />
                      {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">City / Location</label>
                      <Input 
                        {...register("location")}
                        placeholder="e.g. San Francisco" 
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Venue</label>
                      <Input 
                        {...register("venue")}
                        placeholder="e.g. Moscone Center" 
                        className={errors.venue ? "border-destructive" : ""}
                      />
                      {errors.venue && <p className="text-xs text-destructive">{errors.venue.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Description</label>
                    <Textarea 
                      {...register("description")}
                      placeholder="Tell us more about your event..." 
                      className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Event Banner Image (Optional)</label>
                    {imageValue ? (
                      <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-video group">
                        <img 
                          src={imageValue} 
                          alt="Event preview" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={handleRemoveImage}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer text-center relative flex flex-col items-center justify-center min-h-[150px] bg-white/5">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Click or drag an image here to upload</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG, or WEBP up to 5MB</span>
                      </div>
                    )}
                    {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
                  </div>

                  <Button className="w-full h-12 text-base font-bold" disabled={isLoading}>
                    {isLoading ? "Publishing..." : "Publish Event"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
