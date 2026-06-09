#!/bin/bash

set -e

SITE_HTML_DIR="Site HTML"
SITEMAP_URL="https://www.savannahpropertyguardians.com/sitemap.xml"

echo "Checking for existing '$SITE_HTML_DIR' directory..."
if [ -d "$SITE_HTML_DIR" ]; then
    echo "Directory exists. Deleting..."
    rm -rf "$SITE_HTML_DIR"
fi

echo "Creating '$SITE_HTML_DIR' directory..."
mkdir -p "$SITE_HTML_DIR"

echo "Downloading sitemap.xml into '$SITE_HTML_DIR'..."
curl -sL "$SITEMAP_URL" -o "$SITE_HTML_DIR/sitemap.xml"

echo "Extracting URLs from sitemap..."
# Extract contents of <loc> tags. Compatible with macOS (BSD sed) and GNU sed.
urls=$(sed -n 's/.*<loc>\(.*\)<\/loc>.*/\1/p' "$SITE_HTML_DIR/sitemap.xml")

echo "Downloading HTML pages into '$SITE_HTML_DIR'..."
count=0
for url in $urls; do
    # Strip protocol and domain to get the path portion
    path=$(echo "$url" | sed -E 's|^https?://[^/]+||')

    if [ -z "$path" ] || [ "$path" = "/" ]; then
        route_name="index"
    else
        # Remove leading and trailing slashes
        route_name=$(echo "$path" | sed -E 's|^/||; s|/$||')
        # Replace any remaining / with _ to create a flat filename
        route_name=$(echo "$route_name" | tr '/' '_')
    fi

    filepath="$SITE_HTML_DIR/${route_name}.html"

    echo "  [$((++count))] $url -> $filepath"
    curl -sL "$url" -o "$filepath"
done

echo ""
echo "Download complete! $count pages + sitemap.xml saved to '$SITE_HTML_DIR'"
