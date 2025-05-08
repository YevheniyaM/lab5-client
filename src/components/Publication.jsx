import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faClose } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import CommentsList from "./CommentsList";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import BASE_URL from "../db/baseUrl";

const Publication = ({ publication }) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Отримати кількість лайків
        const response = await fetch(
          `${BASE_URL}/publications/${publication.id}/likes/count`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch likes count");
        }
        const { count } = await response.json();
        setLikesCount(count);

        // Перевірити, чи користувач лайкнув публікацію
        if (user) {
          const userLikedResponse = await fetch(
            `${BASE_URL}/publications/${publication.id}/likes/${user.uid}`
          );
          if (!userLikedResponse.ok) {
            throw new Error("Failed to check if user liked the publication");
          }
          const { hasLiked } = await userLikedResponse.json();
          setLiked(hasLiked);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [publication.id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a publication.", {
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
      if (liked) {
        // Видалити лайк
        const response = await fetch(
          `${BASE_URL}/publications/${publication.id}/likes/${user.uid}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Failed to remove like");
        }
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      } else {
        // Додати лайк
        const response = await fetch(
          `${BASE_URL}/publications/${publication.id}/likes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.uid }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to add like");
        }
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <>
      <li className="w-full sm:w-[280px] h-[380px]">
        <div
          className={`h-full w-full cursor-pointer bg-cover bg-center relative group ${
            liked ? "border-4 border-yellow-300" : ""
          } transform transition-transform duration-300 hover:scale-105`}
          style={{ backgroundImage: `url(${publication?.image})` }}
          onClick={openModal}
        >
          <button
            className={`${
              liked
                ? "text-red-500 hover:text-red-700"
                : "text-white hover:text-gray-400"
            } text-xl sm:text-2xl transition-colors duration-300 ease-in-out absolute z-20 top-2 right-4`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <div className="absolute bottom-0 w-full h-24 bg-black bg-opacity-70 p-3 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-jomhuria">
              {publication.title}
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl leading-[1] -mt-2 text-left font-jomhuria line-clamp-2">
              {publication.description}
            </p>
          </div>
        </div>

        <p className="font-jomhuria text-sm sm:text-lg lg:text-3xl mt-2">
          {new Date(publication.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </li>

      {isModalOpen && (
        <div
          id="modal-overlay"
          className={`fixed inset-0 bg-black.50 flex justify-center items-center z-50 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`${
              liked ? "bg-[#0f0a11]" : "bg-black"
            } bg-opacity-90 p-6 rounded-lg max-h-[90vh] overflow-y-auto modal-content h-[90vh] w-9/10 max-w-[1200px] relative transform transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-90"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="h-9/10">
              <h2 className="text-7xl text-center px-6 font-jomhuria mb-4">
                {publication.title}
              </h2>
              <div className="flex flex-col lg:flex-row justify-between gap-2">
                <div className="w-full lg:w-1/3 flex flex-col items-center justify-center lg:items-start">
                  <figure>
                    <img
                      src={publication.image}
                      className="h-96 w-72 items-start"
                      alt=""
                      loading="lazy"
                    />
                  </figure>
                  <div className="mt-2 flex gap-4 items-center">
                    <span className="text-3xl font-jomhuria">User:</span>
                    <span className="text-4xl font-jomhuria">
                      {publication.userEmail}
                    </span>
                  </div>

                  <button
                    onClick={handleLike}
                    className={`${
                      liked
                        ? "text-red-500 hover:text-red-700"
                        : "text-white hover:text-gray-400"
                    } text-2xl transition-colors duration-300 ease-in-out mt-4 ml-2`}
                  >
                    <FontAwesomeIcon icon={faHeart} /> {likesCount}
                  </button>
                </div>
                <p className="text-3xl mb-4 font-jomhuria w-full lg:w-2/3 leading-[1]">
                  {publication.description}
                </p>
              </div>
              <CommentsList publicationId={publication.id} />

              <button
                className="px-2.5 absolute top-2 right-2 py-1 rounded-full bg-white bg-opacity-40 hover:bg-opacity-80 hover:text-black transition"
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Publication;
