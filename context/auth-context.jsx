"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authAPI } from "@/services/api"

// Create auth context
const AuthContext = createContext()

/**
 * Auth Provider component that wraps the application
 * Provides authentication state and methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }

    // Fetch current user data
    const fetchUser = async () => {
      try {
        const response = await authAPI.getProfile()
        const userData = response.data.data.user

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } catch (err) {
        console.error("Error fetching user:", err)
        // Clear localStorage if token is invalid
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      } finally {
        setLoading(false)
      }
    }

    if (storedToken) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.register(userData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Log in a user
   * @param {Object} credentials - User login credentials
   */
  const login = async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Log out the current user
   */
  const logout = async () => {
    setLoading(true)

    try {
      await authAPI.logout()
    } catch (err) {
      console.error("Error during logout:", err)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      setLoading(false)
    }
  }

  /**
   * Update the current user's password
   * @param {Object} passwordData - Password update data
   */
  const updatePassword = async (passwordData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.updatePassword(passwordData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Send a password reset email
   * @param {string} email - User's email address
   */
  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)

    try {
      await authAPI.forgotPassword(email)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email")
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reset a user's password with a token
   * @param {string} token - Password reset token
   * @param {string} password - New password
   */
  const resetPassword = async (token, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.resetPassword(token, password)
      const { token: authToken, user } = response.data

      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Context value
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    role: user?.role,
    isTeam: user?.role === "team",
    isEvaluator: user?.role === "evaluator",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
