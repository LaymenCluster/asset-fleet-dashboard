export function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

export type UserRole = "admin" | "viewer";

export function getUserRole(): UserRole | null {
  return localStorage.getItem("role") as UserRole | null;
}

export function isAdmin() {
  return getUserRole() === "admin";
}

export function setUserRole(role: string) {
  localStorage.setItem("role", role);
}
