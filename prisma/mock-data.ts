import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();

  // Create Restaurants
  const restaurants = await prisma.restaurant.createMany({
    data: [
      { 
        name: "Luigi's Italian", 
        address: "123 Main St, Anytown, USA", 
        phone: "555-1234", 
        cuisine: "Italian", 
        description: "Authentic Italian cuisine in a cozy, family-friendly atmosphere. Known for our homemade pasta and wood-fired pizzas.",
        bannerImg: "https://www.foodandwine.com/thmb/dX7pNh_WX83ESqb9VJuvkBwVKwM=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Braciole-FT-RECIPE1122-66acf49cef0e4390bec780945709e7f3.jpg" 
      },
      { 
        name: "Sushi Palace", 
        address: "456 Oak Rd, Somewhere, USA", 
        phone: "555-5678", 
        cuisine: "Japanese", 
        description: "Experience the finest sushi and Japanese cuisine. Our expert chefs use only the freshest ingredients to create culinary masterpieces.",
        bannerImg: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/cc/8d/c5/shiromy-spicy.jpg?w=600&h=400&s=1" 
      },
      { 
        name: "El Taco Loco", 
        address: "789 Spice Ave, Salsa City, USA", 
        phone: "555-2468", 
        cuisine: "Mexican", 
        description: "Vibrant Mexican street food with a modern twist. Our colorful taco bar and extensive tequila selection will transport you south of the border.",
        bannerImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSskCR0-vqiWM4TZgN8VmYkvGoFRGXXGeFp5A&s" 
      },
      { 
        name: "Golden Dragon", 
        address: "101 Fortune St, Chinatown, USA", 
        phone: "555-1357", 
        cuisine: "Chinese", 
        description: "Traditional Chinese delicacies served in an elegant setting. Our dim sum brunch is a local favorite.",
        bannerImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaJmSc01Pf5Zm7zva9nT67sD0PRhUQcXNt0Q&s" 
      },
      { 
        name: "Le Petit Bistro", 
        address: "202 Rue de la Paix, Frenchville, USA", 
        phone: "555-9876", 
        cuisine: "French", 
        description: "A slice of Paris in the heart of the city. Enjoy classic French dishes and an extensive wine list in our charming bistro setting.",
        bannerImg: "https://www.johansens.com/wp-content/uploads/2021/02/French-Food-4.jpg" 
      },
      { 
        name: "Curry House", 
        address: "303 Spice Lane, Flavor Town, USA", 
        phone: "555-2468", 
        cuisine: "Indian", 
        description: "A spice lover's paradise. Our aromatic curries and tandoori specialties showcase the diverse flavors of India.",
        bannerImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6WTPOcANexgKHRBXwaIvXWI-QUBMCNmHgTwg7Lx7wMSuQH2eE3CemYBpHMop4_HvblSs&usqp=CAU" 
      },
      { 
        name: "The Steakhouse", 
        address: "404 Beef Blvd, Meatville, USA", 
        phone: "555-3690", 
        cuisine: "American", 
        description: "Prime cuts of beef cooked to perfection. Our dry-aged steaks and classic cocktails offer the ultimate American dining experience.",
        bannerImg: "https://comedera.com/wp-content/uploads/sites/9/2022/06/bife-de-chorizo.jpg?resize=1316,740&quality=80" 
      },
      { 
        name: "Mamma Mia Pizzeria", 
        address: "505 Cheese St, Little Italy, USA", 
        phone: "555-7531", 
        cuisine: "Italian", 
        description: "Neapolitan-style pizzas baked in our imported wood-fired oven. The perfect spot for a casual dinner with friends and family.",
        bannerImg: "https://static.wixstatic.com/media/nsplsh_5a326f7341616f7458584d~mv2_d_4617_3078_s_4_2.jpg/v1/fill/w_1899,h_1266,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/nsplsh_5a326f7341616f7458584d~mv2_d_4617_3078_s_4_2.jpg" 
      },
    ]
  });

  console.log('Restaurants created:', restaurants);

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@example.com", phone: "555-1111" },
      { name: "Bob Smith", email: "bob@example.com", phone: "555-2222" },
      { name: "Charlie Brown", email: "charlie@example.com", phone: "555-3333" },
    ]
  });

  console.log('Users created:', users);

  // Fetch restaurant IDs
  const restaurantIds = await prisma.restaurant.findMany({
    select: { id: true }
  });

  // Create Tables
  const tables = await prisma.table.createMany({
    data: [
      { 
        number: 1, 
        capacity: 2, 
        restaurantId: restaurantIds[0].id,
        availableHours: ['12', '13', '14', '18', '19', '20', '21']
      },
      { 
        number: 2, 
        capacity: 4, 
        restaurantId: restaurantIds[0].id,
        availableHours: ['12', '13', '14', '18', '19', '20', '21', '22']
      },
      { 
        number: 3, 
        capacity: 6, 
        restaurantId: restaurantIds[0].id,
        availableHours: ['12', '13', '14', '18', '19', '20']
      },
      { 
        number: 4, 
        capacity: 2, 
        restaurantId: restaurantIds[1].id,
        availableHours: ['11', '12', '13', '14', '15', '19', '20', '21']
      },
      { 
        number: 5, 
        capacity: 4, 
        restaurantId: restaurantIds[1].id,
        availableHours: ['11', '12', '13', '14', '15', '19', '20', '21', '22']
      },
      { 
        number: 6, 
        capacity: 6, 
        restaurantId: restaurantIds[1].id,
        availableHours: ['11', '12', '13', '14', '15', '19', '20']
      },
    ]
  });

  console.log('Tables created:', tables);

  // Fetch user and table IDs
  const userIds = await prisma.user.findMany({ select: { id: true } });
  const tableIds = await prisma.table.findMany({ select: { id: true } });

  // Create Reservations
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set to midnight

  const reservations = await prisma.reservation.createMany({
    data: [
      { 
        reservationDate: tomorrow,
        reservationTime: '19', 
        partySize: 2, 
        status: 'confirmed', 
        userId: userIds[0].id, 
        tableId: tableIds[0].id, 
        restaurantId: restaurantIds[0].id,
      },
      { 
        reservationDate: tomorrow,
        reservationTime: '20', 
        partySize: 4, 
        status: 'confirmed', 
        userId: userIds[1].id, 
        tableId: tableIds[1].id, 
        restaurantId: restaurantIds[0].id,
      },
      { 
        reservationDate: tomorrow,
        reservationTime: '18', 
        partySize: 6, 
        status: 'confirmed', 
        userId: userIds[2].id, 
        tableId: tableIds[2].id, 
        restaurantId: restaurantIds[0].id,
      },
    ]
  });

  console.log('Reservations created:', reservations);

  // Test query to check availability
  const testDate = new Date(tomorrow); // Use tomorrow's date
  const testTime = '19'; // Test for 7:00 PM
  const testRestaurantId = restaurantIds[0].id; // Use the first restaurant's ID
  const testPartySize = 4;

  console.log(`Checking availability for restaurant ${testRestaurantId} on ${testDate.toDateString()} at ${testTime} for party of ${testPartySize}`);
  
  const availableTables = await prisma.table.findMany({
    where: {
      restaurantId: testRestaurantId,
      capacity: { gte: testPartySize },
      availableHours: { has: testTime },
      NOT: {
        reservations: {
          some: {
            reservationDate: testDate,
            reservationTime: testTime,
            status: 'confirmed',
          },
        },
      },
    },
  });

  console.log('Available tables:', availableTables);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });