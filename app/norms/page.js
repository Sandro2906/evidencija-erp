import { getNorms, addNorm, deleteNorm } from '@/lib/actions/normActions';
import { getMaterials } from '@/lib/actions/materialActions';
import { getProducts } from '@/lib/actions/productActions';

export default async function NormsPage() {
  const norms = await getNorms();
  const products = await getProducts();
  const materials = await getMaterials();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Normativi (Recepture)</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Poveži Proizvod sa Materijalom</h2>
        <form action={addNorm} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Proizvod</label>
            <select name="product_id" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite Proizvod --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Materijal u Sastavu</label>
            <select name="material_id" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite Materijal --</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.unit_of_measure})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Potrebna Količina za 1kom</label>
            <input type="number" step="0.001" name="quantity_required" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" defaultValue="1" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Dodaj Normativ
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proizvod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materijal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utrošak / 1 kom</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {norms.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Nema definisanih normativa.</td>
              </tr>
            ) : (
              norms.map((n) => (
                <tr key={n.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{n.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{n.material_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{n.quantity_required} {n.unit_of_measure}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteNorm}>
                      <input type="hidden" name="id" value={n.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900">Obriši</button>
                    </form>
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
