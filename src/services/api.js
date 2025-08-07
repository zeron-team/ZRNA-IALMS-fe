// frontend/src/services/api.js

const API_URL = "http://localhost:8000";

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
    throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
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
  getDetailedEnrollments: () => request('/admin/enrollments'),

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

};