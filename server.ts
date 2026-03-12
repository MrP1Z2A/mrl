import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const db = new Database('mechrobo.db');
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT,
      category TEXT,
      difficulty TEXT,
      image_url TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed data if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO projects (title, description, author, category, difficulty, image_url, content) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insert.run(
      'Autonomous Hexapod Walker',
      'A 6-legged robot capable of navigating obstacles using ultrasonic sensors.',
      'RoboMaster',
      'Robotics',
      'Advanced',
      'https://picsum.photos/seed/robot1/800/600',
      '# Introduction\nThis project details the construction of a hexapod walker...\n\n# Components\n- 18x Servo Motors\n- Arduino Mega\n- Ultrasonic Sensor'
    );
    insert.run(
      'Smart Hydraulic Arm',
      'A precision hydraulic arm controlled via Bluetooth and a custom mobile app.',
      'MechEngineer',
      'Mechanical',
      'Intermediate',
      'https://picsum.photos/seed/mech1/800/600',
      '# Overview\nUsing 3D printed parts and hydraulic syringes to create a powerful arm.'
    );
    insert.run(
      'Solar Tracking System',
      'Dual-axis solar tracker to maximize energy efficiency of PV panels.',
      'EcoTech',
      'Energy',
      'Beginner',
      'https://picsum.photos/seed/solar1/800/600',
      '# Concept\nLDR sensors detect the sun position and move the panel accordingly.'
    );
  }

  app.use(express.json());

  // API Routes
  app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json(projects);
  });

  app.get('/api/projects/:id', (req, res) => {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });

  app.post('/api/projects', (req, res) => {
    const { title, description, author, category, difficulty, image_url, content } = req.body;
    const result = db.prepare('INSERT INTO projects (title, description, author, category, difficulty, image_url, content) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title, description, author, category, difficulty, image_url, content);
    res.json({ id: result.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
