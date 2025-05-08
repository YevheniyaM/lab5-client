import SearchInput from "../components/SearchInput.jsx";
import MyPublication from "../components/MyPublication.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadImageToCloudinary } from "../db/cloudinary.js";
import { useAuth } from "../context/AuthProvider.jsx";
import BASE_URL from "../db/baseUrl";

const Profile = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleDeletePublication = (id) => {
    setPublications((prevPublications) =>
      prevPublications.filter((publication) => publication.id !== id)
    );
  };

  const handleUpdatePublication = (id, updatedPublication) => {
    setPublications((prevPublications) =>
      prevPublications.map((publication) =>
        publication.id === id
          ? { ...publication, ...updatedPublication }
          : publication
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !file) {
      toast.error("Please fill in all fields before saving.", {
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
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadImageToCloudinary(file);
      }

      const newPublication = {
        title,
        description,
        image: imageUrl,
        createdAt: new Date().toISOString(),
        userEmail: user.email,
        userId: user.uid,
      };

      const response = await fetch(`${BASE_URL}/publications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPublication),
      });

      if (!response.ok) {
        throw new Error("Failed to add publication");
      }

      const addedPublication = await response.json();

      setPublications((prevPublications) => [
        ...prevPublications,
        { id: addedPublication.id, ...newPublication },
      ]);

      setTitle("");
      setDescription("");
      setFile(null);
      setImage(null);

      toast.success("Publication saved successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
      closeModal();
    } catch (error) {
      console.error("Error saving publication:", error);
      toast.error("Failed to save publication. Please try again.", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
    }
  };

  const openModal = () => {
    setModalOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setModalOpen(false), 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Unsupported file type. Please upload a JPEG, PNG, or WebP image.",
          {
            style: {
              fontFamily: "jomhuria, sans-serif",
              fontSize: "2rem",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              color: "black",
            },
          }
        );
        alert();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFile(file);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/publications/user?userId=${user.uid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch publications");
        }
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const filteredPublications = [...publications]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .filter((publication) =>
      publication.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <main className="flex flex-col items-center mt-5">
        <h1 className="font-jomhuria text-5xl md:text-8xl">
          user1@example.com
        </h1>

        <div className="bg-black/50 mt-10 flex flex-col items-center w-full">
          <h1 className="text-center text-7xl mt-8 font-jomhuria">
            My Publications
          </h1>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-black/50 text-4xl font-jomhuria w-1/5 hover:bg-black/80 transition-colors duration-300 ease-in-out py-2 mt-8 flex justify-center items-center"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {loading ? (
            <p className="text-6xl font-jomhuria mt-10 text-center w-full py-20">
              Loading...
            </p>
          ) : filteredPublications.length > 0 ? (
            <ul className="flex flex-wrap justify-center items-center px-4 gap-8 py-10 mt-8">
              {filteredPublications.map((publication) => (
                <MyPublication
                  key={publication.id}
                  publication={publication}
                  onDelete={handleDeletePublication}
                  onUpdate={handleUpdatePublication}
                />
              ))}
            </ul>
          ) : (
            <p className="text-6xl font-jomhuria mt-10 text-center w-full py-20">
              No publications found
            </p>
          )}
        </div>
      </main>
      {modalOpen && (
        <div
          id="modal-overlay"
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out flex justify-center items-center z-50 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`bg-black bg-opacity-90 max-h-[90vh] overflow-y-auto ease-in-out modal-content p-6 rounded-lg w-full max-w-[800px] transform transition-transform duration-300 relative ${
              isVisible ? "scale-100" : "scale-90"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-5xl text-center font-jomhuria mb-4">
              Add Publication
            </h2>
            <form className="flex flex-col gap-4 items-center">
              <div className="mb-4 font-jomhuria w-full">
                <label htmlFor="title" className="block text-4xl">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-[#29343C] text-2xl rounded-lg focus:outline-none"
                  placeholder="Enter post title"
                />
              </div>
              <div className="mb-4 font-jomhuria w-full">
                <label htmlFor="content" className="block text-4xl">
                  Content
                </label>
                <textarea
                  className="w-full p-2 bg-[#29343C] text-2xl resize-none rounded-lg focus:outline-none"
                  placeholder="Enter post content"
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4 font-jomhuria w-full">
                <label htmlFor="image" className="block text-4xl mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className="w-full p-2 bg-[#29343C] text-3xl rounded-lg text-white"
                  >
                    Choose File
                  </button>
                </div>
              </div>
              {image && (
                <div className="mb-4 relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-72 h-96 rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-black bg-white/50 px-3 py-2 rounded-lg hover:bg-white/80 transition-colors duration-300 ease-in-out flex items-center gap-2"
                    onClick={() => setImage(null)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-1/3 pt-2 pb-1 rounded-lg font-jomhuria text-4xl transition bg-white/40 hover:bg-white/80 text-black"
              >
                Save
              </button>
            </form>
            <button
              className="px-2.5 absolute top-2 right-2 py-1 rounded-full bg-white bg-opacity-40 hover:bg-opacity-80 hover:text-black transition"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        fontFamily="jomhuria, sans-serif"
        fontSize="2rem"
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
        icon={false}
      />
    </>
  );
};

export default Profile;
