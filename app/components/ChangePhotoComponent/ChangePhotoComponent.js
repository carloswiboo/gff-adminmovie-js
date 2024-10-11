import React, { useState } from "react";

const ChangePhotoComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/api/uploadimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Image uploaded successfully");
        console.log(data);
      } else {
        alert("Error uploading image");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading image");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image-upload">Upload an Image:</label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default ChangePhotoComponent;
