export const frames = [
  {
    id: "pohela-boishak",
    name: "Pohela Boishak",
    description: "Bengali New Year greeting card",
    occasion: "Bengali New Year",
    previewImage: "/frames/Pohela-Boishak-frame-bg.png",
    templateImage: "/frames/Pohela-Boishak-frame-bg.png",
    color: "#FF6B6B",
  },
  {
    id: "eid-mubarak",
    name: "Eid Mubarak",
    description: "Islamic festival greeting card",
    occasion: "Eid Celebration",
    previewImage: "/frames/Eid-card-frame-bg.jpg",
    templateImage: "/frames/Eid-card-frame-bg.jpg",
    color: "#4ECDC4",
  },
  {
    id: "birthday",
    name: "Birthday",
    description: "Birthday celebration card",
    occasion: "Birthday",
    previewImage: "/frames/birthday-preview.jpg",
    templateImage: "/frames/birthday-template.jpg",
    color: "#45B7D1",
  },
  {
    id: "wedding",
    name: "Wedding",
    description: "Wedding announcement card",
    occasion: "Wedding",
    previewImage: "/frames/wedding-preview.jpg",
    templateImage: "/frames/wedding-template.jpg",
    color: "#F06292",
  },
  {
    id: "new-year",
    name: "New Year",
    description: "New Year greeting card",
    occasion: "New Year",
    previewImage: "/frames/new-year-preview.jpg",
    templateImage: "/frames/new-year-template.jpg",
    color: "#FFD93D",
  },
  {
    id: "valentine",
    name: "Valentine",
    description: "Valentine's Day card",
    occasion: "Valentine's Day",
    previewImage: "/frames/valentine-preview.jpg",
    templateImage: "/frames/valentine-template.jpg",
    color: "#FF1744",
  },
  {
    id: "graduation",
    name: "Graduation",
    description: "Graduation congratulations card",
    occasion: "Graduation",
    previewImage: "/frames/graduation-preview.jpg",
    templateImage: "/frames/graduation-template.jpg",
    color: "#651FFF",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Anniversary celebration card",
    occasion: "Anniversary",
    previewImage: "/frames/anniversary-preview.jpg",
    templateImage: "/frames/anniversary-template.jpg",
    color: "#FF6E40",
  },
];

// Default configuration for all frames (can be overridden per frame)
const DEFAULT_CONFIG = {
  templateWidth: 2160,
  templateHeight: 2160,
  ovalX: 529,
  ovalY: 985,
  ovalRadiusX: 296,
  ovalRadiusY: 395,
  nameX: 200,
  nameY: 1520,
  nameSize: 55,
  nameColor: "#FFFFFF",
  desigX: 200,
  desigY: 1580,
  desigSize: 45,
  desigColor: "#FFFFFF",
};

// Frame-specific configurations - customize photo position and text for each frame
export const frameConfigs = {
  "pohela-boishak": {
    templateWidth: 2000,
    templateHeight: 2000,
    // Circular photo frame in the bottom portion of the card
    ovalX: 712, // photo center X u2014 centered in decorative border
    ovalY: 1540, // photo center Y (~75% of 2000)
    ovalRadiusX: 190, // circular radius X
    ovalRadiusY: 190, // circular radius Y (equal = circle)
    // Name text to the right of the photo
    nameX: 1000, // name X position (right of circle, shifted right)
    nameY: 1520, // name Y position (vertically aligned with photo center)
    nameSize: 65, // name font size
    nameColor: "#1a1a1a", // dark near-black
    // Designation below name
    desigX: 1000, // same X as name
    desigY: 1585, // below name
    desigSize: 42,
    desigColor: "#555555", // medium gray
  },
  "eid-mubarak": {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  birthday: {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  wedding: {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  "new-year": {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  valentine: {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  graduation: {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
  anniversary: {
    ovalX: 529,
    ovalY: 985,
    ovalRadiusX: 296,
    ovalRadiusY: 395,
    nameX: 200,
    nameY: 1520,
    nameSize: 55,
    nameColor: "#FFFFFF",
    desigX: 200,
    desigY: 1580,
    desigSize: 45,
    desigColor: "#FFFFFF",
  },
};

export const getFrameById = (id) => frames.find((frame) => frame.id === id);

export const getFrameConfig = (frameId) => {
  return frameConfigs[frameId] || DEFAULT_CONFIG;
};
