import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Gunakan metode POST' });
  }

  const { username, password, device_id } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi!' });
  }

  try {
    // Koneksi ke database MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Cari user berdasarkan username
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah!' });
    }

    // Verifikasi password
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Username atau password salah!' });
    }

    // Cek expired
    const now = new Date();
    const expiredAt = new Date(user.expired_at);
    if (now > expiredAt) {
      return res.status(403).json({ error: 'Akun sudah expired!' });
    }

    // Cek dan update device
    let devices = [];
    try {
      devices = JSON.parse(user.devices || '[]');
    } catch {
      devices = [];
    }

    if (!devices.includes(device_id)) {
      if (devices.length >= user.device_limit) {
        return res.status(403).json({ error: 'Device limit penuh!' });
      }

      devices.push(device_id);
      await connection.execute('UPDATE users SET devices = ? WHERE id = ?', [
        JSON.stringify(devices),
        user.id,
      ]);
    }

    // Hitung sisa hari aktif
    const diff = expiredAt - now;
    const dias_left = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    await connection.end();

    return res.status(200).json({
      Cliente: username,
      Dias: dias_left,
    });
  } catch (err) {
    console.error('ERROR:', err.message);
    return res.status(500).json({ error: 'Error: ' + err.message });
  }
        }
