import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

function Statistics() {
  const [animals, setAnimals] = useState([]);

  const speciesList = ["Dog", "Cat", "Rabbit", "Bird", "Fish"];
  const colorsList = ["Brown", "Black", "White", "Gray", "Golden"];

  const generateRandomAnimal = () => {
    return {
      name: `Animal-${Math.floor(Math.random() * 1000)}`,
      age: Math.floor(Math.random() * 15) + 1,
      species: speciesList[Math.floor(Math.random() * speciesList.length)],
      color: colorsList[Math.floor(Math.random() * colorsList.length)]
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimals(prevAnimals => {
        const newAnimal = generateRandomAnimal();
        return [...prevAnimals, newAnimal].slice(-20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (animals.length === 0) return <p>No data available.</p>;

  const oldestAnimal = animals.reduce((max, animal) => (animal.age > max.age ? animal : max), animals[0]);
  const youngestAnimal = animals.reduce((min, animal) => (animal.age < min.age ? animal : min), animals[0]);
  const averageAge = (animals.reduce((sum, animal) => sum + animal.age, 0) / animals.length).toFixed(1);

  const speciesCount = animals.reduce((acc, animal) => {
    acc[animal.species] = (acc[animal.species] || 0) + 1;
    return acc;
  }, {});
  const speciesData = Object.keys(speciesCount).map(species => ({ name: species, value: speciesCount[species] }));

  const ageData = animals.map(animal => ({ name: animal.name, age: animal.age }));

  const colorCount = animals.reduce((acc, animal) => {
    acc[animal.color] = (acc[animal.color] || 0) + 1;
    return acc;
  }, {});
  const colorData = Object.keys(colorCount).map(color => ({ name: color, value: colorCount[color] }));
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666", "#a28fd0", "#34b7eb"];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"> Age Statistics</h1>
      <div className="bg-gray-100 p-4 rounded lg mb-6">
        <p><strong>Oldest Animal:</strong> {oldestAnimal.name} ({oldestAnimal.age} years old)</p>
        <p><strong>Youngest Animal:</strong> {youngestAnimal.name} ({youngestAnimal.age} years old)</p>
        <p><strong>Average Age:</strong> {averageAge} years</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Species Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={speciesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {speciesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mb-2 mt-6">Age Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ageData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="age" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mb-2 mt-6">Color Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={colorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {colorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Statistics;
