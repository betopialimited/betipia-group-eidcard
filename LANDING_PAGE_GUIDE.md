# Landing Page Setup Guide

## Project Structure

I've created a complete landing page system with the following structure:

```
app/
├── page.js                    # Landing page showing all frames
├── frames/
│   └── [id]/
│       └── page.js           # Dynamic frame generator page
├── layout.js
└── globals.css

lib/
└── framesConfig.js           # Frame configuration file
```

## What Was Created

### 1. **Landing Page** (`app/page.js`)

- Beautiful grid layout displaying all available frames
- Each frame card shows:
  - Frame preview image
  - Frame name and description
  - Hover effect with "Create Card" button
  - Direct link to that frame's generator
- Responsive design (1-4 columns based on screen size)
- Header with branding
- Footer with features list

### 2. **Frame Configuration** (`lib/framesConfig.js`)

- Central configuration file for all frames
- Each frame has:
  - `id`: Unique identifier (used in URL)
  - `name`: Display name
  - `description`: Short description
  - `occasion`: Occasion type
  - `previewImage`: Path to preview image
  - `templateImage`: Path to template for card generator
  - `color`: Accent color for the frame card

**Current Frames:**

- Pohela Boishakh
- Eid Mubarak
- Birthday
- Wedding
- New Year
- Valentine
- Graduation
- Anniversary

### 3. **Frame Generator** (`app/frames/[id]/page.js`)

- Dynamic page that loads based on frame ID
- Contains the card generator logic
- Features:
  - Photo upload with cropping
  - Name and designation input
  - Real-time preview
  - Download button
  - Share functionality
  - Automatic frame loading based on URL

## Adding More Frames

### Step 1: Add Template Image

Add your template image to the public folder:

```
public/frames/
├── your-frame-name-template.jpg
└── your-frame-name-preview.jpg
```

### Step 2: Register Frame in Config

Edit `lib/framesConfig.js` and add to the frames array:

```javascript
{
  id: "your-frame-id",
  name: "Your Frame Name",
  description: "Frame description",
  occasion: "Occasion Type",
  previewImage: "/frames/your-frame-name-preview.jpg",
  templateImage: "/frames/your-frame-name-template.jpg",
  color: "#FF5733",  // Hex color code
},
```

### Step 3: Test

Open landing page and click on your new frame to verify it works!

## Customizing Frame Generators

If different frames need different configurations (different photo positions, text areas, etc.), you can:

1. Create a `frameConfigs` object in `lib/framesConfig.js`:

```javascript
export const frameConfigs = {
  "pohela-boishak": {
    ovalX: 529,
    ovalY: 985,
    // ... other config
  },
  "your-frame-id": {
    ovalX: 600,
    ovalY: 1000,
    // ... different config
  },
};
```

2. Update the generator to use frame-specific config:

```javascript
const config = frameConfigs[frameId] || CONFIG;
```

## About the Landing Page Design

- **Dark theme** with gradient background for modern look
- **Card-based layout** with smooth hover animations
- **Responsive grid** that adapts to all screen sizes
- **Color-coded frames** with unique accent colors
- **Smooth transitions** and scaling effects on hover
- **Accessible** with proper semantic HTML

## Navigation Flow

```
/ (Landing Page)
  └── /frames/[frame-id] (Frame Generator)
      ├── Download Card
      ├── Share Card
      └── Back to Home
```

## File Paths to Update

When you add frame images, create them at:

- `/public/frames/frame-name-preview.jpg` - 300x300px (preview card)
- `/public/frames/frame-name-template.jpg` - 2160x2160px (template for generator)

## Next Steps

1. **Create template images** for each frame (or use placeholders)
2. **Add frame configuration** to `lib/framesConfig.js`
3. **Test each frame** by clicking on the landing page
4. **Customize template coordinates** if needed for different positions

---

For any modifications, update the `lib/framesConfig.js` file and the frame images will be automatically loaded!
