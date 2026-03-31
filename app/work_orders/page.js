import { getWorkOrders, addWorkOrder, completeWorkOrder, cancelWorkOrder } from '@/lib/actions/workOrderActions';
import { getProducts } from '@/lib/actions/productActions';
import WorkOrderEditor from './WorkOrderEditor';
import DeleteWorkOrderButton from './DeleteWorkOrderButton';

export default async function WorkOrdersPage() {
  const orders = await getWorkOrders();
  const products = await getProducts();

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Novi Prilagođeni Obrazac (Editor) */}
      <section>
        <WorkOrderEditor />
      </section>

      {/* 2. Stari Sistem Zaliha (Zadržan da se ne bi srušio inventory) */}
      <section className="max-w-5xl mx-auto space-y-6 pt-12 border-t border-slate-700 print:hidden">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-white">Interni Radni Nalozi (Zalihe)</h2>
          <p className="text-slate-400 text-sm">Ovdje se kreiraju kratki nalozi koji direktno oduzimaju materijale iz baze po normativu.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Kreiraj Interni Nalog</h3>
          <form action={addWorkOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Proizvod za Izradu</label>
              <input type="text" name="product_name" list="products-list" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Npr. Sto, Stolica..." />
              <datalist id="products-list">
                {products.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Količina (kom)</label>
              <input type="number" step="0.01" name="quantity_to_produce" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-slate-600 text-white rounded-md p-2 font-medium hover:bg-slate-500 transition">
                Kreiraj Interni Nalog
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Proizvod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Plan. Količina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Datum Kreiranja</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-slate-400">Nema internih radnih naloga.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{o.product_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{o.quantity_to_produce} kom</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {o.status === 'open' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Otvoren</span>}
                      {o.status === 'completed' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Završen</span>}
                      {o.status === 'canceled' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Otkazan</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(o.created_at).toLocaleDateString('sr')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {o.status === 'open' && (
                          <>
                            <form action={completeWorkOrder}>
                              <input type="hidden" name="id" value={o.id} />
                              <button type="submit" className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded">Završi</button>
                            </form>
                            <form action={cancelWorkOrder}>
                              <input type="hidden" name="id" value={o.id} />
                              <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded">Otkaži</button>
                            </form>
                          </>
                        )}
                        <DeleteWorkOrderButton id={o.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
