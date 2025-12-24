import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Cloudinary secure_url
      required: true,
    },

    imagePublicId: {
      type: String, // Cloudinary public_id (for delete/update)
      required: true,
    },

    place: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },
     visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
