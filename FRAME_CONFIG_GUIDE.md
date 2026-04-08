# Frame Configuration Guide

Each frame now has its own customizable configuration! This allows you to position photos and text differently for each frame design.

## 📋 How Frame Configs Work

All frame configurations are defined in `lib/framesConfig.js` in the `frameConfigs` object.

Each frame can have unique settings for:

- **Photo position**: `ovalX`, `ovalY` - Center coordinates
- **Photo size**: `ovalRadiusX`, `ovalRadiusY` - Width and height of the photo area
- **Name text**: Position (`nameX`, `nameY`), size (`nameSize`), color (`nameColor`)
- **Designation text**: Position (`desigX`, `desigY`), size (`desigSize`), color (`desigColor`)

## 📐 How to Find Correct Coordinates

For each frame template (2160×2160px):

1. **Open the template image** in any image editor (Photoshop, Figma, etc.)
2. **Note the photo area center point**:
   - `ovalX` = horizontal distance from left edge to photo center
   - `ovalY` = vertical distance from top edge to photo center
   - `ovalRadiusX` = half the photo width
   - `ovalRadiusY` = half the photo height

3. **Note text area positions**:
   - `nameX`, `nameY` = top-left corner of where name text should start
   - `desigX`, `desigY` = top-left corner of where designation text should start

4. **For text sizes**:
   - Measure in pixels at 2160×2160px scale
   - `nameSize` = font size for name
   - `desigSize` = font size for designation

## 🎨 Example: Customizing Pohela Boishak Frame

If your Pohela Boishak template has:

- Photo circle at position (500, 1000) with radius 300×400

```javascript
"pohela-boishak": {
  ovalX: 500,           // photo center X
  ovalY: 1000,          // photo center Y
  ovalRadiusX: 300,     // photo width radius
  ovalRadiusY: 400,     // photo height radius
  nameX: 150,           // name text X position
  nameY: 1500,          // name text Y position
  nameSize: 60,         // name font size
  nameColor: "#FFFFFF", // name text color (white)
  desigX: 150,          // designation text X position
  desigY: 1600,         // designation text Y position
  desigSize: 40,        // designation font size
  desigColor: "#FFFFFF", // designation text color
}
```

## 🔧 Editing Frame Config

1. **Open** `lib/framesConfig.js`
2. **Find** the frame config you want to edit (e.g., `"eid-mubarak"`)
3. **Update** the coordinates and sizes
4. **Save** the file
5. **Test** by visiting `/frames/eid-mubarak` and uploading a test photo

## 📝 Current Frames and Their Config IDs

```
"pohela-boishak"    → Pohela Boishak
"eid-mubarak"       → Eid Mubarak
"birthday"          → Birthday
"wedding"           → Wedding
"new-year"          → New Year
"valentine"         → Valentine
"graduation"        → Graduation
"anniversary"       → Anniversary
```

## 🚀 Adding New Frame Configs

When adding a new frame:

1. Add frame data to the `frames` array
2. Create a new config entry in `frameConfigs` object with the frame ID as key
3. Update the coordinates based on your template design

Example:

```javascript
"ramadan": {
  ovalX: 600,
  ovalY: 1100,
  ovalRadiusX: 350,
  ovalRadiusY: 420,
  nameX: 200,
  nameY: 1600,
  nameSize: 65,
  nameColor: "#FFD700",  // Gold text
  desigX: 200,
  desigY: 1700,
  desigSize: 50,
  desigColor: "#FFD700",
}
```

## 💡 Tips

- Keep text positions outside the photo area to avoid overlap
- Use color hex codes (#RRGGBB format) for text colors
- Test each frame after updating coordinates
- Keep text sizes proportional to the template (usually 40-70px for names)
- Ensure adequate spacing between name and designation

---

This system allows complete customization per frame while keeping the code maintainable! 🎉
