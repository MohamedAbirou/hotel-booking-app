import { LoginFormData } from "./pages/login";
import { RegisterFormData } from "./pages/register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// export const validateToken = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Token invalid");
//   }

//   return response.json();
// };

export const checkSession = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/check-session`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) throw new Error("Error during logout");
};
