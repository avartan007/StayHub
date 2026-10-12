const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().allow("", null).optional(),
        // image can be a URL string, or omitted (file upload handled by multer)
        image: Joi.alternatives().try(
            Joi.string().uri().allow("", null),
            Joi.object({
                url: Joi.string().allow("", null),
                filename: Joi.string().allow("", null)
            })
        ).optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});