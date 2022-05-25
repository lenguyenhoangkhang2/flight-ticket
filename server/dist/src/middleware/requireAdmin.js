"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAdmin = (req, res, next) => {
    const user = res.locals.user;
    if (!user || !user.isAdmin) {
        return res.sendStatus(403);
    }
    return next();
};
exports.default = requireAdmin;
