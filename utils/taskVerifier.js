const Joi = require("joi");

const taskLayout = Joi.object({
    name: Joi.string().min(3).required(),
    completed: Joi.boolean().required(),
});

// Both fields optional
const patchLayout = Joi.object({
    name: Joi.string().min(3),
    completed: Joi.boolean(),
});

exports.verifyTask = (task) => taskLayout.validate(task);
exports.verifyPatchObject = (customObject) => patchLayout.validate(customObject);
