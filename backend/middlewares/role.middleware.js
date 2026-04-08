export const authorize = (...allowedroles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "not authenticated"
            });
        }

        if (!allowedroles.includes(req.user.role)) {
            return res.status(403).json({
                message: "not authorized"
            });
        }
        next();
    }
}