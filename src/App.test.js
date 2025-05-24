import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

const mockInitialAnimals = [
  { id: 1, name: "Buddy", breed: "Labrador", species: "Dog" },
  { id: 2, name: "Mittens", breed: "Siamese", species: "Cat" },
  { id: 3, name: "Coco", breed: "Bulldog", species: "Dog" }
];

const TestComponent = () => {
  const [animals, setAnimals] = useState(mockInitialAnimals);
  const [searchTerm, setSearchTerm] = useState("");

  const addAnimal = (newAnimal) => {
    setAnimals([...animals, { ...newAnimal, id: animals.length + 1 }]);
  };

  const updateAnimal = (id, updatedData) => {
    setAnimals(animals.map(animal => animal.id === id ? { ...animal, ...updatedData } : animal));
  };

  const deleteAnimal = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search animals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => addAnimal({ name: "Goldie", breed: "Goldfish", species: "Other" })}>Add Animal</button>
      <div>
        {filteredAnimals.map((animal) => (
          <div key={animal.id}>
            <p>{animal.name}</p>
            <button onClick={() => updateAnimal(animal.id, { name: "Updated" })}>Update</button>
            <button onClick={() => deleteAnimal(animal.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

describe("Animal CRUD functionality", () => {
  test("adds a new animal", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText("Add Animal"));
    expect(screen.getByText("Goldie")).toBeInTheDocument();
  });

  test("filters animals based on name", () => {
    render(<TestComponent />);
    const searchInput = screen.getByPlaceholderText(/search animals.../i);
    fireEvent.change(searchInput, { target: { value: "Buddy" } });
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("Mittens")).toBeNull();
  });

  test("filters animals based on breed", () => {
    render(<TestComponent />);
    const searchInput = screen.getByPlaceholderText(/search animals.../i);
    fireEvent.change(searchInput, { target: { value: "Siamese" } });
    expect(screen.getByText("Mittens")).toBeInTheDocument();
    expect(screen.queryByText("Buddy")).toBeNull();
  });

  test("filters animals based on species", () => {
    render(<TestComponent />);
    const searchInput = screen.getByPlaceholderText(/search animals.../i);
    fireEvent.change(searchInput, { target: { value: "Dog" } });
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Coco")).toBeInTheDocument();
    expect(screen.queryByText("Mittens")).toBeNull();
  });

  test("updates an animal's name", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getAllByText("Update")[0]);
    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  test("deletes an animal", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(screen.queryByText("Buddy")).toBeNull();
  });
});
