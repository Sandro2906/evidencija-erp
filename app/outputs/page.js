import { getOutputs, addOutput } from '@/lib/actions/outputActions';
import { getProducts } from '@/lib/actions/productActions';

export default async function OutputsPage() {
  const outputs = await getOutputs();
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Izlaz Gotove Robe</h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Evidentiraj Izlaz (Prodaja / Otpis)</h2>
        <form action={addOutput} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Proizvod</label>
            <select name="product_id" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stanje: {p.stock_quantity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Vrsta Izlaza</label>
            <select name="output_type" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="">-- Izaberite --</option>
              <option value="sale">Prodaja</option>
              <option value="waste">Otpis / Kvar</option>
              <option value="promo">Promocija</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Količina</label>
            <input type="number" step="0.01" name="quantity" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Zabilježi
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Proizvod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Vrsta Izlaza</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Količina</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {outputs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-400">Nema evidentiranih izlaza robe.</td>
              </tr>
            ) : (
              outputs.map((o) => (
                <tr key={o.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(o.output_date).toLocaleDateString('sr')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{o.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {o.output_type === 'sale' && <span className="text-green-500 font-semibold">Prodaja</span>}
                    {o.output_type === 'waste' && <span className="text-red-500 font-semibold">Otpis</span>}
                    {o.output_type === 'promo' && <span className="text-blue-500 font-semibold">Promocija</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-white">{o.quantity} kom</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
