const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'whybuilder-secret-2026';

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'whybuilder',
  user: 'whybuilder',
  password: 'Wanted360',
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const { area, lifestyle, noise, minBudget, maxBudget, limit = 20 } = req.query;
    let query = `
      SELECT p.*, u.full_name as landlord_name, u.email as landlord_email,
             u.trust_score as landlord_trust_score
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      WHERE p.listing_status = 'verified'
    `;
    const params = [];
    let i = 1;
    if (area)      { query += ` AND LOWER(p.area) = LOWER($${i++})`;  params.push(area); }
    if (noise)     { query += ` AND p.noise_level = $${i++}`;          params.push(noise); }
    if (minBudget) { query += ` AND p.price_per_month >= $${i++}`;     params.push(Number(minBudget)); }
    if (maxBudget) { query += ` AND p.price_per_month <= $${i++}`;     params.push(Number(maxBudget)); }
    if (lifestyle) { query += ` AND $${i++} = ANY(p.lifestyle_tags)`;  params.push(lifestyle); }
    query += ` ORDER BY p.created_at DESC LIMIT $${i}`;
    params.push(Number(limit));
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.full_name as landlord_name, u.email as landlord_email,
             u.phone_number as landlord_phone, u.trust_score as landlord_trust_score
      FROM properties p
      LEFT JOIN users u ON p.landlord_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/neighbourhood/:area', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) as listing_count,
        ROUND(AVG(safety_score)::numeric,1) as avg_safety,
        ROUND(AVG(commute_rating)::numeric,1) as avg_commute,
        COUNT(*) FILTER (WHERE noise_level='quiet') as quiet,
        COUNT(*) FILTER (WHERE noise_level='moderate') as moderate,
        COUNT(*) FILTER (WHERE noise_level='lively') as lively,
        ROUND(AVG(price_per_month) FILTER (WHERE bedrooms=0)::numeric,0) as studio,
        ROUND(AVG(price_per_month) FILTER (WHERE bedrooms=1)::numeric,0) as one_bed,
        ROUND(AVG(price_per_month) FILTER (WHERE bedrooms=2)::numeric,0) as two_bed,
        ROUND(AVG(price_per_month) FILTER (WHERE bedrooms=3)::numeric,0) as three_bed
      FROM properties
      WHERE LOWER(area) = LOWER($1) AND listing_status = 'verified'
    `, [req.params.area]);
    const r = rows[0];
    res.json({
      area: req.params.area,
      listingCount: Number(r.listing_count),
      avgSafety: Number(r.avg_safety) || 0,
      avgCommute: Number(r.avg_commute) || 0,
      noiseDistribution: { quiet: Number(r.quiet), moderate: Number(r.moderate), lively: Number(r.lively) },
      avgRentByBedroom: {
        studio:   r.studio   ? Number(r.studio)   : undefined,
        oneBed:   r.one_bed  ? Number(r.one_bed)  : undefined,
        twoBed:   r.two_bed  ? Number(r.two_bed)  : undefined,
        threeBed: r.three_bed? Number(r.three_bed): undefined,
      },
      topLifestyleTags: [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const t = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, account_type: user.account_type },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, account_type: user.account_type }, token: t });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, account_type } = req.body;
    if (!email || !password || !full_name) return res.status(400).json({ error: 'All fields required' });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (email,password_hash,full_name,account_type) VALUES ($1,$2,$3,$4) RETURNING id,email,full_name,account_type',
      [email.toLowerCase().trim(), hash, full_name, account_type || 'renter']
    );
    const user = rows[0];
    const t = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, account_type: user.account_type },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.status(201).json({ user, token: t });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' });
});

app.get('/api/saved', async (req, res) => { res.json([]); });
app.post('/api/saved', async (req, res) => { res.json({ ok: true }); });
app.delete('/api/saved/:id', async (req, res) => { res.json({ ok: true }); });

app.get('/api/preferences', async (req, res) => { res.json({ lifestyle_tags: [], noise_level: null }); });
app.post('/api/preferences', async (req, res) => { res.json({ ok: true }); });

app.get('/api/landlords/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.full_name, u.email, u.phone_number, u.business_name,
             u.trust_score, u.response_rate, u.created_at as member_since,
             COUNT(p.id) as total_listings,
             COUNT(p.id) FILTER (WHERE p.listing_status='verified') as verified_listings_count
      FROM users u
      LEFT JOIN properties p ON p.landlord_id = u.id
      WHERE u.id = $1 GROUP BY u.id
    `, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/landlords/:id/properties', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM properties WHERE landlord_id=$1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/properties', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.full_name as landlord_name, u.email as landlord_email
      FROM properties p LEFT JOIN users u ON p.landlord_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/properties/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE properties SET listing_status=$1, verified_at=NOW() WHERE id=$2',
      [status, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  WhyBuilder API → http://localhost:${PORT}/api/health\n`);
});

// ── Hero Slides (admin-managed) ──────────────────────────────────────────────
app.get('/api/hero-slides', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM hero_slides WHERE active = true ORDER BY sort_order ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/hero-slides', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hero_slides ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/hero-slides', async (req, res) => {
  try {
    const { image_url, area, label, sort_order } = req.body;
    if (!image_url || !area || !label) return res.status(400).json({ error: 'image_url, area, label required' });
    const { rows } = await pool.query(
      'INSERT INTO hero_slides (image_url, area, label, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [image_url, area, label, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/hero-slides/:id', async (req, res) => {
  try {
    const { image_url, area, label, sort_order, active } = req.body;
    const { rows } = await pool.query(
      `UPDATE hero_slides SET
        image_url   = COALESCE($1, image_url),
        area        = COALESCE($2, area),
        label       = COALESCE($3, label),
        sort_order  = COALESCE($4, sort_order),
        active      = COALESCE($5, active)
       WHERE id = $6 RETURNING *`,
      [image_url, area, label, sort_order, active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/hero-slides/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hero_slides WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
