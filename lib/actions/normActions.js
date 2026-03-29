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
  const product_name = formData.get('product_name')?.toString().trim();
  const material_name = formData.get('material_name')?.toString().trim();
  const quantity_required = parseFloat(formData.get('quantity_required'));

  if (!product_name || !material_name || isNaN(quantity_required)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query('BEGIN');

    // Find or create product
    let productRes = await pool.query('SELECT id FROM products WHERE name = $1', [product_name]);
    let product_id;
    if (productRes.rows.length === 0) {
      const insertProd = await pool.query(
        'INSERT INTO products (name, stock_quantity, selling_price) VALUES ($1, 0, 0) RETURNING id',
        [product_name]
      );
      product_id = insertProd.rows[0].id;
    } else {
      product_id = productRes.rows[0].id;
    }

    // Find or create material
    let materialRes = await pool.query('SELECT id FROM materials WHERE name = $1', [material_name]);
    let material_id;
    if (materialRes.rows.length === 0) {
      const insertMat = await pool.query(
        'INSERT INTO materials (name, unit_of_measure, stock_quantity) VALUES ($1, $2, 0) RETURNING id',
        [material_name, 'kom']
      );
      material_id = insertMat.rows[0].id;
    } else {
      material_id = materialRes.rows[0].id;
    }

    await pool.query(
      'INSERT INTO product_norms(product_id, material_id, quantity_required) VALUES($1, $2, $3)',
      [product_id, material_id, quantity_required]
    );
    
    await pool.query('COMMIT');
    revalidatePath('/norms');
    return { success: true };
  } catch (error) {
    await pool.query('ROLLBACK');
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
