const { AuditTrail } = require("@models/index"); // Import AuditTrail model

const logAuditTrail = async ({
    userId,
    ip,
    userAgent,
    controller,
    action,
    isError = false,
    details = null,
    stackTrace = null,
}) => {
    try {
        await AuditTrail.create({
            user_id: userId || null,
            ip_address: ip || null,
            user_agent: userAgent || null,
            controller,
            action,
            is_error: isError,
            details,
            stack_trace: stackTrace,
        });
    } catch (error) {
        console.error("Failed to log audit trail:", error);
    }
};

module.exports = logAuditTrail;
