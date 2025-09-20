//schema validation using Joi, validates the data before it is sent to the database, reducing db lookups
const Joi = require("joi");

// module.exports.meterSchema = Joi.object({
//     meter: Joi.object({
//         name: Joi.string().min(2).max(50).required(),
//         current: Joi.number().min(0).max(20).required(),
//         voltage: Joi.number().min(200).max(280).required(),
//         powerFactor: Joi.number().min(0).max(1).required(),
//         alertCount: Joi.number(),
//         status: Joi.string().required(),
//         location: Joi.string().min(2).max(150).required(),
//         temperature: Joi.number().min(-20).max(100).required(),
//         load: Joi.number().required(),
//         fire: Joi.boolean().required(),
//     }).required(),
// });

// module.exports.alertSchema = Joi.object({
//     alert: Joi.object({
//         name: Joi.string().required(),
//         current: Joi.number().optional(),
//         voltage: Joi.number().optional(),
//         powerFactor: Joi.number().optional(),
//         temperature: Joi.number().optional(),
//         load: Joi.number().optional(),
//         triggeredAt: Joi.date().default(Date.now).required(),
//         reason: Joi.string().required(),
//     }).required(),
// });

module.exports.userSchemaSignup = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9_]+$/)
        .min(3)
        .max(30)
        .required(),
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .min(8)
        .max(100)
        .required(),
}).required();

module.exports.userSchemaLogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
}).required();

module.exports.commentSchema = Joi.object({
    comment: Joi.string().min(1).max(100).required(),
}).required();
