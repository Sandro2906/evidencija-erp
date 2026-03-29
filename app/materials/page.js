import { getMaterials, addMaterial, deleteMaterial, updateMaterialStock } from '@/lib/actions/materialActions';

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Materijali (Repromaterijal)</h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Dodaj Novi Materijal</h2>
        <form action={addMaterial} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Naziv</label>
            <input type="text" name="name" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Jedinica (npr. kg, l)</label>
            <input type="text" name="unit_of_measure" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Min Zaliha</label>
            <input type="number" step="0.01" name="min_stock" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Nabavna Cijena</label>
            <input type="number" step="0.01" name="purchase_price" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Sacuvaj
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Ručna Korekcija Stanja Sirovine</h2>
        <form action={updateMaterialStock} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Sirovina</label>
            <input type="text" name="material_name" list="materials-list-corr" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Upišite naziv..." />
            <datalist id="materials-list-corr">
              {materials.map(m => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Novo Stanje</label>
            <input type="number" step="0.01" name="new_stock" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-yellow-600 text-white rounded-md p-2 font-medium hover:bg-yellow-700 transition">
              Ažuriraj stanje
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Naziv</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stanje</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Min Zaliha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cijena</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {materials.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-slate-400">
                  Trenutno nema materijala u bazi, ili sa njom nismo spojeni. (Provjerite .env)
                </td>
              </tr>
            ) : (
              materials.map((mat) => (
                <tr key={mat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{mat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{mat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    <span className={mat.stock_quantity <= mat.min_stock ? 'text-red-500 font-bold' : ''}>
                      {mat.stock_quantity} {mat.unit_of_measure}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{mat.min_stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{mat.purchase_price} KM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteMaterial}>
                      <input type="hidden" name="id" value={mat.id} />
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
