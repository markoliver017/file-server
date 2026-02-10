require("module-alias/register");

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("@config/passport");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("@config/routes");
const favicon = require("serve-favicon");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 15 * 60 * 1000, // 15 minutes
            rolling: true, // refresh the cookie on each request
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "*", // Allow all origins (for development)
        //origin: ["https://pedbc.pcmc.gov.ph", "http://localhost:3000"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization, x-api-key",
        exposedHeaders: "Cross-Origin-Resource-Policy",
    }),
);

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://static.cloudflareinsights.com"],
                imgSrc: ["'self'", "data:", "blob:"], // Allow images from local uploads and blobs
                connectSrc: ["'self'", "https://static.cloudflareinsights.com"],
                styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if any
            },
        },
    }),
);
app.use(morgan("dev"));
app.use("/uploads", express.static("public/uploads"));
app.use(express.static("public")); // Serve other static files (login.html, dashboard.html, etc.)
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Session:", req.session);
    console.log("User:", req.user);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to the PCMC FILESERVER API");
});
// Mount new API routes (protected by Admin or API Key)
const apiRoutes = require("@routes/api");
app.use("/api", apiRoutes);

// Keep old routes for now (Login, etc.)
app.use("/api", routes); // Ensure this doesn't conflict. Old routes usage: /api/login, /api/uploads

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Database Init
const { authDatabase, syncDatabase } = require("@models");

authDatabase().then(() => {
    syncDatabase(); // This will only sync if in development

    // Start Server
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
});
