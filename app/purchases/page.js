import { getPurchases, addPurchase } from '@/lib/actions/purchaseActions';
import { getMaterials } from '@/lib/actions/materialActions';
import { getSuppliers } from '@/lib/actions/supplierActions';

export default async function PurchasesPage() {
  const purchases = await getPurchases();
  const materials = await getMaterials();
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nabavka (Ulaz Materijala)</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Evidentiraj Novu Nabavku</h2>
        <form action={addPurchase} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Materijal</label>
            <select name="material_id" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite --</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.unit_of_measure})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dobavljač (opciono)</label>
            <select name="supplier_id" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Ignoriši --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Količina</label>
            <input type="number" step="0.01" name="quantity" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" defaultValue="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cijena po jedinici (KM)</label>
            <input type="number" step="0.01" name="price_per_unit" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" defaultValue="0" />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white rounded-md px-6 py-2 font-medium hover:bg-blue-700 transition">
              Zabilježi Nabavku
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materijal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dobavljač</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Količina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cijena (j.m.)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ukupno</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Nema evidentiranih nabavki.</td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.entry_date).toLocaleDateString('sr')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.material_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.supplier_name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{p.quantity} {p.unit_of_measure}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.price_per_unit} KM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    {(p.quantity * p.price_per_unit).toFixed(2)} KM
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
