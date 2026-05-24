const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role, tableNumber }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// middleware that also checks the user has the 'staff' role
function requireStaff(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user.role !== 'staff') {
            return res.status(403).json({ error: 'Staff access required' });
        }
        next();
    });
}

module.exports = { requireAuth, requireStaff };
