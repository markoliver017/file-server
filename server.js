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
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "*", // Allow all origins (for development)
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization",
        exposedHeaders: "Cross-Origin-Resource-Policy",
    })
);

app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://pedbc.pcmc.gov.ph");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept, Authorization, Cache-Control"
    );
    res.header("Cache-Control", "public, max-age=31536000, immutable");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    next();
});

app.use(helmet());
app.use(morgan("combined"));
app.use("/uploads", express.static("public/uploads"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Session:", req.session);
    console.log("User:", req.user);
    next();
});

app.use("/api", routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

//front end
// import axios from "axios";

// try {
//     const res = await axios.post('http://localhost:5000/api/users/store', {
//       username,
//       password,
//     });
//     setResponse(res.data);
//   } catch (error) {
//     console.error(error.response.data);
//     setResponse(error.response.data);
//   }
