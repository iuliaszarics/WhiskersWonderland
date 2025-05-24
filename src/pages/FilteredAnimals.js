import React from "react";
import { useParams } from "react-router-dom";
import AnimalCard from "../components/AnimalCard.js";

function FilteredAnimals({ animals, searchTerm }) {
  const { type } = useParams();

  if (!animals || animals.length === 0) {
    return <p className="text-center text-gray-500">No animals available.</p>;
  }

  const filteredAnimals = animals.filter((animal) => {
    if (type === "other") {
      return !["dog", "cat"].includes(animal.species.toLowerCase());
    }
    return animal.species.toLowerCase() === type.toLowerCase();
  });

  const searchedAnimals = filteredAnimals.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {searchedAnimals.length > 0 ? (
        searchedAnimals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))
      ) : (
        <p className="text-center text-gray-500">No animals found.</p>
      )}
    </div>
  );
}

export default FilteredAnimals;