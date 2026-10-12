require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const User = require("../models/user.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

function assignCategory(listing) {
    const text = (listing.title + " " + listing.description + " " + listing.location).toLowerCase();
    if (text.includes("beach") || text.includes("ocean") || text.includes("sea") || text.includes("coastal")) return "beach";
    if (text.includes("mountain") || text.includes("cabin") || text.includes("ski") || text.includes("chalet") || text.includes("aspen")) return "mountains";
    if (text.includes("castle") || text.includes("villa") || text.includes("historic") || text.includes("palace") || text.includes("manor") || text.includes("tuscany")) return "castles";
    if (text.includes("camp") || text.includes("tent") || text.includes("treehouse") || text.includes("nature") || text.includes("glamping")) return "camping";
    if (text.includes("pool") || text.includes("swim") || text.includes("resort")) return "pools";
    if (text.includes("farm") || text.includes("countryside") || text.includes("barn") || text.includes("ranch")) return "farms";
    if (text.includes("arctic") || text.includes("snow") || text.includes("ice") || text.includes("winter")) return "arctic";
    if (text.includes("island") || text.includes("tropical") || text.includes("bali") || text.includes("fiji") || text.includes("maui")) return "island";
    if (listing.country && listing.country !== "United States" && listing.country !== "India") return "abroad";
    if (text.includes("loft") || text.includes("city") || text.includes("downtown") || text.includes("apartment")) return "iconic";
    return "rooms";
}

const initDB = async () => {
    await Listing.deleteMany({});

    // Find or create demo owner
    let demoOwner = await User.findOne({ username: "wanderlust_demo" });
    if (!demoOwner) {
        demoOwner = new User({ email: "demo@wanderlust.com", username: "wanderlust_demo" });
        await User.register(demoOwner, "demopassword123");
    }

    const listings = initData.data.map((listing) => ({
        ...listing,
        // Handle both { url, filename } objects and plain strings
        image: typeof listing.image === "object" && listing.image !== null
            ? listing.image
            : { url: listing.image, filename: "listingimage" },
        // Category
        category: assignCategory(listing),
        // Default geometry
        geometry: {
            type: "Point",
            coordinates: [0, 0]
        },
        owner: demoOwner._id
    }));

    await Listing.insertMany(listings);
    console.log("✅ Database initialized with", listings.length, "listings and owner:", demoOwner.username);
};

mongoose
    .connect(MONGO_URL)
    .then(initDB)
    .then(() => mongoose.connection.close())
    .catch((err) => {
        console.error("❌ Could not initialize database:", err.message);
        process.exitCode = 1;
    });