'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getWorkOrders() {
  try {
    const res = await pool.query(`
      SELECT wo.*, p.name as product_name
      FROM work_orders wo
      JOIN products p ON wo.product_id = p.id
      ORDER BY wo.created_at DESC
    `);
    return res.rows;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return [];
  }
}

export async function addWorkOrder(formData) {
  const product_id = formData.get('product_id');
  const quantity_to_produce = parseFloat(formData.get('quantity_to_produce'));

  if (!product_id || isNaN(quantity_to_produce)) {
    return { error: 'Nedostaju obavezni podaci.' };
  }

  try {
    await pool.query(
      "INSERT INTO work_orders(product_id, quantity_to_produce, status) VALUES($1, $2, 'open')",
      [product_id, quantity_to_produce]
    );
    revalidatePath('/work_orders');
    return { success: true };
  } catch (error) {
    return { error: 'Greška pri kreiranju naloga.' };
  }
}

export async function completeWorkOrder(formData) {
  const id = formData.get('id');

  try {
    await pool.query('BEGIN');

    // Uzmi podatke o nalogu
    const woRes = await pool.query('SELECT * FROM work_orders WHERE id = $1', [id]);
    const wo = woRes.rows[0];

    if (!wo || wo.status === 'completed') {
      await pool.query('ROLLBACK');
      return { error: 'Nalog ne postoji ili je već završen.' };
    }

    // Nadji normativ
    const normsRes = await pool.query('SELECT * FROM product_norms WHERE product_id = $1', [wo.product_id]);
    const norms = normsRes.rows;

    // Za svaki normativ, smanji stanje materijala
    for (const norm of norms) {
      const requiredMat = norm.quantity_required * wo.quantity_to_produce;
      await pool.query(
        'UPDATE materials SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [requiredMat, norm.material_id]
      );
    }

    // Povećaj stanje proizvoda
    await pool.query(
      'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
      [wo.quantity_to_produce, wo.product_id]
    );

    // Zatvori nalog
    await pool.query(
      "UPDATE work_orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    await pool.query('COMMIT');
    revalidatePath('/work_orders');
    return { success: true };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Greška pri završetku naloga:', error);
    return { error: 'Nije moguće završiti nalog (proverite da li imate definisane normative).' };
  }
}

export async function cancelWorkOrder(formData) {
  const id = formData.get('id');
  try {
    await pool.query("UPDATE work_orders SET status = 'canceled' WHERE id = $1 AND status = 'open'", [id]);
    revalidatePath('/work_orders');
    return { success: true };
  } catch (error) {
    return { error: 'Nemoguće otkazati nalog.' };
  }
}
