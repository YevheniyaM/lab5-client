import { createContext, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BASE_URL from "../db/baseUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Отримуємо токен із localStorage
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem("token"); // Видаляємо токен, якщо він недійсний
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Зберігаємо токен у localStorage
      setUser(data.user);
      toast.success("Registered successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Зберігаємо токен у localStorage
      setUser(data.user);
      toast.success("Logged in successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      localStorage.removeItem("token"); // Видаляємо токен із localStorage
      setUser(null);
      toast.success("Logged out successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
      <ToastContainer
        position="top-center"
        fontFamily="jomhuria, sans-serif"
        fontSize="2rem"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
        icon={false}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
