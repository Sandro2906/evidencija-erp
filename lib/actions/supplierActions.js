'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getSuppliers() {
  try {
    const res = await pool.query('SELECT * FROM suppliers ORDER BY name ASC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
}

export async function addSupplier(formData) {
  const name = formData.get('name');
  const contact_info = formData.get('contact_info');

  if (!name) return { error: 'Ime dobavljača je obavezno.' };

  try {
    await pool.query('INSERT INTO suppliers(name, contact_info) VALUES($1, $2)', [name, contact_info]);
    revalidatePath('/suppliers');
    return { success: true };
  } catch (error) {
    console.error('Greška pri unosu dobavljača:', error);
    return { error: 'Dogodila se greška pri unosu.' };
  }
}

export async function deleteSupplier(formData) {
  const id = formData.get('id');
  try {
    await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
    revalidatePath('/suppliers');
    return { success: true };
  } catch (error) {
    return { error: 'Dobavljač se možda već koristi u nabavkama.' };
  }
}
