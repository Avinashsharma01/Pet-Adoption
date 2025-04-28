import { useState } from "react";
import { FaHeart } from "react-icons/fa";

const PetImageGallery = ({ photoURLs, petName }) => {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="md:w-1/2">
            <div className="relative h-96">
                <img
                    src={
                        photoURLs?.[activeImage] ||
                        "https://via.placeholder.com/600x400?text=No+Image+Available"
                    }
                    alt={petName}
                    className="w-full h-full object-cover"
                />
                {photoURLs && photoURLs.length > 1 && (
                    <div className="absolute left-4 right-4 bottom-4 flex justify-center">
                        <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full p-2">
                            {photoURLs.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-3 h-3 rounded-full ${
                                        index === activeImage
                                            ? "bg-white"
                                            : "bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Thumbnail Images */}
            {photoURLs && photoURLs.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                    {photoURLs.map((photo, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                                index === activeImage
                                    ? "ring-2 ring-purple-500"
                                    : ""
                            }`}
                        >
                            <img
                                src={photo}
                                alt={`${petName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PetImageGallery;
