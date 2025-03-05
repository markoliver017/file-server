require('module-alias/register');

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Routes
// const userRoutes = require("./routes/userRoutes");
// // Use Routes
// app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



//front end
// import axios from "axios";

// const registerUser = async () => {
//     try {
//         const response = await axios.post("http://localhost:5000/api/users/register", {
//             username: "testUser",
//             password: "testPass"
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error(error.response.data);
//     }
// };