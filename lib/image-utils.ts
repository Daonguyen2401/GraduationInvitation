// Utility functions for handling dynamic images

export interface BackgroundImage {
  src: string
  alt: string
}

// List of all available background images in /public/slideshow folder
// Add new images here when you add them to /public/slideshow
const BACKGROUND_IMAGE_FILES = [
  "graduation-ceremony-crowd.jpg",
  "university-campus-with-graduation-decorations.jpg", 
  "diploma-and-cap.jpg",
  "iStock-1436453674-1024x540.jpg",
  // Add more images here as you add them to /public/slideshow folder
  // Example: "new-image-1.jpg", "new-image-2.jpg", "new-image-3.jpg", etc.
]

// Function to get all background images dynamically
export const getBackgroundImages = (): BackgroundImage[] => {
  return BACKGROUND_IMAGE_FILES.map((filename, index) => ({
    src: `/slideshow/${filename}`,
    alt: `Background Image ${index + 1}`,
  }))
}

// Function to add a new image to the list (for easy management)
export const addBackgroundImage = (filename: string): void => {
  if (!BACKGROUND_IMAGE_FILES.includes(filename)) {
    BACKGROUND_IMAGE_FILES.push(filename)
  }
}

// Function to get the count of available images
export const getImageCount = (): number => {
  return BACKGROUND_IMAGE_FILES.length
}

// Function to check if an image exists in the list
export const hasImage = (filename: string): boolean => {
  return BACKGROUND_IMAGE_FILES.includes(filename)
}
