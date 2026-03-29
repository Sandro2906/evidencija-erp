'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getPurchases() {
  try {
    const res = await pool.query(`
      SELECT me.*, m.name as material_name, m.unit_of_measure, s.name as supplier_name
      FROM material_entries me
      JOIN materials m ON me.material_id = m.id
      LEFT JOIN suppliers s ON me.supplier_id = s.id
      ORDER BY me.entry_date DESC
    `);
    return res.rows;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return [];
  }
}

export async function addPurchase(formData) {
  const material_id = formData.get('material_id');
  const supplier_id = formData.get('supplier_id') || null;
  const quantity = parseFloat(formData.get('quantity'));
  const price_per_unit = parseFloat(formData.get('price_per_unit'));

  if (!material_id || isNaN(quantity) || isNaN(price_per_unit)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query('BEGIN');
    
    // 1. Upis u istoriju nabavke
    await pool.query(
      'INSERT INTO material_entries(material_id, supplier_id, quantity, price_per_unit) VALUES($1, $2, $3, $4)',
      [material_id, supplier_id, quantity, price_per_unit]
    );

    // 2. Azuriranje kolicine na stanju
    await pool.query(
      'UPDATE materials SET stock_quantity = stock_quantity + $1 WHERE id = $2',
      [quantity, material_id]
    );

    await pool.query('COMMIT');
    revalidatePath('/purchases');
    revalidatePath('/materials');
    return { success: true };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Greška pri unosu nabavke:', error);
    return { error: 'Dogodila se greška pri nabavci.' };
  }
}
