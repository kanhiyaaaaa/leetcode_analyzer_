"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  User,
  Trophy,
  Code,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Zap,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart2,
  Github,
} from "lucide-react"

interface AnalysisResponse {
  success: boolean
  username: string
  analysis: string
  mentoring: string
}

export default function LeetCodeAnalyzer() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState("")

  const analyzeProfile = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`https://nextstepsdsa.onrender.com/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to analyze profile")
      }

      const data: AnalysisResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    analyzeProfile()
  }

  const formatAnalysisText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.includes("===") || line.includes("ANALYSIS")) {
        return (
          <h2
            key={index}
            style={{ color: "#4f46e5", fontWeight: 700, marginTop: "1.5rem", marginBottom: "1rem", fontSize: "1.5rem" }}
          >
            {line.replace(/=/g, "")}
          </h2>
        )
      } else if (
        line.includes("👤") ||
        line.includes("🏆") ||
        line.includes("📈") ||
        line.includes("💻") ||
        line.includes("📊") ||
        line.includes("🐢") ||
        line.includes("🧠") ||
        line.includes("📆") ||
        line.includes("✅")
      ) {
        return (
          <h3
            key={index}
            style={{
              color: "#334155",
              fontWeight: 600,
              marginTop: "1.25rem",
              marginBottom: "0.75rem",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {line.includes("👤") && <User style={{ height: "1.25rem", width: "1.25rem", color: "#4f46e5" }} />}
            {line.includes("🏆") && <Trophy style={{ height: "1.25rem", width: "1.25rem", color: "#f59e0b" }} />}
            {line.includes("📈") && <TrendingUp style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />}
            {line.includes("💻") && <Code style={{ height: "1.25rem", width: "1.25rem", color: "#3b82f6" }} />}
            {line.includes("📊") && <BarChart2 style={{ height: "1.25rem", width: "1.25rem", color: "#8b5cf6" }} />}
            {line.includes("🧠") && <Brain style={{ height: "1.25rem", width: "1.25rem", color: "#f43f5e" }} />}
            {line.includes("✅") && <CheckCircle style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />}
            {line}
          </h3>
        )
      } else if (line.startsWith("-")) {
        return (
          <p
            key={index}
            style={{
              color: "#475569",
              marginLeft: "1.5rem",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#4f46e5", marginRight: "0.5rem", marginTop: "0.25rem" }}>•</span>
            <span>{line.substring(1).trim()}</span>
          </p>
        )
      } else if (line.trim()) {
        return (
          <p key={index} style={{ color: "#475569", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            {line}
          </p>
        )
      }
      return <br key={index} />
    })
  }

  const formatMentoringText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.includes("🎯") && line.includes("MENTORING")) {
        return (
          <h2
            key={index}
            style={{ color: "#10b981", fontWeight: 700, marginTop: "1.5rem", marginBottom: "1rem", fontSize: "1.5rem" }}
          >
            {line}
          </h2>
        )
      } else if (
        line.includes("📊") ||
        line.includes("🎯") ||
        line.includes("📚") ||
        line.includes("🏆") ||
        line.includes("💼")
      ) {
        return (
          <h3
            key={index}
            style={{
              color: "#334155",
              fontWeight: 600,
              marginTop: "1.25rem",
              marginBottom: "0.75rem",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {line.includes("📊") && <BarChart2 style={{ height: "1.25rem", width: "1.25rem", color: "#8b5cf6" }} />}
            {line.includes("🎯") && <Target style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />}
            {line.includes("📚") && <BookOpen style={{ height: "1.25rem", width: "1.25rem", color: "#3b82f6" }} />}
            {line.includes("🏆") && <Trophy style={{ height: "1.25rem", width: "1.25rem", color: "#f59e0b" }} />}
            {line.includes("💼") && <Zap style={{ height: "1.25rem", width: "1.25rem", color: "#f43f5e" }} />}
            {line}
          </h3>
        )
      } else if (line.startsWith("✅") || line.startsWith("-") || line.includes("WEEK")) {
        return (
          <p
            key={index}
            style={{
              color: "#475569",
              marginLeft: "1.5rem",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {line.startsWith("✅") ? (
              <CheckCircle
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "#10b981",
                  marginRight: "0.5rem",
                  marginTop: "0.25rem",
                  flexShrink: 0,
                }}
              />
            ) : (
              <span style={{ color: "#10b981", marginRight: "0.5rem", marginTop: "0.25rem" }}>•</span>
            )}
            <span>
              {line.startsWith("✅")
                ? line.substring(1).trim()
                : line.startsWith("-")
                  ? line.substring(1).trim()
                  : line}
            </span>
          </p>
        )
      } else if (line.trim()) {
        return (
          <p key={index} style={{ color: "#475569", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            {line}
          </p>
        )
      }
      return <br key={index} />
    })
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f5f3ff 100%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Code style={{ height: "1.75rem", width: "1.75rem", color: "white" }} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  LeetCode Profile Analyzer
                </h1>
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Get personalized DSA mentoring based on your profile
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "#6b7280",
                  textDecoration: "none",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <Github style={{ height: "1rem", width: "1rem" }} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: "4rem 1rem" }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  background: "linear-gradient(to right, #4f46e5, #8b5cf6, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Elevate Your LeetCode Journey
              </h1>
              <p
                style={{
                  fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
                  color: "#374151",
                  maxWidth: "48rem",
                  margin: "0 auto",
                }}
              >
                Get AI-powered insights and personalized mentoring based on your LeetCode profile
              </p>
            </div>

            {/* Search Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "2rem",
                marginBottom: "4rem",
                maxWidth: "64rem",
                margin: "0 auto 4rem auto",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "0.75rem",
                  }}
                >
                  Analyze Your Profile
                </h2>
                <p style={{ color: "#6b7280" }}>
                  Enter your LeetCode username to get detailed analysis and mentoring suggestions
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ maxWidth: "28rem", margin: "0 auto" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <User
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: "1.25rem",
                        width: "1.25rem",
                        color: "#9ca3af",
                      }}
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter LeetCode username"
                      style={{
                        width: "100%",
                        paddingLeft: "2.5rem",
                        paddingRight: "1rem",
                        paddingTop: "0.75rem",
                        paddingBottom: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      disabled={loading}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5"
                        e.target.style.boxShadow = "0 0 0 2px rgba(79, 70, 229, 0.2)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d1d5db"
                        e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !username.trim()}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background:
                        loading || !username.trim() ? "#9ca3af" : "linear-gradient(to right, #4f46e5, #8b5cf6)",
                      color: "white",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: loading || !username.trim() ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && username.trim()) {
                        e.currentTarget.style.transform = "translateY(-1px)"
                        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            animation: "spin 1s linear infinite",
                            borderRadius: "50%",
                            height: "1.25rem",
                            width: "1.25rem",
                            border: "2px solid transparent",
                            borderTop: "2px solid white",
                          }}
                        ></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search style={{ height: "1.25rem", width: "1.25rem" }} />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#dc2626" }} />
                  <span style={{ color: "#b91c1c" }}>{error}</span>
                </div>
              )}
            </div>

            {/* Loading Section */}
            {loading && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  padding: "2rem",
                  marginBottom: "4rem",
                  maxWidth: "64rem",
                  margin: "0 auto 4rem auto",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ position: "relative", margin: "0 auto 1.5rem auto", width: "4rem", height: "4rem" }}>
                    <div
                      style={{
                        animation: "spin 1s linear infinite",
                        borderRadius: "50%",
                        height: "4rem",
                        width: "4rem",
                        border: "2px solid transparent",
                        borderTop: "2px solid #4f46e5",
                        position: "absolute",
                      }}
                    ></div>
                    <div
                      style={{
                        animation: "spin 1.5s linear infinite",
                        borderRadius: "50%",
                        height: "4rem",
                        width: "4rem",
                        border: "2px solid transparent",
                        borderRight: "2px solid #8b5cf6",
                        position: "absolute",
                      }}
                    ></div>
                    <Code
                      style={{
                        height: "2rem",
                        width: "2rem",
                        color: "#4f46e5",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>Analyzing Your Profile</h3>
                  <p style={{ color: "#6b7280" }}>This may take a few moments...</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { icon: Code, text: "Scraping LeetCode profile...", color: "#4f46e5" },
                    { icon: Brain, text: "Analyzing problem-solving patterns...", color: "#8b5cf6" },
                    { icon: Target, text: "Identifying strengths and weaknesses...", color: "#3b82f6" },
                    { icon: TrendingUp, text: "Generating personalized recommendations...", color: "#10b981" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <item.icon style={{ height: "1.25rem", width: "1.25rem", color: item.color }} />
                      <span style={{ color: "#374151" }}>{item.text}</span>
                      <div style={{ flex: 1 }}></div>
                      <div
                        style={{
                          animation: "pulse 2s infinite",
                          height: "0.5rem",
                          width: "0.5rem",
                          backgroundColor: item.color,
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock style={{ height: "1rem", width: "1rem" }} />
                  <span>Make sure your LeetCode profile is public for best results</span>
                </div>
              </div>
            )}

            {/* Features Section - Show when no results */}
            {!result && !loading && (
              <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "4rem 1rem" }}>
                <h3
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "3rem",
                    background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  What You'll Get
                </h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}
                >
                  {[
                    {
                      icon: Trophy,
                      title: "Contest Analysis",
                      description: "Detailed breakdown of your contest performance and ratings",
                      color: "#4f46e5",
                      bgColor: "#eef2ff",
                    },
                    {
                      icon: Target,
                      title: "Skill Assessment",
                      description: "Identify your strengths and areas for improvement",
                      color: "#10b981",
                      bgColor: "#ecfdf5",
                    },
                    {
                      icon: BookOpen,
                      title: "Study Plan",
                      description: "Personalized roadmap with specific topics to focus on",
                      color: "#3b82f6",
                      bgColor: "#eff6ff",
                    },
                    {
                      icon: TrendingUp,
                      title: "Progress Tracking",
                      description: "Analysis of your solving patterns and activity streaks",
                      color: "#f59e0b",
                      bgColor: "#fffbeb",
                    },
                    {
                      icon: Award,
                      title: "Achievement Review",
                      description: "Celebrate your badges and milestones",
                      color: "#f43f5e",
                      bgColor: "#fdf2f8",
                    },
                    {
                      icon: Zap,
                      title: "AI Mentoring",
                      description: "Get AI-powered advice tailored to your profile",
                      color: "#8b5cf6",
                      bgColor: "#faf5ff",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)"
                        e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: feature.bgColor,
                          borderRadius: "50%",
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1.5rem auto",
                        }}
                      >
                        <feature.icon style={{ height: "2rem", width: "2rem", color: feature.color }} />
                      </div>
                      <h4
                        style={{
                          fontWeight: 700,
                          fontSize: "1.25rem",
                          textAlign: "center",
                          marginBottom: "0.75rem",
                          color: "#111827",
                        }}
                      >
                        {feature.title}
                      </h4>
                      <p style={{ color: "#6b7280", textAlign: "center" }}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "3rem", maxWidth: "80rem", margin: "0 auto" }}
              >
                {/* Profile Analysis */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ background: "linear-gradient(to right, #4f46e5, #8b5cf6)", padding: "2rem" }}>
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <User style={{ height: "1.75rem", width: "1.75rem", marginRight: "0.75rem" }} />
                      Profile Analysis for @{result.username}
                    </h3>
                  </div>
                  <div style={{ padding: "2rem" }}>
                    <div className="prose" style={{ maxWidth: "none" }}>
                      {formatAnalysisText(result.analysis)}
                    </div>
                  </div>
                </div>

                {/* Mentoring Suggestions */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ background: "linear-gradient(to right, #10b981, #14b8a6)", padding: "2rem" }}>
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <BookOpen style={{ height: "1.75rem", width: "1.75rem", marginRight: "0.75rem" }} />
                      AI-Powered Mentoring Suggestions
                    </h3>
                  </div>
                  <div style={{ padding: "2rem" }}>
                    <div className="prose" style={{ maxWidth: "none" }}>
                      {formatMentoringText(result.mentoring)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <button
                    onClick={() => {
                      setResult(null)
                      setUsername("")
                    }}
                    style={{
                      padding: "1rem 2rem",
                      background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                      color: "white",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)"
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    Analyze Another Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "linear-gradient(to right, #374151, #1f2937)",
          color: "white",
          padding: "3rem 0",
          marginTop: "4rem",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ backgroundColor: "white", padding: "0.5rem", borderRadius: "0.5rem" }}>
                  <Code style={{ height: "1.5rem", width: "1.5rem", color: "#4f46e5" }} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>LeetCode Analyzer</h3>
              </div>
              <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
                Get personalized DSA mentoring based on your LeetCode journey
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                  <Github style={{ height: "1.25rem", width: "1.25rem" }} />
                </a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Quick Links</h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Resources</h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <a
                    href="https://leetcode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#9ca3af", textDecoration: "none" }}
                  >
                    LeetCode
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    DSA Learning Path
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Interview Preparation
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid #4b5563",
              marginTop: "2rem",
              paddingTop: "2rem",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            <p>© {new Date().getFullYear()} LeetCode Profile Analyzer. All rights reserved.</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>Built with Next.js and FastAPI</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
