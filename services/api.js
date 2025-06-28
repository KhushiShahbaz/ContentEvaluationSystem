import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
  updatePassword: (passwordData) => api.put("/auth/update-password", passwordData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
}

// User API
export const userAPI = {
  getUsers: () => api.get("/users"),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

// Team API
export const teamAPI = {
  getTeams: () => api.get("/teams"),
  getTeam: (id) => api.get(`/teams/${id}`),
  createTeam: (teamData) => api.post("/teams", teamData),
  updateTeam: (id, teamData) => api.put(`/teams/${id}`, teamData),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  addTeamMember: (id, userId) => api.post(`/teams/${id}/members`, { userId }),
  removeTeamMember: (id, userId) => api.delete(`/teams/${id}/members/${userId}`),
}

// Submission API
export const submissionAPI = {
  getSubmissions: () => api.get("/submissions"),
  getSubmission: (id) => api.get(`/submissions/${id}`),
  createSubmission: (submissionData) => api.post("/submissions", submissionData),
  updateSubmission: (id, submissionData) => api.put(`/submissions/${id}`, submissionData),
  deleteSubmission: (id) => api.delete(`/submissions/${id}`),
  getTeamSubmissions: (teamId) => api.get(`/submissions/team/${teamId}`),
  assignEvaluator: (id, evaluatorId) => api.post(`/submissions/${id}/evaluators/${evaluatorId}`),
}

// Evaluation API
export const evaluationAPI = {
  getEvaluations: () => api.get("/evaluations"),
  getEvaluation: (id) => api.get(`/evaluations/${id}`),
  createEvaluation: (evaluationData) => api.post("/evaluations", evaluationData),
  updateEvaluation: (id, evaluationData) => api.put(`/evaluations/${id}`, evaluationData),
  deleteEvaluation: (id) => api.delete(`/evaluations/${id}`),
  getSubmissionEvaluations: (submissionId) => api.get(`/evaluations/submission/${submissionId}`),
  getEvaluatorAssignments: () => api.get("/evaluations/evaluator/assignments"),
  publishEvaluation: (id) => api.put(`/evaluations/${id}/publish`),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  getPendingEvaluators: () => api.get("/admin/evaluators/pending"),
  approveEvaluator: (id) => api.put(`/admin/evaluators/${id}/approve`),
  rejectEvaluator: (id) => api.put(`/admin/evaluators/${id}/reject`),
  getLeaderboard: () => api.get("/admin/leaderboard"),
  publishLeaderboard: () => api.put("/admin/leaderboard/publish"),
  getEvaluationProgress: () => api.get("/admin/evaluation-progress"),
}

export const evaluatorAPI={
inviteEvaluator:()=> api.post("/evaluators/"),
getAllEvaluators: ()=> api.get("/evaluators/"),
getEvaluatorById: ()=>api.get("/evaluators/:id"),
getActiveEvaluators: ()=>api.get("/evaluators/active/"),
}

export default api
