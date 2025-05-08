export const uploadImageToCloudinary = async (file) => {
  try {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Unsupported file type. Please upload a JPEG, PNG, or WebP image."
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "My-Travel"); // Замініть на ваш upload preset
    formData.append("folder", "publications");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dlistrvqm/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url; // Повертаємо URL завантаженого зображення
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
