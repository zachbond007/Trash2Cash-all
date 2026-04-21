import { login } from "./api/auth";
const authProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await login({ email: username, password });
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("auth", JSON.stringify(response));
        localStorage.setItem("permissions", response.data.role);
        localStorage.setItem("username", response.data.username);
        return { redirectTo: "/" };
      } else {
        throw new Error(response);
      }
    } catch (err) {
      throw new Error("Network error");
    }
  },
  logout: () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("permissions");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  getIdentity: () =>
    Promise.resolve({
      id: "user",
      fullName: localStorage.getItem("username") ?? "=",
    }),
  getPermissions: () => {
    const role = localStorage.getItem("permissions");
    return role ? Promise.resolve(role) : Promise.reject();
  },
};

export default authProvider;
