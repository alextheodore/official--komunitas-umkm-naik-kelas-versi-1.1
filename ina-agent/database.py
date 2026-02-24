# Buat file: database.py
import sqlite3
import json
# Connect ke database (buat baru jika belum ada)
conn = sqlite3.connect('ina_umkm.db')
cursor = conn.cursor()
# Buat tabel users
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nama TEXT,
 jenis_usaha TEXT,
 lokasi TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
# Buat tabel conversations
cursor.execute('''
CREATE TABLE IF NOT EXISTS conversations (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER,
 pesan TEXT,
 jawaban TEXT,
 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users (id)
)
''')
conn.commit()
conn.close()