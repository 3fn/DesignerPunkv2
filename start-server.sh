#!/bin/bash

# Simple script to start a local server for viewing HTML files
# This allows Visual Editor and browsers to load your components correctly

echo "🚀 Starting local server..."
echo "📍 Server will be available at: http://localhost:8001"
echo ""
echo "To view your files:"
echo "  • Basic Usage: http://localhost:8001/src/components/core/ButtonCTA/examples/BasicUsage.html"
echo "  • Variants: http://localhost:8001/src/components/core/ButtonCTA/examples/Variants.html"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Start Python's built-in HTTP server on port 8001
python3 -m http.server 8001

