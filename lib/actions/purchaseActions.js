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
  const material_name = formData.get('material_name')?.toString().trim();
  const supplier_name = formData.get('supplier_name')?.toString().trim();
  const quantity = parseFloat(formData.get('quantity'));
  const price_per_unit = parseFloat(formData.get('price_per_unit'));

  if (!material_name || isNaN(quantity) || isNaN(price_per_unit)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query('BEGIN');
    
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

    // Find or create supplier
    let supplier_id = null;
    if (supplier_name) {
      let suppRes = await pool.query('SELECT id FROM suppliers WHERE name = $1', [supplier_name]);
      if (suppRes.rows.length === 0) {
        const insertSupp = await pool.query(
          'INSERT INTO suppliers (name) VALUES ($1) RETURNING id',
          [supplier_name]
        );
        supplier_id = insertSupp.rows[0].id;
      } else {
        supplier_id = suppRes.rows[0].id;
      }
    }
    
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
