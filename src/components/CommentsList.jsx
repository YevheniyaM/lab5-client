import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import BASE_URL from "../db/baseUrl";

const CommentsList = ({ publicationId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/publications/${publicationId}/comments`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comment");
        }
        
        const fetchedComments = await response.json();

        const sortedComments = fetchedComments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [publicationId]);

  const addCommentToState = (newComment) => {
    setComments((prevComments) => {
      const updatedComments = [...prevComments, newComment];
      // Сортуємо коментарі після додавання нового
      return updatedComments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <CommentForm
          publicationId={publicationId}
          onCommentAdded={addCommentToState}
        />
      </div>

      <div className="bg-black p-4 rounded-lg w-full mt-8">
        <h2 className="text-5xl font-jomhuria text-center mb-4">Comments</h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading comments...</p>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="bg-gray-600 p-4 rounded-lg shadow-sm"
              >
                <p className="font-jomhuria text-3xl">{comment.userEmail}</p>
                <p className="mt-2 font-jomhuria text-4xl">{comment.text}</p>
                <p className="mt-2 font-jomhuria text-right text-2xl">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center font-jomhuria text-2xl">
            No comments yet.
          </p>
        )}
      </div>
    </>
  );
};

export default CommentsList;
