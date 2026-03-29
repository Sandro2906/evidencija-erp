'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getOutputs() {
  try {
    const res = await pool.query(`
      SELECT po.*, p.name as product_name
      FROM product_outputs po
      JOIN products p ON po.product_id = p.id
      ORDER BY po.output_date DESC
    `);
    return res.rows;
  } catch (error) {
    console.error('Error fetching outputs:', error);
    return [];
  }
}

export async function addOutput(formData) {
  const product_id = formData.get('product_id');
  const quantity = parseFloat(formData.get('quantity'));
  const output_type = formData.get('output_type') || 'sale';

  if (!product_id || isNaN(quantity)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query('BEGIN');

    // Uzmi trenutno stanje proizvoda
    const prodRes = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [product_id]);
    const p = prodRes.rows[0];

    if (!p) {
        await pool.query('ROLLBACK');
        return { error: 'Proizvod ne postoji.' };
    }

    if (p.stock_quantity < quantity) {
        await pool.query('ROLLBACK');
        return { error: 'Nema dovoljno gotovih proizvoda na skladištu!' };
    }

    // 1. Evidentiraj izlaz
    await pool.query(
      "INSERT INTO product_outputs(product_id, quantity, output_type) VALUES($1, $2, $3)",
      [product_id, quantity, output_type]
    );

    // 2. Smanji zalihe gotove robe
    await pool.query(
      'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
      [quantity, product_id]
    );

    await pool.query('COMMIT');
    revalidatePath('/outputs');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    await pool.query('ROLLBACK');
    return { error: 'Greška pri evidentiranju izlaza.' };
  }
}
