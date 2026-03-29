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
  const product_name = formData.get('product_name')?.toString().trim();
  const quantity = parseFloat(formData.get('quantity'));
  const output_type = formData.get('output_type') || 'sale';
  const output_date = formData.get('output_date') || new Date().toISOString();

  if (!product_name || isNaN(quantity)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query('BEGIN');

    // Find product
    const prodRes = await pool.query('SELECT id, stock_quantity FROM products WHERE name = $1', [product_name]);
    let p = prodRes.rows[0];
    let product_id;

    if (!p) {
        // Kreiramo ga na 0
        const insertProd = await pool.query(
          'INSERT INTO products (name, stock_quantity, selling_price) VALUES ($1, 0, 0) RETURNING id, stock_quantity',
          [product_name]
        );
        p = insertProd.rows[0];
        product_id = p.id;
    } else {
        product_id = p.id;
    }

    if (p.stock_quantity < quantity) {
        await pool.query('ROLLBACK');
        return { error: `Nema dovoljno gotovih proizvoda '${product_name}' na skladištu! Trenutno stanje: ${p.stock_quantity}` };
    }

    // 1. Evidentiraj izlaz
    await pool.query(
      "INSERT INTO product_outputs(product_id, quantity, output_type, output_date) VALUES($1, $2, $3, $4)",
      [product_id, quantity, output_type, output_date]
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
