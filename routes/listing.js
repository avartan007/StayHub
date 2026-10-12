const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Storage strategy: use Cloudinary when credentials exist, otherwise local disk
let storage;
if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
    const cloud = require("../cloudConfig.js");
    storage = cloud.storage;
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../public/uploads"));
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + path.extname(file.originalname));
        }
    });
}

const upload = multer({ storage });

// Index and Create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Listing
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// Show, Update, Delete
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

// Edit Listing
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;