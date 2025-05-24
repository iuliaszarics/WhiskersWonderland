// animals.test.js
import request from 'supertest';
import app from './server.js';

describe('Animals API', () => {
  it('GET /animals should return all animals', async () => {
    const res = await request(app).get('/animals');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /animals should create a new animal', async () => {
    const newAnimal = {
      name: "Test Animal",
      age: 3,
      species: "Dog",
      breed: "Test Breed",
      color: "Test Color",
      description: "Test description",
      photo: "https://example.com/photo.jpg"
    };

    const res = await request(app).post('/animals').send(newAnimal);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('PATCH /animals/:id should update an animal', async () => {
    // First add a new animal so you have one to update.
    const animalToAdd = {
      name: "Before Patch",
      age: 2,
      species: "Cat",
      breed: "Test",
      color: "Grey",
      description: "Before update",
      photo: "https://example.com/photo.jpg"
    };
    const addRes = await request(app).post('/animals').send(animalToAdd);
    const animalId = addRes.body.id;

    // Now update the animal's description.
    const updateRes = await request(app)
      .patch(`/animals/${animalId}`)
      .send({ description: "After update" });
    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.description).toEqual("After update");
  });

  it('DELETE /animals/:id should remove an animal', async () => {
    // Add another animal so you can delete it.
    const animalToDelete = {
      name: "To Be Deleted",
      age: 4,
      species: "Rabbit",
      breed: "Test",
      color: "White",
      description: "Will be deleted",
      photo: "https://example.com/photo.jpg"
    };
    const addRes = await request(app).post('/animals').send(animalToDelete);
    const animalId = addRes.body.id;

    const deleteRes = await request(app).delete(`/animals/${animalId}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('id', animalId);
  });
});