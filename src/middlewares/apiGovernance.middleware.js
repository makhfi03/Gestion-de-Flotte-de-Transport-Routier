const apiGovernance = (req, res, next) => {
    res.setHeader('X-API-Version', '2.0.0');
    res.setHeader('X-API-Deprecated', 'false');
    next();
};
module.exports = apiGovernance;