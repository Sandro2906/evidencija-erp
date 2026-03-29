'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getNorms() {
  try {
    const res = await pool.query(`
      SELECT pn.*, p.name as product_name, m.name as material_name, m.unit_of_measure
      FROM product_norms pn
      JOIN products p ON pn.product_id = p.id
      JOIN materials m ON pn.material_id = m.id
      ORDER BY p.name ASC, m.name ASC
    `);
    return res.rows;
  } catch (error) {
    console.error('Error fetching norms:', error);
    return [];
  }
}

export async function addNorm(formData) {
  const product_id = formData.get('product_id');
  const material_id = formData.get('material_id');
  const quantity_required = parseFloat(formData.get('quantity_required'));

  if (!product_id || !material_id || isNaN(quantity_required)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query(
      'INSERT INTO product_norms(product_id, material_id, quantity_required) VALUES($1, $2, $3)',
      [product_id, material_id, quantity_required]
    );
    revalidatePath('/norms');
    return { success: true };
  } catch (error) {
    console.error('Greška pri unosu normativa:', error);
    return { error: 'Normativ verovatno već postoji za ovaj spoj proizvoda i materijala.' };
  }
}

export async function deleteNorm(formData) {
  const id = formData.get('id');
  try {
    await pool.query('DELETE FROM product_norms WHERE id = $1', [id]);
    revalidatePath('/norms');
    return { success: true };
  } catch (error) {
    return { error: 'Dogodila se greška pri brisanju.' };
  }
}
