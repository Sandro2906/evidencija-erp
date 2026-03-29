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
        <h1 className="text-2xl font-bold text-white">Normativi (Recepture)</h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Poveži Proizvod sa Materijalom</h2>
        <form action={addNorm} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Proizvod</label>
            <select name="product_id" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite Proizvod --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Materijal u Sastavu</label>
            <select name="material_id" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite Materijal --</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.unit_of_measure})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Potrebna Količina za 1kom</label>
            <input type="number" step="0.001" name="quantity_required" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Dodaj Normativ
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Proizvod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Materijal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Utrošak / 1 kom</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {norms.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-400">Nema definisanih normativa.</td>
              </tr>
            ) : (
              norms.map((n) => (
                <tr key={n.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{n.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{n.material_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{n.quantity_required} {n.unit_of_measure}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteNorm}>
                      <input type="hidden" name="id" value={n.id} />
                      <button type="submit" className="text-red-400 hover:text-red-300">Obriši</button>
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
