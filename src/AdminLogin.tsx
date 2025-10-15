import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ needed for Flask sessions
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin"; // redirect after success
      } else {
        setError(data.message || "Invalid password");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1a0f1a] flex items-center justify-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 w-96 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#D72638] to-[#FF5C8D] bg-clip-text text-transparent">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 mb-4 text-white placeholder:text-white/40 focus:border-[#FF5C8D] focus:ring-[#FF5C8D]/40 focus:ring-2"
        />

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#D72638] to-[#FF5C8D] rounded-lg hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
