#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const SLIDESHOW_DIR = path.join(__dirname, '../public/slideshow');
const IMAGE_UTILS_FILE = path.join(__dirname, '../lib/image-utils.ts');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

// Function to check if file is an image
function isImageFile(filename) {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return IMAGE_EXTENSIONS.includes(ext);
}

// Function to scan directory for images
function scanImagesDirectory() {
  try {
    if (!fs.existsSync(SLIDESHOW_DIR)) {
      console.log('❌ Slideshow directory does not exist:', SLIDESHOW_DIR);
      return [];
    }

    const files = fs.readdirSync(SLIDESHOW_DIR);
    const imageFiles = files
      .filter(file => isImageFile(file))
      .sort(); // Sort alphabetically for consistent order

    console.log('📁 Found images in slideshow directory:');
    imageFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });

    return imageFiles;
  } catch (error) {
    console.error('❌ Error scanning directory:', error.message);
    return [];
  }
}

// Function to update the image utils file
function updateImageUtilsFile(imageFiles) {
  try {
    let content = fs.readFileSync(IMAGE_UTILS_FILE, 'utf8');
    
    // Create the new image list
    const imageListString = imageFiles
      .map(file => `  "${file}"`)
      .join(',\n');
    
    // Replace the SLIDESHOW_IMAGES array
    const newListRegex = /const SLIDESHOW_IMAGES = \[[\s\S]*?\]/;
    const newList = `const SLIDESHOW_IMAGES = [\n${imageListString},\n]`;
    
    content = content.replace(newListRegex, newList);
    
    // Write back to file
    fs.writeFileSync(IMAGE_UTILS_FILE, content, 'utf8');
    
    console.log('✅ Updated image-utils.ts with', imageFiles.length, 'images');
  } catch (error) {
    console.error('❌ Error updating image utils file:', error.message);
  }
}

// Main function
function main() {
  console.log('🔍 Scanning slideshow directory...');
  
  const imageFiles = scanImagesDirectory();
  
  if (imageFiles.length === 0) {
    console.log('⚠️  No images found in slideshow directory');
    return;
  }
  
  console.log(`\n📊 Found ${imageFiles.length} images`);
  updateImageUtilsFile(imageFiles);
  
  console.log('\n🎉 Image list updated successfully!');
  console.log('💡 The slideshow will now use all images from /public/slideshow/');
}

// Run the script
main();
