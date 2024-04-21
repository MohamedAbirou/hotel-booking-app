import express, { Request, Response } from "express";
import multer from "multer";
import Hotel from "../models/hotel"; // Import your Hotel model
import { checkSession } from "../middleware/auth";
import { createHotelValidationSchema } from "../utils/validationSchemas";
import { checkSchema } from "express-validator";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "../config/firebaseConfig";
import { HotelType } from "../shared/types";

const router = express.Router();
const storage = getStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// /api/add-hotel (add a hotel)
router.post(
  "/",
  checkSession,
  checkSchema(createHotelValidationSchema),
  upload.array("imageFiles", 6), // Use array instead of fields for multiple images
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //* Check if data is empty
      if (!newHotel) {
        return res.status(400).send({ message: "No data provided" });
      }

      //* Check if image files were uploaded
      if (!imageFiles || imageFiles.length === 0) {
        return res.status(401).send({ message: "No images uploaded" });
      }

      //* Upload images to Firebase Storage and get their download URLs
      const uploadPromises = imageFiles.map(async (image) => {
        const storageRef = ref(storage, `images/${image.originalname}`);
        const metadata = { contentType: image.mimetype };
        const snapshot = await uploadBytesResumable(
          storageRef,
          image.buffer,
          metadata
        );
        return getDownloadURL(snapshot.ref);
      });

      const imageUrls = await Promise.all(uploadPromises);

      // //* Create a new hotel instance with the data and image URLs
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //* Save the new hotel to the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //* Return a success response
      res.status(201).send(hotel);
    } catch (error) {
      // Handle errors and send an error response
      console.log("Error creating hotel: ", error);
      res.status(500).send({ message: "Something went wrong!" });
    }
  }
);

// /api/my-hotels (display hotels per user)
router.get("/", checkSession, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });

    res.status(201).json(hotels);
  } catch (error) {
    console.log("Error getting hotels: ", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

export default router;
