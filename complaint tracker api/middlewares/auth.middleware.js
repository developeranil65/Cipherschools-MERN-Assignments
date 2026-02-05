const authMiddleware = (req, res, next) => {
    console.log('[AUTH] Checking authorization header');

    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.trim() === '') {
        console.log('[AUTH] Access denied - No authorization header');
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Authorization header required for admin access'
        });
    }

    console.log('[AUTH] Access granted - Authorization header present');
    next();
};

export default authMiddleware;
