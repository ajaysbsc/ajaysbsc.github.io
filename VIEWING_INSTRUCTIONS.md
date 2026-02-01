# How to View Your Website

## Why Blog and Gallery Don't Show Content When Opening Files Directly

Your website uses **ES6 JavaScript modules** (`import/export`) for the blog and gallery functionality. Modern browsers block ES6 modules when opening HTML files directly from the file system (using `file://` protocol) due to CORS security restrictions.

**Symptoms:**
- Blog page shows "Blog stories coming soon" but no posts
- Gallery page is empty
- Browser console shows errors like: `Access to script at 'file:///.../js/blog.js' from origin 'null' has been blocked by CORS policy`

## ✅ Solution: Use a Local Web Server

You need to serve your website through a local web server. Here are several easy options:

### Option 1: Python (Recommended - Already Installed)

**For Python 3:**
```bash
# Navigate to your website directory
cd /Users/ajay/Library/CloudStorage/OneDrive-IITBombay/Additional_works/50_github_website/ajaygodara.github.io

# Start a simple HTTP server
python3 -m http.server 8000
```

**For Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open in your browser:
```
http://localhost:8000
```

**To view specific pages:**
- Homepage: `http://localhost:8000/index.html`
- Blog: `http://localhost:8000/blog.html`
- Gallery: `http://localhost:8000/gallery.html`

### Option 2: Node.js `http-server` (If You Have Node.js)

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to your website directory
cd /Users/ajay/Library/CloudStorage/OneDrive-IITBombay/Additional_works/50_github_website/ajaygodara.github.io

# Start server
http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server Extension

If you're using Visual Studio Code:

1. Install "Live Server" extension by Ritwick Dey
2. Open your website folder in VS Code
3. Right-click on `index.html`
4. Select "Open with Live Server"

The website will open in your browser automatically.

### Option 4: PHP Built-in Server (If You Have PHP)

```bash
# Navigate to your website directory
cd /Users/ajay/Library/CloudStorage/OneDrive-IITBombay/Additional_works/50_github_website/ajaygodara.github.io

# Start PHP server
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 🌐 On GitHub Pages (Production)

When you push your site to GitHub Pages, it works perfectly because GitHub serves it through a proper web server automatically. The ES6 modules load correctly.

Your site URL will be:
```
https://yourusername.github.io/ajaygodara.github.io/
```

## 🔍 Verifying It Works

Once you start a local server and navigate to `http://localhost:8000`, you should see:

### Blog Page (`/blog.html`)
- ✅ Blog post cards appear
- ✅ Featured post shows at top
- ✅ Category filters work
- ✅ "Antarctica" category shows your expedition post

### Gallery Page (`/gallery.html`)
- ✅ Images load in a grid
- ✅ Expedition filters appear
- ✅ Click on images opens lightbox
- ✅ Filter by expedition works

## 🐛 Troubleshooting

### Still Not Seeing Content?

**1. Check Browser Console**
```
Open Developer Tools (F12)
Go to Console tab
Look for any errors
```

**2. Verify Server is Running**
```bash
# You should see output like:
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

**3. Check Data Files Exist**
```bash
ls -la data/blog-posts.json
ls -la data/gallery.json
```

**4. Hard Refresh Browser**
```
Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
Safari: Cmd+Option+R
```

### Content Still Not Loading?

**Check JavaScript Console Errors:**

If you see errors like:
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of ""
```

**Solution:** Make sure you're using a proper HTTP server (Options 1-4 above), not opening files directly.

## 📝 Quick Start Script

Create a file called `serve.sh` in your website directory:

```bash
#!/bin/bash
# Start local development server

echo "Starting local web server..."
echo "Open your browser to: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
```

Make it executable:
```bash
chmod +x serve.sh
```

Run it:
```bash
./serve.sh
```

## 🎯 Summary

**❌ Don't:** Double-click HTML files or use `file://` URLs
**✅ Do:** Start a local web server and use `http://localhost:8000`

**Why?** ES6 modules require HTTP/HTTPS protocol for security reasons.

**On GitHub Pages:** Everything works automatically! ✨

---

**Need help?** Make sure Python 3 is installed (it should be on macOS), then just run:
```bash
cd /path/to/your/website
python3 -m http.server 8000
```
