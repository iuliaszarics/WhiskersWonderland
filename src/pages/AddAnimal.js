import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config.js";

function AddAnimal({ setAnimals }) {
  const navigate = useNavigate();

  const [newAnimal, setNewAnimal] = useState({
    name: "",
    age: "",
    species: "",
    breed: "",
    color: "",
    description: "",
    photo: "",
    shelterId: "", 
  });

  const [errors, setErrors] = useState({});
  const [shelters, setShelters] = useState([]); 
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await api.get("/shelters");
        setShelters(response.data);
      } catch (err) {
        console.error("Failed to fetch shelters", err);
        setApiError("Failed to load shelters. Please try again later.");
      }
    };
    fetchShelters();
  }, []);

  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
    setApiError(""); // Clear any previous errors
  };

  const validate = () => {
    let newErrors = {};
    if (!newAnimal.name.trim()) newErrors.name = "Name is required";
    if (!newAnimal.age.trim() || isNaN(newAnimal.age) || parseInt(newAnimal.age) <= 0)
      newErrors.age = "Age must be a positive number";
    if (!newAnimal.species.trim()) newErrors.species = "Species is required";
    if (!newAnimal.breed.trim()) newErrors.breed = "Breed is required";
    if (!newAnimal.color.trim()) newErrors.color = "Color is required";
    if (!newAnimal.description.trim()) newErrors.description = "Description is required";
    if (!newAnimal.photo.trim()) newErrors.photo = "Photo URL is required";
    if (!newAnimal.shelterId) newErrors.shelterId = "Shelter is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAnimal = async () => {
    if (!validate()) return;

    try {
      const response = await api.post("/animals", newAnimal);
      setAnimals((prev) => [...prev, response.data]);
      navigate("/");
    } catch (error) {
      console.error("Error adding animal:", error.response?.data || error.message);
      setApiError(error.response?.data?.message || "Failed to add animal. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl p-10">Add an Animal</h1>

      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

      <div className="w-full max-w-md space-y-4">
        <input 
          name="name" 
          placeholder="Name" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <input 
          name="age" 
          placeholder="Age" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.age && <p className="text-red-500">{errors.age}</p>}

        <input 
          name="species" 
          placeholder="Species" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.species && <p className="text-red-500">{errors.species}</p>}

        <input 
          name="breed" 
          placeholder="Breed" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.breed && <p className="text-red-500">{errors.breed}</p>}

        <input 
          name="color" 
          placeholder="Color" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.color && <p className="text-red-500">{errors.color}</p>}

        <input 
          name="description" 
          placeholder="Description" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        <input 
          name="photo" 
          placeholder="Photo URL" 
          onChange={handleChange} 
          className="border p-2 w-full rounded" 
        />
        {errors.photo && <p className="text-red-500">{errors.photo}</p>}

        <select 
          name="shelterId" 
          onChange={handleChange} 
          className="border p-2 w-full rounded"
          value={newAnimal.shelterId}
        >
          <option value="">Select Shelter</option>
          {shelters.map((shelter) => (
            <option key={shelter.id} value={shelter.id}>
              {shelter.name}
            </option>
          ))}
        </select>
        {errors.shelterId && <p className="text-red-500">{errors.shelterId}</p>}

        <button 
          onClick={addAnimal} 
          className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition-colors"
        >
          Add Animal
        </button>
      </div>
    </div>
  );
}

export default AddAnimal;