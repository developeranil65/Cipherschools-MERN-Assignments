
const logger = (req, res, next) => {
    console.log(`[LOGGER] ${req.method} ${req.url}`);
    next();
};

export default logger;
