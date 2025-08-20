// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// // Base request function
// const request = async (path, { method = 'GET', body, token, contentType = 'application/json' } = {}) => {
//   const headers = {
//     ...(contentType ? { 'Content-Type': contentType } : {}),
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   // For FormData, let the browser set the content type and boundary
//   if (body instanceof FormData) {
//     delete headers['Content-Type'];
//   }

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers,
//     body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
//   });
  
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.message || 'Request failed');
//   return data;
// };

// // API methods object
// const api = {
//   get: (path, options) => request(path, { ...options, method: 'GET' }),
//   post: (path, options) => request(path, { ...options, method: 'POST' }),
//   put: (path, options) => request(path, { ...options, method: 'PUT' }),
//   delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
// };
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Base request function
const request = async (path, { method = 'GET', body, contentType = 'application/json' } = {}) => {
  const token = getToken();
  const headers = {
    ...(contentType ? { 'Content-Type': contentType } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // For FormData, let the browser set the content type and boundary
  if (body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  });
  
  // Handle unauthorized responses
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// API methods object
export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, options) => request(path, { ...options, method: 'POST' }),
  put: (path, options) => request(path, { ...options, method: 'PUT' }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

// Export as default export
// export { api };
export default api;