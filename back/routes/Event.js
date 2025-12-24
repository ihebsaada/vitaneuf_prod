import express from "express";
import uploadCloudinary from "../middleware/multerCloudinary.js";
import verifyToken from "../middleware/verifyToken.js";
import { createEvent,updateEvent,getAllEvents,deleteEvent } from "../controllers/Event.js";

const router = express.Router();

router.post("/add",verifyToken, uploadCloudinary.single("image"), createEvent);
router.get("/", getAllEvents);

// UPDATE EVENT
router.put("/update/:id", verifyToken, uploadCloudinary.single("image"), updateEvent);
// DELETE EVENT
router.delete("/delete/:id", verifyToken, deleteEvent);


export default router;
