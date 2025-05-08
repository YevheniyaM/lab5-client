import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Publications from "./pages/Publications.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Likes from "./pages/Likes.jsx";

function App() {
  return (
    <Router>
      <div className="relative bg-cover bg-center bg-no-repeat bg-custom-bg min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-grow px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/likes" element={<Likes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
