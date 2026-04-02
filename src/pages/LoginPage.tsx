import { useNavigate } from "react-router-dom"
import { useState } from "react"

type LoginPageProps = {
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginPage({ isAdmin, setIsAdmin }: LoginPageProps) {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"user" | "admin">("user")
  const [email, setEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const login = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "admin") {
      if (password === "admin123") {
        const user = { role: "admin" }
        localStorage.setItem("event-platform-user", JSON.stringify(user))
        setIsAdmin(true)
        setError(null)
        navigate("/admin")
        return
      }

      setError("Wrong admin password. Try: admin123")
      return
    }

    // user login (basic validation)
    if (!email || !userPassword) {
      setError("Please enter email and password")
      return
    }

    const user = {
      role: "user",
      email,
      name: email.split("@")[0],
    }

    localStorage.setItem("event-platform-user", JSON.stringify(user))
    setIsAdmin(false)
    setError(null)
    navigate("/")
  }

  const logout = () => {
    setIsAdmin(false)
    setPassword("")
    setError(null)
    navigate("/")
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#fff",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Login</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => setMode("user")}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: mode === "user" ? "#2563eb" : "#fff",
            color: mode === "user" ? "#fff" : "#111",
            fontWeight: 700,
          }}
        >
          User
        </button>

        <button
          onClick={() => setMode("admin")}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: mode === "admin" ? "#2563eb" : "#fff",
            color: mode === "admin" ? "#fff" : "#111",
            fontWeight: 700,
          }}
        >
          Admin
        </button>
      </div>

      {isAdmin ? (
        <>
          <p>You are logged in as Admin.</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <form onSubmit={login}>
          {mode === "user" && (
            <>
              <label style={{ display: "block", marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              />

              <label style={{ display: "block", marginBottom: 8 }}>Password</label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              />
            </>
          )}

          {mode === "admin" && (
            <>
              <label style={{ display: "block", marginBottom: 8 }}>Admin password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              />
            </>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {mode === "admin" ? "Login as Admin" : "Login as User"}
          </button>

          {error && <p style={{ marginTop: 12, color: "crimson" }}>{error}</p>}
        </form>
      )}

      <p style={{ marginTop: 20, fontSize: 12, color: "#6b7280" }}>
        Demo: admin password is <strong>admin123</strong>
      </p>
    </div>
  )
}