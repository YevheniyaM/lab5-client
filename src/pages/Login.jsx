import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Ініціалізуємо useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/profile"); // Перенаправляємо на сторінку профілю
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="min-h-[64vh] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center bg-black/50 w-full md:w-1/2 py-4">
          <h1 className="text-6xl mb-6 font-jomhuria">Login</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-2/3"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full text-3xl rounded font-jomhuria bg-black focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full text-3xl rounded font-jomhuria bg-black focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-[#566978] font-jomhuria text-4xl transition-colors duration-300 ease-in-out hover:bg-[#40515e] w-1/2 rounded"
            >
              Login
            </button>
          </form>
          <p className="mt-4 font-jomhuria text-2xl">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
