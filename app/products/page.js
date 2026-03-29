import { getProducts, addProduct, deleteProduct, updateProductStock } from '@/lib/actions/productActions';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Proizvodi</h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Dodaj Novi Proizvod</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Naziv Proizvoda</label>
            <input type="text" name="name" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Prodajna Cijena (KM)</label>
            <input type="number" step="0.01" name="selling_price" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-medium hover:bg-blue-700 transition">
              Sačuvaj Proizvod
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Ručna Korekcija Stanja Zaliha</h2>
        <form action={updateProductStock} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Proizvod</label>
            <input type="text" name="product_name" list="products-list-corr" required className="text-black bg-slate-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Npr. Sto, Stolica..." />
            <datalist id="products-list-corr">
              {products.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Novo Stanje (kom)</label>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Prodajna Cijena</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stanje Skladišta</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-400">Nema proizvoda u bazi.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{p.selling_price} KM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-bold">{p.stock_quantity} kom</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
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
