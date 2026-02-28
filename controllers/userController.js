const db = require("../models/db");

const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Server error" });
    }

    console.log("Users fetched:", results);

    res.status(200).json(results);
  });
};

module.exports = {
  getAllUsers
};