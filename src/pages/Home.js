import React from "react";
import AnimalCard from "../components/AnimalCard.js";

const Home = ({ animals, searchTerm }) => {
  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {filteredAnimals.length > 0 ? (
        filteredAnimals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))
      ) : (
        <p className="text-center text-gray-500">No animals found.</p>
      )}
    </div>
  );
};

export default Home;