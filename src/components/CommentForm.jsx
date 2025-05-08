import { useState } from "react";
import { useAuth } from "../context/AuthProvider"; // Імпортуємо контекст автентифікації
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "../db/baseUrl";

const CommentForm = ({ publicationId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty.", {
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
      const newComment = {
        userEmail: user.email,
        text: comment,
        createdAt: new Date().toISOString(), // Локальний час для оновлення стану
      };

      const response = await fetch(
        `${BASE_URL}/publications/${publicationId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      toast.success("Comment added successfully!", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "black",
        },
      });
      setComment("");

      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.", {
        style: {
          fontFamily: "jomhuria, sans-serif",
          fontSize: "2rem",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          color: "black",
        },
      });
    }
  };

  if (!user) {
    return (
      <div className="bg-black px-4 py-20 rounded-lg flex flex-col mt-8 items-center shadow-md w-2/3">
        <h2 className="text-2xl md:text-5xl text-center mb-4 font-jomhuria">
          You must be logged in to leave a comment
        </h2>
        <Link
          to="/login"
          className="bg-[#29343C] w-full md:w-1/3 text-white px-4 py-2 rounded-lg hover:bg-[#495c69] transition-colors duration-300 ease-in-out text-3xl font-jomhuria text-center"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black p-4 rounded-lg flex flex-col mt-8 items-center shadow-md w-2/3"
    >
      <h2 className="text-5xl text-center mb-4 font-jomhuria">
        Leave a Comment
      </h2>
      <div className="mb-4 w-full">
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="p-2 w-full rounded-lg text-black bg-gray-400 resize-none focus:outline-none text-3xl font-jomhuria"
          placeholder="Your comment"
          rows="4"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-[#29343C] w-1/3 text-white px-4 py-2 rounded-lg hover:bg-[#495c69] transition-colors duration-300 ease-in-out text-3xl font-jomhuria"
      >
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
