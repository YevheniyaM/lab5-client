import React, { useEffect, useState } from "react";
import Publication from "./../components/Publication.jsx";

const Likes = () => {
  const [likedPublications, setLikedPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedPublications = async () => {
      try {
        const token = localStorage.getItem("token"); // Отримуємо токен авторизації
        const response = await fetch(
          "http://localhost:3000/publications/liked",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch liked publications.");
        }

        const data = await response.json();
        setLikedPublications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPublications();
  }, []);

  if (loading)
    return (
      <div className="text-4xl sm:text-5xl lg:text-6xl font-jomhuria mt-10 text-center w-full py-20 bg-black/50">
        <p>Loading...</p>;
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="text-center">
      <h1 className="text-center text-5xl sm:text-6xl lg:text-8xl mt-8 font-jomhuria">
        Liked Publications
      </h1>
      {likedPublications.length === 0 ? (
        <p>You have not liked any publications yet.</p>
      ) : (
        <ul className="flex flex-wrap w-full justify-center items-center px-4 gap-4 sm:gap-6 lg:gap-8 py-16 mt-8 bg-black bg-opacity-50">
          {likedPublications.map((publication) => (
            <Publication key={publication.id} publication={publication} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Likes;
