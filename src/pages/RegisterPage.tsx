import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronLeft, Github, UserPlus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast.success("Account created!", {
        description: "You can now sign in with your credentials.",
      })
      navigate("/login")
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-gradient">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="glass shadow-2xl border-white/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join Eventim today and start planning your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input 
                    {...register("firstName")}
                    placeholder="First Name" 
                    className={`bg-white/50 border-white/20 focus:bg-white transition-all ${errors.firstName ? "border-destructive" : ""}`}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Input 
                    {...register("lastName")}
                    placeholder="Last Name" 
                    className={`bg-white/50 border-white/20 focus:bg-white transition-all ${errors.lastName ? "border-destructive" : ""}`}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Input 
                  {...register("email")}
                  type="email" 
                  placeholder="name@example.com" 
                  className={`bg-white/50 border-white/20 focus:bg-white transition-all ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Input 
                  {...register("password")}
                  type="password" 
                  placeholder="Create a password" 
                  className={`bg-white/50 border-white/20 focus:bg-white transition-all ${errors.password ? "border-destructive" : ""}`}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button className="w-full h-11 font-semibold" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Get Started"}
              </Button>
            </form>


          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in instead
              </Link>
            </div>
            <p className="text-[10px] text-center text-muted-foreground px-8 leading-relaxed">
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
