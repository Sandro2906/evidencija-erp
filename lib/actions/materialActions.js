'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getMaterials() {
  try {
    const res = await pool.query('SELECT * FROM materials ORDER BY name ASC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
}

export async function addMaterial(formData) {
  const name = formData.get('name');
  const unit_of_measure = formData.get('unit_of_measure');
  const min_stock = parseFloat(formData.get('min_stock') || 0);
  const purchase_price = parseFloat(formData.get('purchase_price') || 0);

  if (!name || !unit_of_measure) return { error: 'Nedostaju obavezni podaci' };

  try {
    const text = 'INSERT INTO materials(name, unit_of_measure, min_stock, purchase_price) VALUES($1, $2, $3, $4)';
    const values = [name, unit_of_measure, min_stock, purchase_price];
    
    await pool.query(text, values);
    revalidatePath('/materials');
    return { success: true };
  } catch (error) {
    console.error('Greška pri dodavanju materijala', error);
    return { error: 'Dogodila se greška pri unosu.' };
  }
}

export async function deleteMaterial(formData) {
  const id = formData.get('id');

  try {
    await pool.query('DELETE FROM materials WHERE id = $1', [id]);
    revalidatePath('/materials');
    return { success: true };
  } catch (error) {
    console.error('Greška pri brisanju:', error);
    return { error: 'Ovaj materijal se možda već koristi u normativima ili nabavci.' };
  }
}

export async function updateMaterialStock(formData) {
  const material_name = formData.get('material_name')?.toString().trim();
  const new_stock = parseFloat(formData.get('new_stock'));

  if (!material_name || !new_stock && new_stock !== 0) {
    return { error: 'Nedostaju obavezni podaci za ažuriranje.' };
  }

  try {
    await pool.query('UPDATE materials SET stock_quantity = $1 WHERE name = $2', [new_stock, material_name]);
    revalidatePath('/materials');
    return { success: true };
  } catch (error) {
    console.error('Greška pri ažuriranju zaliha:', error);
    return { error: 'Dogodila se greška pri promeni stanja.' };
  }
}
