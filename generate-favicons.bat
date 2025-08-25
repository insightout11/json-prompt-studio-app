@echo off
echo JSON Prompt Studio - Favicon Generator
echo =====================================
echo.
echo This script will generate all required favicon formats from the SVG files.
echo.
echo Prerequisites:
echo - ImageMagick (for SVG to PNG conversion)
echo - Or use the generate-favicons.html file in your browser
echo.

REM Check if ImageMagick is installed
magick -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ImageMagick found! Generating PNG files...
    echo.
    
    REM Standard favicons
    magick public\favicon.svg -resize 16x16 public\favicon-16x16.png
    magick public\favicon.svg -resize 32x32 public\favicon-32x32.png
    magick public\favicon.svg -resize 96x96 public\favicon-96x96.png
    
    REM Apple Touch Icons
    magick public\favicon.svg -resize 57x57 public\apple-icon-57x57.png
    magick public\favicon.svg -resize 60x60 public\apple-icon-60x60.png
    magick public\favicon.svg -resize 72x72 public\apple-icon-72x72.png
    magick public\favicon.svg -resize 76x76 public\apple-icon-76x76.png
    magick public\favicon.svg -resize 114x114 public\apple-icon-114x114.png
    magick public\favicon.svg -resize 120x120 public\apple-icon-120x120.png
    magick public\favicon.svg -resize 144x144 public\apple-icon-144x144.png
    magick public\favicon.svg -resize 152x152 public\apple-icon-152x152.png
    magick public\favicon.svg -resize 180x180 public\apple-icon-180x180.png
    magick public\favicon.svg -resize 180x180 public\apple-icon.png
    magick public\favicon.svg -resize 180x180 public\apple-icon-precomposed.png
    
    REM Android Chrome Icons
    magick public\favicon.svg -resize 36x36 public\android-icon-36x36.png
    magick public\favicon.svg -resize 48x48 public\android-icon-48x48.png
    magick public\favicon.svg -resize 72x72 public\android-icon-72x72.png
    magick public\favicon.svg -resize 96x96 public\android-icon-96x96.png
    magick public\favicon.svg -resize 144x144 public\android-icon-144x144.png
    magick public\favicon.svg -resize 192x192 public\android-icon-192x192.png
    
    REM Microsoft Tiles
    magick public\favicon.svg -resize 70x70 public\ms-icon-70x70.png
    magick public\favicon.svg -resize 144x144 public\ms-icon-144x144.png
    magick public\favicon.svg -resize 150x150 public\ms-icon-150x150.png
    magick public\favicon.svg -resize 310x310 public\ms-icon-310x310.png
    
    REM Create ICO file with multiple sizes
    magick public\favicon.svg -resize 16x16 temp-16.png
    magick public\favicon.svg -resize 32x32 temp-32.png
    magick public\favicon.svg -resize 48x48 temp-48.png
    magick temp-16.png temp-32.png temp-48.png public\favicon.ico
    del temp-*.png
    
    echo.
    echo ✅ All favicon files generated successfully!
    echo.
    echo Generated files:
    dir public\*icon*.png public\favicon.*
    
) else (
    echo ❌ ImageMagick not found.
    echo.
    echo Please either:
    echo 1. Install ImageMagick from https://imagemagick.org/
    echo 2. Open generate-favicons.html in your browser and download files manually
    echo 3. Use an online favicon generator like https://www.favicon-generator.org/
    echo.
    echo The updated favicon.svg with black background is ready to use!
)

echo.
pause