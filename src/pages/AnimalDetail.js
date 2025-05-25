import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/config.js";

function AnimalDetail({ animals, setAnimals }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAnimal, setUpdatedAnimal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (animals.length > 0) {
      const foundAnimal = animals.find(a => a.id === parseInt(id));
      if (foundAnimal) {
        setAnimal(foundAnimal);
        setUpdatedAnimal(foundAnimal);
      }
    }
  }, [animals, id]);

  if (!animal) {
    return <p>Loading or Animal Not Found...</p>;
  }

  const handleChange = (e) => {
    setUpdatedAnimal({ ...updatedAnimal, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setError('');
      console.log('Updating animal:', updatedAnimal);
      const response = await api.patch(`/animals/${id}`, updatedAnimal);
      console.log('Update response:', response.data);
      
      setAnimals((prev) => prev.map(a => (a.id === parseInt(id) ? response.data : a)));
      setAnimal(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating animal:", error);
      setError(error.response?.data?.error || 'Failed to update animal');
    }
  };

  const handleAdopt = async () => {
    try {
      setError('');
      console.log('Deleting animal:', id);
      await api.delete(`/animals/${id}`);
      console.log('Animal deleted successfully');
      
      setAnimals((prev) => prev.filter(a => a.id !== parseInt(id)));
      navigate("/"); 
    } catch (error) {
      console.error("Error deleting animal:", error);
      setError(error.response?.data?.error || 'Failed to delete animal');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{animal.name}</h2>
      <img src={animal.photo} alt={animal.name} className="w-64 h-64 rounded-lg mt-4" />
      <p>Age: {animal.age} years</p>
      <p>Species: {animal.species}</p>
      <p>Breed: {animal.breed}</p>
      <p>Color: {animal.color}</p>
      <p>Description: {animal.description}</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="mt-4">
          <input name="name" value={updatedAnimal.name} onChange={handleChange} className="border p-2 m-2" />
          <input name="age" value={updatedAnimal.age} onChange={handleChange} className="border p-2 m-2" />
          <input name="species" value={updatedAnimal.species} onChange={handleChange} className="border p-2 m-2" />
          <input name="breed" value={updatedAnimal.breed} onChange={handleChange} className="border p-2 m-2" />
          <input name="color" value={updatedAnimal.color} onChange={handleChange} className="border p-2 m-2" />
          <input name="description" value={updatedAnimal.description} onChange={handleChange} className="border p-2 m-2" />
          
          <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
        </div>
      ) : (
        <div className="mt-4">
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded">Update</button>
          <button onClick={handleAdopt} className="bg-red-500 text-white p-2 rounded ml-2">Adopt</button>
        </div>
      )}
    </div>
  );
}

export default AnimalDetail;