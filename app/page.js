import { Box, Factory, Target, TriangleAlert } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Aktivni Radni Nalozi</p>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Factory size={24} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Gotova Roba</p>
            <p className="text-3xl font-bold mt-2">120 <span className="text-sm font-normal text-gray-500">kom</span></p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Box size={24} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Repromaterijali</p>
            <p className="text-3xl font-bold mt-2">45</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Target size={24} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ispod Minimuma</p>
            <p className="text-3xl font-bold mt-2 text-rose-600">3</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <TriangleAlert size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Nedavne Aktivnosti</h2>
        <div className="text-gray-500 text-sm py-4">Sistem nema dovoljno podataka za prikaz grafika. (Potrebno povezati sa bazom)</div>
      </div>
    </div>
  );
}
