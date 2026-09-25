import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = await open({ filename: "./symposium.db", driver: sqlite3.Database });

// --- DB Setup ---
await db.exec(`CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, email TEXT, password TEXT)`);
await db.exec(`CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, name TEXT)`);
await db.exec(`CREATE TABLE IF NOT EXISTS coordinators (id INTEGER PRIMARY KEY, name TEXT, email TEXT)`);
await db.exec(`CREATE TABLE IF NOT EXISTS registrations (id INTEGER PRIMARY KEY, name TEXT, email TEXT, eventId INTEGER)`);

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await db.get("SELECT * FROM admins WHERE email=?", email);
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
  res.json({ token });
});

// --- Events ---
app.get("/api/events", async (_, res) => {
  res.json(await db.all("SELECT * FROM events"));
});
app.post("/api/events", async (req, res) => {
  const { name } = req.body;
  await db.run("INSERT INTO events (name) VALUES (?)", name);
  res.json({ success: true });
});

// --- Coordinators ---
app.get("/api/coordinators", async (_, res) => {
  res.json(await db.all("SELECT * FROM coordinators"));
});
app.post("/api/coordinators", async (req, res) => {
  const { name, email } = req.body;
  await db.run("INSERT INTO coordinators (name, email) VALUES (?, ?)", [name, email]);
  res.json({ success: true });
});

// --- Registrations ---
app.get("/api/registrations", async (_, res) => {
  res.json(await db.all("SELECT * FROM registrations"));
});
app.post("/api/registrations", async (req, res) => {
  const { name, email, eventId } = req.body;
  await db.run("INSERT INTO registrations (name, email, eventId) VALUES (?, ?, ?)", [name, email, eventId]);
  res.json({ status: "registered" });
});

app.listen(5000, () => console.log("Backend running at http://localhost:5000"));
