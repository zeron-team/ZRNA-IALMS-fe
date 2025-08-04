// frontend/src/services/api.js

const API_URL = "http://localhost:8000";

/**
 * Función helper para realizar todas las peticiones a la API,
 * añadiendo automáticamente el token de autenticación si existe.
 */
const request = async (endpoint, options = {}) => {
  if (endpoint.includes("undefined")) {
    console.error("Llamada a la API cancelada por ID indefinido:", endpoint);
    // Devuelve una promesa que nunca se resuelve o lanza un error controlado
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

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      // Descomentar para forzar redirección al login si un token expira
      // window.location.href = '/login';
    }
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

  // --- Autenticación y Perfil ---
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
  getCurrentUser: () => request('/users/me'),

  verifyEmail: (token) => request(`/auth/verify-email?token=${token}`),

  // --- Vistas Públicas y Generales ---
  getCourses: () => request('/courses/'),
  getCourseDetail: (courseId) => request(`/courses/${courseId}`),
  getCourseSummary: (courseId) => request(`/courses/${courseId}/summary`),
  getLearningPaths: () => request('/learning-paths/'),
  getLearningPathDetail: (pathId) => request(`/learning-paths/${pathId}`),

  // --- Acciones de Estudiante ---
  enrollInCourse: (courseId) => request(`/courses/${courseId}/enroll`, { method: 'POST' }),
  getMyEnrolledCourses: () => request('/my-courses'),
  // --- Acciones de Instructor y Admin ---
  getMyTaughtCourses: () => request('/users/me/courses'), // Para la página "Administrar Cursos"
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

  // --- Dashboard de Estudiante ---
  getStudentDashboard: () => request('/dashboard/student'),
  getQuizStatus: (moduleId) => request(`/quizzes/module/${moduleId}/status`),
  getCategoriesWithCourses: () => request('/categories/with-courses'),
  getCategories: () => request('/categories/'),
  getModuleDetail: (moduleId) => request(`/modules/${moduleId}`),
  completeModule: (moduleId) => request(`/modules/${moduleId}/complete`, { method: 'POST' }),
  getQuizForModule: (moduleId) => request(`/quizzes/module/${moduleId}`),
  submitQuiz: (moduleId, answers) => request(`/quizzes/module/${moduleId}/submit`, {
    method: 'POST',
    body: JSON.stringify(answers),
  }),

};