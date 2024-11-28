import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create reservation
router.post('/', async (req, res) => {
  try {
    const { reservationDate, reservationTime, partySize, userId, tableId, restaurantId } = req.body;

    // 1. Basic input validation
    if (!reservationDate || !reservationTime || !partySize || !userId || !tableId || !restaurantId) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // 2. Validate reservation date (no past dates)
    const requestedDate = new Date(reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      res.status(400).json({ error: 'Cannot make reservations for past dates' });
      return;
    }

    // 3. Validate time slot format and range
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(reservationTime)) {
      res.status(400).json({ error: 'Invalid time format. Use HH:MM format' });
      return;
    }

    // 4. Get table details to validate capacity
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      res.status(404).json({ error: 'Table not found' });
      return;
    }

    // 5. Validate party size against table capacity
    if (partySize > table.capacity) {
      res.status(400).json({ 
        error: `Party size exceeds table capacity. Maximum capacity is ${table.capacity}` 
      });
      return;
    }

    // 6. Validate if time is within available hours
    if (!table.availableHours.includes(reservationTime)) {
      res.status(400).json({ 
        error: 'Selected time is not available for this table' 
      });
      return;
    }

    // 7. Check for existing reservations
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tableId,
        reservationDate: new Date(reservationDate),
        reservationTime,
        status: {
          in: ['pending', 'confirmed']
        }
      }
    });

    if (existingReservation) {
      res.status(400).json({ 
        error: 'This table is already reserved for the selected date and time' 
      });
    } else {
      // Create the reservation if all validations pass
      const reservation = await prisma.reservation.create({
        data: {
          reservationDate: new Date(reservationDate),
          reservationTime,
          partySize,
          userId,
          tableId,
          restaurantId,
          status: 'pending'
        },
        include: {
          user: true,
          table: true,
          restaurant: true
        }
      });
      res.status(201).json(reservation);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to create reservation' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ 
        error: 'Invalid status. Must be pending, confirmed, cancelled, or completed' 
      });
      return;
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        table: true,
        restaurant: true
      }
    });

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to update reservation status' });
  }
});

// Remove reservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.reservation.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to remove reservation' });
  }
});

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      res.status(400).json({ error: 'Restaurant ID is required' });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurantId as string
      },
      include: {
        user: true,
        table: true,
      }
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch reservations' });
  }
});

// Get reservations by date for a restaurant
router.get('/byDate/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;

    if (!date) {
      res.status(400).json({ error: 'Date parameter is required' });
    }

    // Convert date string to Date object for the start and end of the day
    const searchDate = new Date(date as string);
    const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
    const endDate = new Date(searchDate.setHours(23, 59, 59, 999));

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: true,
        table: true,
        restaurant: true,
      },
      orderBy: {
        reservationTime: 'asc'
      }
    });

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations by date:', error);
    res.status(500).json({ error: 'Unable to fetch reservations' });
  }
});



// Get specific reservation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        table: true,
        restaurant: true
      }
    });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch reservation' });
  }
});

export default router;