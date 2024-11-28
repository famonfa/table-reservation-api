import express from 'express';
import { PrismaClient } from '@prisma/client';
import cloudinary from '../../cloudinary';


const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { managerId, name, address } = req.body;

    if (!managerId || !name || !address) {
       res.status(400).json({ error: 'Manager ID, restaurant name, and address are required' });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const restaurant = await prisma.restaurant.create({
        data: { 
          name, 
          address
        },
      });
      await prisma.managerRestaurant.create({
        data: {
          managerId,
          restaurantId: restaurant.id
        }
      });

      return restaurant;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(400).json({ error: 'Unable to create restaurant' });
  }
});

// Edit restaurant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, cuisine, managers, description } = req.body;
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { name, address, phone, cuisine, managers, description },
    });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: 'Unable to update restaurant' });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch restaurants' });
  }
});


router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const restaurant = await prisma.restaurant.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: { tables: true },
    });
    
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Unable to fetch restaurant' });
  }
});

router.post('/:restaurantId/banner', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { bannerImg } = req.body;

    if (!bannerImg) {
      res.status(400).json({ error: 'No image data provided' });
    }

    // Upload base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(bannerImg, {
      folder: 'restaurant-banners',
    });

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { bannerImg: result.secure_url },
    });

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({ error: 'Unable to upload banner image' });
  }
});

export default router;