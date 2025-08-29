// frontend/src/services/api.js

export const API_URL = "http://localhost:8000/api";

/**
 * Función helper para realizar todas las peticiones a la API.
 * - Añade automáticamente el token de autenticación.
 * - Maneja errores comunes y de sesión expirada (401).
 * - Previene llamadas a la API con IDs indefinidos.
 */
const request = async (endpoint, options = {}) => {
  if (String(endpoint).includes("undefined")) {
    console.error("Llamada a la API cancelada por ID indefinido:", endpoint);
    return Promise.reject(new Error("ID de recurso inválido."));
  }

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirige a la landing page
    throw new Error("AUTH_REQUIRED: Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Ocurrió un error en la petición');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};


// --- Objeto ÚNICO 'api' con TODOS los métodos ---
export const api = {

  // --- Course Suggestions ---
  getCourseSuggestions: () => request('/suggestions'),
  createCourseSuggestion: (suggestionData) => request('/suggestions', {
    method: 'POST',
    body: JSON.stringify(suggestionData),
  }),
  voteForSuggestion: (suggestionId) => request(`/suggestions/${suggestionId}/vote`, {
    method: 'POST',
  }),
  searchCourseSuggestions: (query) => request(`/suggestions/search?query=${query}`),

  // --- Autenticación y Verificación ---
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return request('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
  },
  registerUser: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  verifyEmail: (token) => request(`/auth/verify-email?token=${token}`),

  // --- Datos del Usuario Logueado ---
  getCurrentUser: () => request('/users/me'),

  // --- Vistas Generales ---
  getCourses: () => request('/courses/'),
  getCourseDetail: (courseId) => request(`/courses/${courseId}`),
  getCourseSummary: (courseId) => request(`/courses/${courseId}/summary`),
  getCategories: () => request('/categories/'),
  getCategoriesWithCourses: () => request('/categories/with-courses'),
  getLearningPaths: () => request('/learning-paths/'),
  getLearningPathDetail: (pathId) => request(`/learning-paths/${pathId}`),
  getModuleDetail: (moduleId) => request(`/modules/${moduleId}`),

  // --- Dashboard de Estudiante ---
  getStudentDashboard: () => request('/dashboard/student'),

  // --- Acciones de Estudiante ---
  enrollInCourse: (courseId) => request(`/courses/${courseId}/enroll`, { method: 'POST' }),
  getMyEnrolledCourses: () => request('/my-courses'),
  getQuizForModule: (moduleId) => request(`/quizzes/module/${moduleId}`),
  getQuizStatus: (moduleId) => request(`/quizzes/module/${moduleId}/status`),
  submitQuiz: (moduleId, answers) => request(`/quizzes/module/${moduleId}/submit`, {
    method: 'POST',
    body: JSON.stringify(answers),
  }),

  // --- Acciones de Instructor / Admin ---
  getMyTaughtCourses: () => request('/users/me/courses'),
  createCourse: (courseData) => request('/courses/', {
    method: 'POST',
    body: JSON.stringify(courseData),
  }),
  updateCourse: (courseId, courseData) => request(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  }),
  deleteCourse: (courseId) => request(`/courses/${courseId}`, {
    method: 'DELETE',
  }),
  generateCurriculum: (courseId) => request(`/courses/${courseId}/generate-curriculum`, {
    method: 'POST',
  }),
  generateModuleContent: (moduleId) => request(`/modules/${moduleId}/generate-content`, {
    method: 'POST',
  }),

  // --- Acciones Solo de Admin ---
  getUsers: () => request('/users/'),
  getRoles: () => request('/roles/'),
  updateUser: (userId, userData) => request(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  deleteUser: (userId) => request(`/users/${userId}`, {
    method: 'DELETE',
  }),
  getDashboardStats: () => request('/admin/dashboard-stats'),
  getDetailedEnrollments: () => request('/admin/enrollments-detailed'),
  createRoom: (roomData) => request('/rooms/', {
        method: 'POST',
        body: JSON.stringify(roomData)
    }),
  getMyRooms: () => request('/rooms/'),
  getRoomDetail: (roomId) => request(`/rooms/${roomId}`),
  addCourseToRoom: (roomId, courseId) => request(`/rooms/${roomId}/courses/${courseId}`, { method: 'POST' }),
  addMemberToRoom: (roomId, userId) => request(`/rooms/${roomId}/members/${userId}`, { method: 'POST' }),
  getNotifications: () => request('/notifications/'),
  markNotificationAsRead: (notificationId) => request(`/notifications/${notificationId}/read`, { method: 'POST' }),
  getInstructorDashboard: () => request('/dashboard/instructor/'),
  getInstructorStudentProgress: () => request('/dashboard/instructor/student-progress'),
  getInstructorDetailedProgress: () => request('/dashboard/instructor/student-progress-detailed'),
  getAllRoomsSummary: () => request('/admin/rooms-summary'),
  getEnrollmentsWithProgress: () => request('/admin/enrollments-detailed'),
  // Pago de Mercado Pago (actualizacion 20250810)
  createPaymentPreference: (planId) => request(`/payments/create-preference/${planId}`, { method: 'POST' }),
  // actualizacion 20250810
  removeCourseFromRoom: (roomId, courseId) => request(`/rooms/${roomId}/courses/${courseId}`, { method: 'DELETE' }),
  removeMemberFromRoom: (roomId, userId) => request(`/rooms/${roomId}/members/${userId}`, { method: 'DELETE' }),
  updateRoom: (roomId, roomData) => request(`/rooms/${roomId}`, { method: 'PUT', body: JSON.stringify(roomData)}),

  downloadModulePdf: async (moduleId) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_URL}/modules/${moduleId}/download-pdf`, { headers });

    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `module_${moduleId}.pdf`;
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch.length > 1) {
            filename = filenameMatch[1];
        }
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  generateModuleAudio: async (moduleId) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const response = await fetch(`${API_URL}/modules/${moduleId}/generate-audio`, { method: 'POST', headers });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // --- Ratings ---
  rateCourse: (courseId, isUpvote) => request(`/ratings/course/${courseId}`, {
    method: 'POST',
    body: JSON.stringify({ is_upvote: isUpvote }),
  }),
  rateModule: (moduleId, isUpvote) => request(`/ratings/module/${moduleId}`, {
    method: 'POST',
    body: JSON.stringify({ is_upvote: isUpvote }),
  }),
  getCourseRatingCounts: (courseId) => request(`/ratings/course/${courseId}/public`),
  getModuleRatingCounts: (moduleId) => request(`/ratings/module/${moduleId}`),
  getGlobalRatingCounts: () => request(`/ratings/global-counts`),
};