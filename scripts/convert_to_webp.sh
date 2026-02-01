#!/bin/bash
#
# Convert Images to WebP Format
# Generates WebP versions of all JPEG/PNG images for better performance
#
# Requirements: cwebp (install with: brew install webp)
#

echo "=================================================="
echo "  WebP Image Conversion Script"
echo "=================================================="
echo ""

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ Error: cwebp is not installed"
    echo ""
    echo "Install with:"
    echo "  macOS: brew install webp"
    echo "  Ubuntu: sudo apt-get install webp"
    echo ""
    exit 1
fi

# Configuration
QUALITY=85
IMAGE_DIR="images/gallery/fulls"
CONVERTED_COUNT=0
SKIPPED_COUNT=0
TOTAL_SIZE_BEFORE=0
TOTAL_SIZE_AFTER=0

echo "🔍 Scanning for images in: $IMAGE_DIR"
echo "📐 Quality setting: $QUALITY%"
echo ""

# Find all JPEG and PNG files
find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    # Get the output filename
    webp_img="${img%.*}.webp"

    # Skip if WebP already exists and is newer
    if [ -f "$webp_img" ] && [ "$webp_img" -nt "$img" ]; then
        echo "⏭️  Skipping (already exists): $(basename "$img")"
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
        continue
    fi

    # Get original file size
    if [ -f "$img" ]; then
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        TOTAL_SIZE_BEFORE=$((TOTAL_SIZE_BEFORE + original_size))
    fi

    # Convert to WebP
    echo "🔄 Converting: $(basename "$img")"
    if cwebp -q $QUALITY "$img" -o "$webp_img" &> /dev/null; then
        # Get WebP file size
        webp_size=$(stat -f%z "$webp_img" 2>/dev/null || stat -c%s "$webp_img" 2>/dev/null)
        TOTAL_SIZE_AFTER=$((TOTAL_SIZE_AFTER + webp_size))

        # Calculate savings
        savings=$((100 - (webp_size * 100 / original_size)))

        echo "   ✅ Created: $(basename "$webp_img") (${savings}% smaller)"
        CONVERTED_COUNT=$((CONVERTED_COUNT + 1))
    else
        echo "   ❌ Failed to convert: $(basename "$img")"
    fi
    echo ""
done

echo "=================================================="
echo "  Conversion Complete!"
echo "=================================================="
echo "📊 Converted: $CONVERTED_COUNT images"
echo "⏭️  Skipped: $SKIPPED_COUNT images"

if [ $TOTAL_SIZE_BEFORE -gt 0 ]; then
    total_savings=$((100 - (TOTAL_SIZE_AFTER * 100 / TOTAL_SIZE_BEFORE)))
    size_before_mb=$(echo "scale=2; $TOTAL_SIZE_BEFORE / 1048576" | bc)
    size_after_mb=$(echo "scale=2; $TOTAL_SIZE_AFTER / 1048576" | bc)

    echo ""
    echo "💾 Size before: ${size_before_mb} MB"
    echo "💾 Size after:  ${size_after_mb} MB"
    echo "📉 Total savings: ${total_savings}%"
fi

echo ""
echo "🎯 Next steps:"
echo "   1. Update HTML to use WebP with fallback"
echo "   2. Test image loading in browsers"
echo "   3. Deploy updated site"
echo "=================================================="
