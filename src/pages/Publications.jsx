import { useState, useEffect } from "react";
import Publication from "../components/Publication.jsx";
import SearchInput from "../components/SearchInput.jsx";
import BASE_URL from "../db/baseUrl";

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`${BASE_URL}/publications`);
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
    <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-5xl sm:text-6xl lg:text-8xl mt-8 font-jomhuria">
        Articles
      </h1>
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p className="text-4xl sm:text-5xl lg:text-6xl font-jomhuria mt-10 text-center w-full py-20 bg-black/50">
          Loading...
        </p>
      ) : filteredPublications.length > 0 ? (
        <ul className="flex flex-wrap w-full justify-center items-center px-4 gap-4 sm:gap-6 lg:gap-8 py-16 mt-8 bg-black bg-opacity-50">
          {filteredPublications.map((publication) => (
            <Publication key={publication.id} publication={publication} />
          ))}
        </ul>
      ) : (
        <p className="text-4xl sm:text-5xl lg:text-6xl font-jomhuria mt-10 text-center w-full py-20 bg-black/50">
          No publications found
        </p>
      )}
    </main>
  );
};

export default Publications;
