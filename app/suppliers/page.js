import { getSuppliers, addSupplier, deleteSupplier } from '@/lib/actions/supplierActions';

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dobavljači</h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Dodaj Novog Dobavljača</h2>
        <form action={addSupplier} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Naziv Kompanije</label>
            <input type="text" name="name" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Kontakt Podaci (Email/Telefon)</label>
            <input type="text" name="contact_info" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Sačuvaj Dobavljača
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Naziv</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Kontakt</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-slate-400">Nema dobavljača trenutno.</td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{s.contact_info || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteSupplier}>
                      <input type="hidden" name="id" value={s.id} />
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
