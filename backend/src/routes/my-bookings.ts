import express, { Request, Response } from "express";
import { checkSession } from "../middleware/auth";
import { HotelType } from "../shared/types";
import Hotel from "../models/hotel";

const router = express.Router();

router.get("/", checkSession, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

export default router;
