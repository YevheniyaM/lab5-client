import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faClose } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import BASE_URL from "../db/baseUrl";

import { uploadImageToCloudinary } from "../db/cloudinary.js";

const MyPublication = ({ publication, onDelete, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState(publication.image);
  const [title, setTitle] = useState(publication.title);
  const [description, setDescription] = useState(publication.description);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (publication.image) {
      fetch(publication.image)
        .then((res) => res.blob())
        .then((blob) => {
          const fileFromBlob = new File([blob], "existing-image.jpg", {
            type: blob.type,
          });
          setFile(fileFromBlob);
        })
        .catch((error) => {
          console.error("Error initializing file from image:", error);
        });
    }
  }, [publication.image]);

  const handleUpdate = async (e) => {
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
      let imageUrl = image;

      // Якщо вибрано новий файл, завантажуємо його
      if (file) {
        imageUrl = await uploadImageToCloudinary(file);
      }

      const updatedPublication = {
        title,
        description,
        image: imageUrl,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/publications/${publication.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPublication),
      });
      if (!response.ok) {
        throw new Error("Failed to update publication");
      }
      onUpdate(publication.id, updatedPublication);

      toast.success("Publication updated successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });

      closeModal();
    } catch (error) {
      console.error("Error updating publication:", error);
      toast.error("Failed to update publication. Please try again.", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/publications/${publication.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete publication");
      }
      onDelete(publication.id);
      toast.success("Publication deleted successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast.error("Failed to delete publication. Please try again.", {
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
    setIsEditModalOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsEditModalOpen(false), 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file); // Зберігаємо файл для завантаження
    }
  };

  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditModalOpen]);

  return (
    <>
      <li
        className="w-[280px] h-[380px] bg-cover bg-center relative group transform transition-transform duration-300 hover:scale-105"
        style={{ backgroundImage: `url(${publication?.image})` }}
      >
        <div className="absolute bottom-0 w-full h-16 bg-black bg-opacity-70 p-3 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex justify-between px-8">
          <button
            className="text-3xl font-jomhuria hover:text-white/50 transition-colors duration-300 ease-in-out"
            onClick={openModal}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-3xl font-jomhuria hover:text-white/50 transition-colors duration-300 ease-in-out"
          >
            Delete
          </button>
        </div>
      </li>

      {isEditModalOpen && (
        <div
          id="modal-overlay"
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out flex justify-center items-center z-50 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`bg-black bg-opacity-90 max-h-[90vh] overflow-y-auto ease-in-out modal-content p-6 rounded-lg w-9/10 sm:w-full max-w-[800px] transform transition-transform duration-300 relative ${
              isVisible ? "scale-100" : "scale-90"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-5xl text-center font-jomhuria mb-4">
              Edit Publication
            </h2>
            <form
              className="flex flex-col gap-4 items-center"
              onSubmit={handleUpdate}
            >
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-[#29343C] text-2xl resize-none rounded-lg focus:outline-none"
                  placeholder="Enter post content"
                  rows="8"
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
                    className="w-full p-2 bg-[#29343C] text-3xl duration-300 ease-in-out rounded-lg text-white hover:bg-[#4c5b65] transition"
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
    </>
  );
};

export default MyPublication;
