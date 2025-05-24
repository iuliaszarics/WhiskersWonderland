import express from 'express';
import { Animal, Shelter } from '../models/index.js';

const AnimalRouter = express.Router();

AnimalRouter.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.shelterId) where.shelterId = req.query.shelterId;

    const animals = await Animal.findAll({
      where,
      include: [{
        model: Shelter,
        attributes: ['id', 'name', 'address']
      }],
      order: [['id', 'ASC']],
    });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

AnimalRouter.post('/', async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    const animalWithShelter = await Animal.findByPk(animal.id, { include: Shelter });
    res.status(201).json(animalWithShelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


AnimalRouter.patch('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });

    await animal.update(req.body);
    const updated = await Animal.findByPk(animal.id, { include: Shelter });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


AnimalRouter.delete('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });

    await animal.destroy();
    res.json({ message: 'Animal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default AnimalRouter;