const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const cors = require('cors');

function applySecurity(app){
    app.use(helmet());
    app.use(cors({
        origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5175'],
        credentials: true,
    }));
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
            standardHeaders: true,
            legacyHeaders: false
        })
    )
}

module.exports = {applySecurity};
