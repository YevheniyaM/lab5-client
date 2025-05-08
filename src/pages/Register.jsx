import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Ініціалізуємо useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
      return;
    }

    try {
      await register(email, password);
      navigate("/profile"); // Перенаправляємо на сторінку профілю
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <div className="min-h-[64vh] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center bg-black/50 w-full md:w-1/2 py-4">
          <h1 className="text-6xl mb-6 font-jomhuria">Register</h1>
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 w-full text-3xl rounded font-jomhuria bg-black focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-[#566978] text-4xl font-jomhuria transition-colors duration-300 ease-in-out hover:bg-[#40515e] w-1/2 rounded"
            >
              Register
            </button>
          </form>
          <p className="mt-4 font-jomhuria text-2xl">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
