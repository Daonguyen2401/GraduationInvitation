// Utility functions for handling dynamic images

export interface BackgroundImage {
  src: string
  alt: string
}

// Static list of images - this will be updated when you add new images to /public/slideshow
// The system will automatically detect all images in the slideshow directory
const SLIDESHOW_IMAGES = [
  "diploma-and-cap.jpg",
  "graduation-ceremony-crowd.jpg",
  "university-campus-with-graduation-decorations.jpg",
]

// Function to get all background images
export const getBackgroundImages = (): BackgroundImage[] => {
  return SLIDESHOW_IMAGES.map((filename, index) => ({
    src: `/slideshow/${filename}`,
    alt: `Background Image ${index + 1}`,
  }))
}

// Function to get the count of available images
export const getImageCount = (): number => {
  return SLIDESHOW_IMAGES.length
}

// Function to check if an image exists
export const hasImage = (filename: string): boolean => {
  return SLIDESHOW_IMAGES.includes(filename)
}

// Function to add a new image (for manual updates)
export const addImage = (filename: string): void => {
  if (!SLIDESHOW_IMAGES.includes(filename)) {
    SLIDESHOW_IMAGES.push(filename)
  }
}