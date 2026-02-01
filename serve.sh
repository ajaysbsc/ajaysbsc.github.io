#!/bin/bash
# Start local development server for testing the website

echo "=================================================="
echo "  Ajay Godara Website - Local Development Server"
echo "=================================================="
echo ""
echo "Starting server on port 8000..."
echo ""
echo "📱 Open in your browser:"
echo "   http://localhost:8000"
echo ""
echo "📄 Direct page links:"
echo "   Homepage:  http://localhost:8000/index.html"
echo "   Blog:      http://localhost:8000/blog.html"
echo "   Gallery:   http://localhost:8000/gallery.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="
echo ""

python3 -m http.server 8000
