#!/bin/bash

echo "JSON Prompt Studio - Favicon Generator"
echo "====================================="
echo ""
echo "This script will generate all required favicon formats from the SVG files."
echo ""

# Check if ImageMagick is installed
if command -v magick &> /dev/null || command -v convert &> /dev/null; then
    echo "ImageMagick found! Generating PNG files..."
    echo ""
    
    # Use 'magick' if available, otherwise fall back to 'convert'
    if command -v magick &> /dev/null; then
        CMD="magick"
    else
        CMD="convert"
    fi
    
    # Standard favicons
    $CMD public/favicon.svg -resize 16x16 public/favicon-16x16.png
    $CMD public/favicon.svg -resize 32x32 public/favicon-32x32.png
    $CMD public/favicon.svg -resize 96x96 public/favicon-96x96.png
    
    # Apple Touch Icons
    $CMD public/favicon.svg -resize 57x57 public/apple-icon-57x57.png
    $CMD public/favicon.svg -resize 60x60 public/apple-icon-60x60.png
    $CMD public/favicon.svg -resize 72x72 public/apple-icon-72x72.png
    $CMD public/favicon.svg -resize 76x76 public/apple-icon-76x76.png
    $CMD public/favicon.svg -resize 114x114 public/apple-icon-114x114.png
    $CMD public/favicon.svg -resize 120x120 public/apple-icon-120x120.png
    $CMD public/favicon.svg -resize 144x144 public/apple-icon-144x144.png
    $CMD public/favicon.svg -resize 152x152 public/apple-icon-152x152.png
    $CMD public/favicon.svg -resize 180x180 public/apple-icon-180x180.png
    $CMD public/favicon.svg -resize 180x180 public/apple-icon.png
    $CMD public/favicon.svg -resize 180x180 public/apple-icon-precomposed.png
    
    # Android Chrome Icons
    $CMD public/favicon.svg -resize 36x36 public/android-icon-36x36.png
    $CMD public/favicon.svg -resize 48x48 public/android-icon-48x48.png
    $CMD public/favicon.svg -resize 72x72 public/android-icon-72x72.png
    $CMD public/favicon.svg -resize 96x96 public/android-icon-96x96.png
    $CMD public/favicon.svg -resize 144x144 public/android-icon-144x144.png
    $CMD public/favicon.svg -resize 192x192 public/android-icon-192x192.png
    
    # Microsoft Tiles
    $CMD public/favicon.svg -resize 70x70 public/ms-icon-70x70.png
    $CMD public/favicon.svg -resize 144x144 public/ms-icon-144x144.png
    $CMD public/favicon.svg -resize 150x150 public/ms-icon-150x150.png
    $CMD public/favicon.svg -resize 310x310 public/ms-icon-310x310.png
    
    # Create ICO file with multiple sizes
    $CMD public/favicon.svg -resize 16x16 temp-16.png
    $CMD public/favicon.svg -resize 32x32 temp-32.png
    $CMD public/favicon.svg -resize 48x48 temp-48.png
    $CMD temp-16.png temp-32.png temp-48.png public/favicon.ico
    rm -f temp-*.png
    
    echo ""
    echo "✅ All favicon files generated successfully!"
    echo ""
    echo "Generated files:"
    ls -la public/*icon*.png public/favicon.*
    
else
    echo "❌ ImageMagick not found."
    echo ""
    echo "Please either:"
    echo "1. Install ImageMagick: brew install imagemagick (Mac) or apt-get install imagemagick (Ubuntu)"
    echo "2. Open generate-favicons.html in your browser and download files manually"
    echo "3. Use an online favicon generator like https://www.favicon-generator.org/"
    echo ""
    echo "The updated favicon.svg with black background is ready to use!"
fi

echo ""