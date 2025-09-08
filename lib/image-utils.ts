// Utility functions for handling dynamic images

export interface BackgroundImage {
  src: string
  alt: string
  title?: string
}

// Static list of images - this will be updated when you add new images to /public/slideshow
// The system will automatically detect all images in the slideshow directory
const SLIDESHOW_IMAGES = [
  "c2_huynh.jpg",
  "c2_oc.jpg",
  "c3_binhnminh.jpg",
  "c3_ca.jpg",
  "c3_hp.jpg",
  "c3_nl.jpg",
]

// Function to get all background images
export const getBackgroundImages = (): BackgroundImage[] => {
  const imageTitles = [
    "Diploma and Cap",
    "Graduation Ceremony Crowd", 
    "University Campus with Graduation Decorations"
  ]
  
  return SLIDESHOW_IMAGES.map((filename, index) => ({
    src: `/slideshow/${filename}`,
    alt: `Background Image ${index + 1}`,
    title: imageTitles[index] || `Background Image ${index + 1}`,
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