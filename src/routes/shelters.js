import express from 'express';
import { Animal, Shelter } from '../models/index.js';
import { Op } from 'sequelize';

const ShelterRouter = express.Router();

ShelterRouter.get('/', async (req, res) => {
  try {
    const { search = '', sortBy = 'id', order = 'ASC' } = req.query;

    const where = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { contact_info: { [Op.iLike]: `%${search}%` } },
      ],
    } : {};

    const shelters = await Shelter.findAll({
      where,
      include: [{
        model: Animal,
        attributes: ['id', 'name', 'species']
      }],
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


ShelterRouter.get('/:id', async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id, {
      include: Animal,
    });
    if (!shelter) return res.status(404).json({ error: 'shelter not found' });
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

ShelterRouter.post('/', async (req, res) => {
  try {
    const shelter = await Shelter.create(req.body);
    res.status(201).json(shelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

ShelterRouter.patch('/:id', async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'shelter not found' });

    await shelter.update(req.body);
    res.json(shelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


ShelterRouter.delete('/:id', async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'shelter not found' });

    await shelter.destroy();
    res.json({ message: 'shelter deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default ShelterRouter;