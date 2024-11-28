import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:managerId', async (req, res) => {
    try {
      const { managerId } = req.params;
  
      if (!managerId) {
         res.status(400).json({ error: 'Manager ID is required' });
      }
  
      const restaurants = await prisma.restaurant.findMany({
        where: {
          managers: {
            some: {
              managerId
            }
          },
        },
        select: {
          id: true,
          name: true
        }
          }
      );
  
      res.json(restaurants);
    } catch (error) {
      console.error('Error fetching manager restaurants:', error);
      res.status(500).json({ error: 'Unable to fetch restaurants' });
    }
  });
    
  
  export default router;