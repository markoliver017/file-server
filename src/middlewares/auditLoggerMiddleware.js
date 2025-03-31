const auditLogger = (req, res, next) => {
    req.auditData = {
        ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        user_agent: req.headers["user-agent"],
    };
    next();
};
module.exports = auditLogger;
