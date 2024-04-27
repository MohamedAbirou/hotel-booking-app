import express, { Request, Response } from "express";
import multer from "multer";
import { checkSession } from "../middleware/auth";
import { createHotelValidationSchema } from "../utils/validationSchemas";
import { checkSchema } from "express-validator";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "../config/firebaseConfig";
import { HotelType } from "../shared/types";
import Hotel from "../models/hotel";

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
      const imageUrls = await uploadImages(imageFiles);

      //* Create a new hotel instance with the data and image URLs
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
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// /api/my-hotels/:id (view single hotel details)
router.get("/:id", checkSession, async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.status(201).json(hotel);
  } catch (error) {
    console.log("Error getting single hotel: ", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.put(
  "/:hotelId",
  checkSession,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOne({
        _id: req.params.hotelId,
        userId: req.userId,
      });

      // Find the existing hotel and updated it
      const newHotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      //* Check if data is empty
      if (!newHotel) {
        return res.status(400).send({ message: "No data provided" });
      }

      if (!hotel) {
        return res.status(400).send({ message: "Hotel not found" });
      }

      // Get the old image URLs
      const oldImageUrls = hotel.imageUrls;

      const files = req.files as Express.Multer.File[];

      // Upload images to Firebase Storage and get their download URLs
      const updatedImageUrls = await uploadImages(files);

      // Update hotel instance with the data and image URLs
      newHotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      // Save the updated hotel to the database
      await newHotel.save();

      // Get the image names that need to be deleted
      const imageNamesToDelete = oldImageUrls
        .filter((url) => !newHotel.imageUrls.includes(url))
        .map((url) => {
          // Extract the image name from the URL
          const urlParts = url.split("/");
          const encodedImageName = urlParts[urlParts.length - 1].split("?")[0];

          // Decode the image name
          let imageName = decodeURIComponent(encodedImageName);

          // Remove the 'images/' prefix
          if (imageName.startsWith("images/")) {
            imageName = imageName.substring(7);
          }

          return imageName;
        });

      // Delete each image by its name
      const deletionPromises = imageNamesToDelete.map(async (imageName) => {
        const imageRef = ref(storage, `images/${imageName}`);
        await deleteObject(imageRef);
      });

      // Wait for all deletions to complete
      await Promise.all(deletionPromises);

      // Return a success response
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error updating a single hotel: ", error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

export default router;

const uploadImages = async (imageFiles: Express.Multer.File[]) => {
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
  return imageUrls;
};
