const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const db = require("./db");
const userRoutes = require("./Routes/userRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static("public"));

/* ================= USE ROUTES ================= */
app.use("/api", userRoutes);

/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/users.html");
});

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkSql = "SELECT id FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
      if (err) {
        console.log(err);
        return res.send("Database error ❌");
      }

      if (results.length > 0) {
        return res.send("User already exists ⚠️");
      }

      const insertSql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
      db.query(insertSql, [email, hashedPassword, role], (err) => {
        if (err) {
          console.log(err);
          return res.send("Error creating user ❌");
        }

        res.send("User created successfully ✅");
      });
    });

  } catch (error) {
    console.log(error);
    res.send("Server error ❌");
  }
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database error ❌");
    }

    if (results.length === 0) {
      return res.send("User not found ❌");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send("Wrong password ❌");
    }

    req.session.user = user;

    res.send("Login successful ✅");
  });
});

/* ================= LOGOUT ================= */
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out ✅");
  });
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});