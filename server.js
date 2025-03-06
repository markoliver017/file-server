require("module-alias/register");

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("@config/routes");
const favicon = require("serve-favicon");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(helmet());
// app.use(morgan("combined"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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
