const cors = (allowOrigins = []) => {
    return (req, res, next) => {
        const origin = req.headers.origin;

        // Check if origin is in the allowlist
        const isAllowed = origin && allowOrigins.includes(origin);

        // Set CORS headers only for allowed origins
        if (isAllowed) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.setHeader('Vary', 'Origin');
        } else if (origin) {
            // Origin provided but not allowed: log and reject
            console.warn(`CORS: rejected request from origin: ${origin}`);
            res.setHeader('Vary', 'Origin');
        }

        // Handle preflight OPTIONS requests
        if (req.method === 'OPTIONS') {
            if (isAllowed) {
                res.status(200).end();
                return;
            } else {
                // Disallowed origin: respond with 403
                res.status(403).json({ error: 'CORS policy: origin not allowed' });
                return;
            }
        }

        next();
    };
};

export { cors };