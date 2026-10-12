const Listing = require("../models/listing");

// Index Route — supports ?q=search and ?category=filter
module.exports.index = async (req, res) => {
    const { q, category } = req.query;

    let query = {};
    if (q && q.trim()) {
        const regex = new RegExp(q.trim(), "i");
        query.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
            { description: regex }
        ];
    }

    if (category && category.trim()) {
        query.category = category.trim().toLowerCase();
    }

    const allListings = await Listing.find(query).populate("owner", "username");
    res.render("listings/index.ejs", {
        allListings,
        searchQuery: q || "",
        category: category || ""
    });
};

// Render New Listing Form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", select: "username" }
        })
        .populate("owner", "username");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create Listing
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path || ("/uploads/" + req.file.filename),
            filename: req.file.filename
        };
    } else {
        // Use a nice Unsplash default image
        newListing.image = {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
            filename: "default"
        };
    }

    // Default coordinates (geocoding happens client-side via Leaflet/Nominatim)
    newListing.geometry = {
        type: "Point",
        coordinates: [0, 0]
    };

    await newListing.save();
    req.flash("success", "New listing created! 🎉");
    res.redirect("/listings");
};

// Render Edit Form
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    if (req.file) {
        listing.image = {
            url: req.file.path || ("/uploads/" + req.file.filename),
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted.");
    res.redirect("/listings");
};