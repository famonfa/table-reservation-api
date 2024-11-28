import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a table
router.post('/', async (req, res) => {
  try {
    const { number, capacity, restaurantId, availableHours } = req.body;
    const table = await prisma.table.create({
      data: {
        number,
        capacity,
        restaurantId,
        availableHours,
      },
    });
    res.status(201).json(table);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to create table' });
  }
});



router.get('/availability', async (req, res) => {
  try {
    const { restaurantId, date, partySize  } = req.query;

    if (!restaurantId || !date || !partySize || 
        typeof restaurantId !== 'string' || 
        typeof date !== 'string' || 
        typeof partySize !== 'string') {
      return 
    }

    // At this point, TypeScript knows restaurantId, date, and time are strings
    const restaurantIdString: string = restaurantId;
    const dateString: string = date;
    const partySizeNumber: number = parseInt(partySize, 10);


    // Validate date format (YYYY-MM-DD)
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    //    res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    // }



    // if (isNaN(partySizeNumber) || partySizeNumber <= 0) {
    //   res.status(400).json({ error: 'Invalid party size. Must be a positive number' });
    // }

    const requestedDate = new Date(dateString);
    requestedDate.setHours(0, 0, 0, 0); // Set to midnight

    const availableTables = await prisma.table.findMany({
      where: {
        restaurantId: restaurantIdString,
        capacity: { 
          gte: partySizeNumber,
          lte: partySizeNumber + 2
        },
        NOT: {
          reservations: {
            some: {
              reservationDate: requestedDate,
              status: { not: 'cancelled' },
            },
          },
        },
      },
      select: {
        id: true,
        number: true,
        capacity: true,
        availableHours: true,
        reservations: {
          where: {
            reservationDate: requestedDate,
            status: { not: 'cancelled' },
          },
          select: {
            reservationTime: true,
          },
        },
      },
      orderBy: {
        capacity: 'asc'
      }
    });

    // Process available hours for each table
    const tablesWithAvailability = availableTables.map(table => {
      const reservedHours = table.reservations.map(res => res.reservationTime);
      const availableHours = table.availableHours.filter(hour => !reservedHours.includes(hour));
      return {
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        availableHours,
      };
    });
    res.json({ availableTables: tablesWithAvailability });
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({ error: 'Unable to fetch table availability' });
  }
});

router.get('/', async (req, res) => {
    try {
      const { restaurantId } = req.query;
  
      let whereClause = {};
      if (restaurantId) {
        whereClause = { restaurantId: restaurantId as string };
      }
  
      const tables = await prisma.table.findMany({
        where: whereClause,
        include: {
          restaurant: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          number: 'asc'
        }
      });
  
      res.json(tables);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch tables' });
    }
  });

// Get table availability
// router.get('/availability', async (req, res) => {
//   try {
//     const { restaurantId, date, time } = req.query;

//     if (!restaurantId || !date || !time) {
//       return res.status(400).json({ error: 'Restaurant ID, date, and time are required' });
//     }

//     const requestedDateTime = new Date(`${date}T${time}`);
//     const dayOfWeek = requestedDateTime.toLocaleString('en-US', { weekday: 'long' });
//     const requestedTime = requestedDateTime.toTimeString().slice(0, 5); // HH:MM format

//     // Get all tables for the restaurant that are available on the requested day and time
//     const allTables = await prisma.table.findMany({
//       where: {
//         restaurantId: restaurantId as string,
//         availableDays: {
//           has: dayOfWeek
//         },
//         openTime: {
//           lte: requestedTime
//         },
//         endTime: {
//           gt: requestedTime
//         }
//       },
//     });

//     // Get reservations for the specified date and time
//     const reservations = await prisma.reservation.findMany({
//       where: {
//         restaurantId: restaurantId as string,
//         date: {
//           gte: new Date(requestedDateTime.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
//           lte: new Date(requestedDateTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
//         },
//         status: { not: 'cancelled' },
//       },
//     });

//     // Filter out tables that are already reserved
//     const availableTables = allTables.filter(table => 
//       !reservations.some(reservation => 
//         reservation.tableId === table.id
//       )
//     );

//     res.json(availableTables);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Unable to fetch table availability' });
//   }
// });

// Update a table
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, capacity, availableHours } = req.body;
    const table = await prisma.table.update({
      where: { id },
      data: {
        number,
        capacity,
        availableHours,
      },
    });
    res.json(table);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to update table' });
  }
});

// Remove a table
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if there are any future reservations for this table
//     const futureReservations = await prisma.reservation.findFirst({
//       where: {
//         tableId: id,
//         date: { gte: new Date() },
//         status: { not: 'cancelled' },
//       },
//     });

//     if (futureReservations) {
//       return res.status(400).json({ error: 'Cannot remove table with future reservations' });
//     }

//     // If no future reservations, proceed with removal
//     await prisma.table.delete({
//       where: { id },
//     });

//     res.status(204).send();
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: 'Unable to remove table' });
//   }
// });

export default router;