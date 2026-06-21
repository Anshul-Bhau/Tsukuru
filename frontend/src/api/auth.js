import apiClient from "./client";

/**
 * POST /api/auth/login/
 * body: { email, password }
 * returns: { token, user_id, username, role, message }
 */
export function login(email, password) {
  return apiClient
    .post("/auth/login/", { email, password })
    .then((res) => res.data);
}

/**
 * POST /api/auth/signup/
 * body: { name, email, password }
 * returns: { token, user_id, username, role, message }
 */
export function signup(name, email, password) {
  return apiClient
    .post("/auth/signup/", { name, email, password })
    .then((res) => res.data);
}

/**
 * POST /api/auth/logout/
 */
export function logout() {
  return apiClient.post("/auth/logout/").then((res) => res.data);
}

/**
 * GET /api/auth/me/
 */
export function getCurrentUser() {
  return apiClient.get("/auth/me/").then((res) => res.data);
}
