import Animal from '../models/Animal.js';
import { authMiddleware } from './authController.js';
import User from '../models/User.js';

export const createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findByPk(id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    await animal.update(req.body);
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findByPk(id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    await animal.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
