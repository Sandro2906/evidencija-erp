'use server';

import pool from '../db';

async function ensureTableExists() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_documents (
      id SERIAL PRIMARY KEY,
      doc_type VARCHAR(50) UNIQUE,
      payload JSONB,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function saveNewDocument(formData) {
  try {
    await ensureTableExists();
    const docType = 'pdf_' + Date.now(); // Unique constraint bypass

    const res = await pool.query(`
      INSERT INTO custom_documents (doc_type, payload, updated_at) 
      VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id
    `, [docType, JSON.stringify(formData)]);

    return { success: true, id: res.rows[0].id };
  } catch (error) {
    console.error('Greška pri snimanju novog naloga:', error);
    return { error: 'Nemoguće sačuvati dokument.' };
  }
}

export async function updateDocument(id, formData) {
  try {
    await ensureTableExists();
    await pool.query(`
      UPDATE custom_documents 
      SET payload = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [JSON.stringify(formData), id]);
    
    return { success: true };
  } catch (error) {
    console.error('Greška pri ažuriranju naloga:', error);
    return { error: 'Nemoguće ažurirati dokument.' };
  }
}

export async function getAllDocuments() {
  try {
    await ensureTableExists();
    // Uzmi samo one koji imaju pdf_ prefiks
    const res = await pool.query(`
      SELECT id, payload, updated_at 
      FROM custom_documents 
      WHERE doc_type LIKE 'pdf_%' 
      ORDER BY updated_at DESC
    `);
    
    return res.rows.map(row => ({
      id: row.id,
      payload: row.payload,
      updated_at: row.updated_at
    }));
  } catch (error) {
    console.error('Greška pri povlačenju arhive:', error);
    return [];
  }
}

export async function deleteDocument(id) {
  try {
    await pool.query(`DELETE FROM custom_documents WHERE id = $1`, [id]);
    return { success: true };
  } catch (error) {
    return { error: 'Nemoguće obrisati nalog.' };
  }
}

// Stara funckija zadržana reda radi ako je nekad neko pozove (safe-guard)
export async function saveDocumentToDb(formData) {
  return await saveNewDocument(formData);
}
export async function loadDocumentFromDb() {
  return null;
}
