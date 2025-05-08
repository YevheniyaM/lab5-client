import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  return (
    <main className="h-[87.5vh] flex justify-center items-center relative z-10">
      <div className="font-jua text-center flex flex-col justify-center items-center text-white">
        <h1 className="text-9xl">Adventure</h1>
        <h3 className="text-4xl">Live Your Life</h3>
        {!user && (
          <Link to="/register" className="rounded-full mt-8 bg-white px-20 py-2 font-jomhuria text-4xl text-black transition-colors duration-300 ease-in-out bg-opacity-100 hover:bg-opacity-50">
            Register
          </Link>
        )}
      </div>
    </main>
  );
};

export default Home;
