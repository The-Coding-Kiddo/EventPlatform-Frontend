import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { Search, Users, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { eventService } from "@/services/eventService"

type InstitutionItem = {
  id: string
  name: string
  institutionName: string
  bio: string | null
  profilePicture: string | null
  followerCount: number
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchInstitutions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await eventService.searchInstitutions({ search: debouncedSearch || undefined })
      setInstitutions(data.items || [])
    } catch {
      setInstitutions([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchInstitutions()
  }, [fetchInstitutions])

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Institutions</h1>
          <p className="text-sm text-muted-foreground">Browse organizations hosting events on Eventim.</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search institutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : institutions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium mb-1">No institutions found</p>
            <p className="text-xs text-muted-foreground/60">
              {debouncedSearch ? "Try a different search term." : "No institutions registered yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutions.map((inst) => (
              <Link key={inst.id} to={`/institutions/${inst.id}`}>
                <Card className="border-border/40 hover:border-foreground/30 transition-colors p-5 h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                      {inst.profilePicture ? (
                        <img src={inst.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground/40">
                          {inst.institutionName?.[0]?.toUpperCase() || "I"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{inst.institutionName}</p>
                      {inst.name && (
                        <p className="text-xs text-muted-foreground truncate">{inst.name}</p>
                      )}
                    </div>
                  </div>
                  {inst.bio && (
                    <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-3">{inst.bio}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {inst.followerCount} follower{inst.followerCount !== 1 ? "s" : ""}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
