import React from 'react';
import { Link } from "react-router-dom";

function AnimalCard({ animal, category }) {
  let bgColor = "bg-black-200"; 

  return (
    <div className={`flex border p-4 rounded-lg shadow-lg ${bgColor}`}>
      <img src={animal.photo} alt={animal.name} className="w-32 h-32 rounded mr-4" />
      <div>
        <h2 className="text-xl font-bold">{animal.name}</h2>
        <p>{animal.age} years old</p>
        <p>{animal.species} - {animal.breed}</p>
        <p>Color: {animal.color}</p>
        <Link to={`/animal/${animal.id}`} className="text-blue-700">
          More about {animal.name} →
        </Link>
      </div>
    </div>
  );
}

export default AnimalCard;
