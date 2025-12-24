import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";

export const createEvent = async (req, res) => {
  try {
    const { title, date, description, place, note ,visible} = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "events",
      }
    );

    const event = await Event.create({
      title,
      date,
      description,
      place,
      note,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      visible: visible !== undefined ? visible : false, 
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }); // newest first
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, description, place, note, visible } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update fields
    event.title = title !== undefined ? title : event.title;
    event.date = date !== undefined ? date : event.date;
    event.description = description !== undefined ? description : event.description;
    event.place = place !== undefined ? place : event.place;
    event.note = note !== undefined ? note : event.note;
    event.visible = visible !== undefined ? visible : event.visible;

    // Update image if new file is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (event.imagePublicId) {
        await cloudinary.uploader.destroy(event.imagePublicId);
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "events" }
      );

      event.image = uploadResult.secure_url;
      event.imagePublicId = uploadResult.public_id;
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete image from Cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
