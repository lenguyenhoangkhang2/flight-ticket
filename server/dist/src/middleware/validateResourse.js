"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateResource = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        return res.status(400).send(e.errors);
    }
};
exports.default = validateResource;
