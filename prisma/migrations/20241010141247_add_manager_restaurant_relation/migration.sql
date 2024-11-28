-- CreateTable
CREATE TABLE "ManagerRestaurant" (
    "managerId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "ManagerRestaurant_pkey" PRIMARY KEY ("managerId","restaurantId")
);

-- AddForeignKey
ALTER TABLE "ManagerRestaurant" ADD CONSTRAINT "ManagerRestaurant_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
