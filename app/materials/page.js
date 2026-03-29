import { getMaterials, addMaterial, deleteMaterial } from '@/lib/actions/materialActions';

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Materijali (Repromaterijal)</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Dodaj Novi Materijal</h2>
        <form action={addMaterial} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Naziv</label>
            <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jedinica (npr. kg, l)</label>
            <input type="text" name="unit_of_measure" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Zaliha</label>
            <input type="number" step="0.01" name="min_stock" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" defaultValue="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nabavna Cijena</label>
            <input type="number" step="0.01" name="purchase_price" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" defaultValue="0" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Sacuvaj
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stanje</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Zaliha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cijena</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  Trenutno nema materijala u bazi, ili sa njom nismo spojeni. (Provjerite .env)
                </td>
              </tr>
            ) : (
              materials.map((mat) => (
                <tr key={mat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={mat.stock_quantity <= mat.min_stock ? 'text-red-500 font-bold' : ''}>
                      {mat.stock_quantity} {mat.unit_of_measure}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.min_stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.purchase_price} KM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteMaterial}>
                      <input type="hidden" name="id" value={mat.id} />
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
