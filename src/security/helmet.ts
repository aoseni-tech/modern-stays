
const scriptSrcUrls = [
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const styleSrcUrls = [
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const imageSrcUrls = [
    "'self'",
    "blob:",
    "data:",
    "https://res.cloudinary.com/dqhszkxiy/", 
    "https://images.unsplash.com/",
];
const fontSrcUrls: Array<string> = [];

const cspOptions = {
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [...imageSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls],
    }
}

export {cspOptions};