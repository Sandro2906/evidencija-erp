'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  try {
    const res = await pool.query('SELECT * FROM products ORDER BY name ASC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function addProduct(formData) {
  const name = formData.get('name');
  const selling_price = parseFloat(formData.get('selling_price') || 0);

  if (!name) return { error: 'Naziv proizvoda je obavezan.' };

  try {
    await pool.query('INSERT INTO products(name, selling_price) VALUES($1, $2)', [name, selling_price]);
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Greška pri unosu proizvoda:', error);
    return { error: 'Dogodila se greška pri unosu.' };
  }
}

export async function deleteProduct(formData) {
  const id = formData.get('id');
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    return { error: 'Proizvod se ne može obrisati (verovatno postoje normativi ili radni nalozi vezani za njega).' };
  }
}

export async function updateProductStock(formData) {
  const product_name = formData.get('product_name')?.toString().trim();
  const new_stock = parseFloat(formData.get('new_stock'));

  if (!product_name || !new_stock && new_stock !== 0) {
    return { error: 'Nedostaju obavezni podaci za ažuriranje.' };
  }

  try {
    await pool.query('UPDATE products SET stock_quantity = $1 WHERE name = $2', [new_stock, product_name]);
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Greška pri ažuriranju zaliha:', error);
    return { error: 'Dogodila se greška pri promeni stanja.' };
  }
}
