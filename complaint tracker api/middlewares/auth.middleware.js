const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.trim() === '') {
        return res.status(401).json({
            success: false,
            message: 'Authorization required'
        });
    }

    next();
};

export default authMiddleware;
