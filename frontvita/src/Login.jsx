// ...existing code...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLogo, setShowLogo] = useState(true);

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    try {
      // Replace with real API call as needed
      await new Promise((r) => setTimeout(r, 600));
      localStorage.setItem("authToken", "demo-token");
      navigate("/home", { replace: true });
    } catch (err) {
      setError("Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter email and password.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Store token and user info
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userRole", data.user.role);

    // (Optional) You can also store everything together
    // localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Redirect after successful login
    navigate("/home", { replace: true });
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  const fillDemo = () => {
    setEmail("demo@example.com");
    setPassword("password");
  };

  const containerStyle = {
      position: "fixed",     // changed: full viewport container
    inset: 0,              // top:0, right:0, bottom:0, left:0
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "transparent", // no background color
    zIndex: 999,
  };

  const cardStyle = {
   width: "100%",
    maxWidth: 420,
    background: "transparent", // no background color
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(136, 138, 141, 0.12)",
    padding: 28,
    boxSizing: "border-box",
    textAlign: "center",
    margin: "0 auto", 
  };

  const logoStyle = {
    height: 64,
    marginBottom: 12,
    objectFit: "contain",
    color: "#e9edf9ff",
  };

  const titleStyle = {
    margin: "6px 0 18px",
    fontSize: 20,
    fontWeight: 700,
    color: "#9b9b9dff",
  };

  const hintStyle = {
    marginBottom: 16,
    fontSize: 13,
    color: "#475569",
  };

  const inputWrap = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "transparent", // no background color
    borderRadius: 10,
    padding: "8px 12px",
    marginBottom: 12,
    border: "1px solid #e6eef8",
  };

  const iconStyle = { color: "#94a3b8", fontSize: 16, minWidth: 18 };

  const inputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    background: "transparent",
    fontSize: 14,
    color: "#f1f3f8ff",
  };

  const submitStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "#87a9f2ff",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const secondaryStyle = {
    marginTop: 10,
    display: "flex",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  };

  const demoBtnStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: "transparent", // no background color
    cursor: "pointer",
    fontSize: 13,
  };

  const errorStyle = { color: "#ef4444", fontSize: 13, marginTop: 8 };

  return (
    <div style={containerStyle}>
      <form style={cardStyle} onSubmit={handleSubmit} aria-labelledby="login-title">
        {showLogo && (
          <img
            src="/logo.png"
            alt="Logo"
            style={logoStyle}
            onError={() => setShowLogo(false)}
          />
        )}
        <h1 id="login-title" style={titleStyle}>Welcome back</h1>
        <div style={hintStyle}>Sign in to access your dashboard</div>

        <label style={{ textAlign: "left", display: "block", marginBottom: 6 }}>
          Email
        </label>
        <div style={inputWrap}>
          <FaEnvelope style={iconStyle} />
          <input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="you@company.com"
            required
          />
        </div>

        <label style={{ textAlign: "left", display: "block", marginBottom: 6 }}>
          Password
        </label>
        <div style={inputWrap}>
          <FaLock style={iconStyle} />
          <input
            aria-label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" style={submitStyle} disabled={submitting}>
          <FaSignInAlt />
          {submitting ? "Signing in..." : "Sign in"}
        </button>

       

        {error && <div style={errorStyle}>{error}</div>}
      </form>
    </div>
  );
}
// ...existing code...