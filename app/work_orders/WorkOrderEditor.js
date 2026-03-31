'use client';

import { useState, useEffect } from 'react';
import { saveNewDocument, updateDocument, getAllDocuments, deleteDocument } from '@/lib/actions/documentActions';

export default function WorkOrderEditor() {
  const defaultForm = {
    narucitelj: '',
    narudzbenicaBroj: '',
    datumMjesecDan: '',
    datumGodina: '',
    radZapocet: '',
    radZavrsen: '',
    radniNalogBroj: '',
    mjestoTroska: '',
    nositeljTroska: '',
    ispostavio: '',
    items: []
  };

  const [formData, setFormData] = useState(defaultForm);
  const [currentDocId, setCurrentDocId] = useState(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    fetchArchive();
  }, []);

  const fetchArchive = async () => {
    const docs = await getAllDocuments();
    setArchive(docs);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), naziv: '', kolicina: '', jm: 'kom' }]
    }));
  };

  const removeItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleSaveNew = async () => {
    setIsLoading(true);
    const res = await saveNewDocument(formData);
    setIsLoading(false);
    if (res.success) {
      setCurrentDocId(res.id);
      fetchArchive();
      alert('Sačuvan kao potpuno novi nalog u arhivu!');
    } else {
      alert('Greška: ' + res.error);
    }
  };

  const handleUpdate = async () => {
    if (!currentDocId) return;
    setIsLoading(true);
    const res = await updateDocument(currentDocId, formData);
    setIsLoading(false);
    if (res.success) {
      fetchArchive();
      alert('Nalog je uspješno izmijenjen i sačuvan!');
    } else {
      alert('Greška: ' + res.error);
    }
  };

  const loadFromArchive = (doc) => {
    setFormData(doc.payload);
    setCurrentDocId(doc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(!confirm('Da li ste sigurni da želite obrisati ovaj sačuvani nalog?')) return;
    const res = await deleteDocument(id);
    if(res.success) {
      fetchArchive();
      if(currentDocId === id) {
        setFormData(defaultForm);
        setCurrentDocId(null);
      }
    }
  };

  const startNew = () => {
    setFormData(defaultForm);
    setCurrentDocId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-12">
      
      {/* GLAVNI EDITOR */}
      <div className="w-full">
        {/* Kontrole koje se ne stampaju */}
        <div className="mb-8 p-4 bg-slate-800 rounded-xl shadow-sm border border-slate-700 flex flex-wrap gap-4 items-center justify-between print:hidden">
          <div>
            <h2 className="text-xl font-bold text-white">Prilagođeni Obrazac Naloga</h2>
            <p className="text-slate-400 text-sm">
              {currentDocId 
                ? `Prikazujete sačuvan nalog (ID: ${currentDocId})` 
                : 'Pravite potpuno novi ne-sačuvani nalog'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={startNew} disabled={isLoading} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white rounded-lg transition text-sm">
              + Isprazni / Novi Nalog
            </button>

            {currentDocId && (
              <button onClick={handleUpdate} disabled={isLoading} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition shadow-sm font-medium">
                {isLoading ? '...' : 'Ažuriraj postojeći'}
              </button>
            )}

            <button onClick={handleSaveNew} disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-sm font-medium">
              {isLoading ? '...' : (currentDocId ? 'Sačuvaj kao novi duplikat' : 'Sačuvaj u arhivu')}
            </button>
            
            <button onClick={handlePrint} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Štampaj
            </button>
          </div>
        </div>

        {/* Papir (Dokument) */}
        <div className="bg-white text-black p-[1cm] md:p-[2cm] min-h-[29.7cm] shadow-2xl mx-auto print:shadow-none print:m-0 print:p-0 w-full [color-adjust:exact] [-webkit-print-color-adjust:exact]" style={{ maxWidth: '21cm' }}>
          
          {/* Zaglavlje: Red 1 */}
          <div className="flex border-2 border-black mb-4">
            <div className="w-[60%] border-r-2 border-black">
              <div className="bg-slate-200 text-center font-bold text-sm border-b-2 border-black py-1 print:bg-slate-200">
                TVRTKA
              </div>
              <div className="p-2 leading-tight">
                <h2 className="text-2xl font-black">S.P. BLAGOJEVIĆ</h2>
                <p className="font-semibold text-sm">Mile Blagojević</p>
                <p className="text-sm">Poljavnice bb, Novi Grad 79220</p>
              </div>
              <div className="border-t-2 border-black p-2 flex items-center text-sm font-semibold">
                <span className="mr-2">Narudžbenica broj:</span>
                <input 
                  type="text" 
                  name="narudzbenicaBroj" 
                  value={formData.narudzbenicaBroj} 
                  onChange={handleChange}
                  className="flex-grow border-b border-gray-400 focus:outline-none print:border-none print:p-0 bg-transparent"
                />
              </div>
            </div>
            <div className="w-[40%]">
              <div className="bg-slate-200 text-center font-bold text-sm border-b-2 border-black py-1 print:bg-slate-200">
                NARUČITELJ
              </div>
              <div className="p-2 h-full">
                <textarea 
                  name="narucitelj"
                  value={formData.narucitelj}
                  onChange={handleChange}
                  className="w-full h-full resize-none focus:outline-none print:border-none print:p-0 bg-transparent text-lg font-bold"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Mesto i datum */}
          <div className="border-2 border-black py-2 px-3 mb-4 flex justify-between items-center text-sm font-medium">
            <div className="flex items-center gap-2">
              <span>U </span>
              <span className="inline-block px-1 w-24 border-b border-gray-400 text-center print:border-none">Novom Gradu</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                name="datumMjesecDan" 
                value={formData.datumMjesecDan} 
                onChange={handleChange}
                className="w-32 border-b border-gray-400 focus:outline-none text-center print:border-none bg-transparent"
                placeholder="dan/mjesec"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                name="datumGodina" 
                value={formData.datumGodina} 
                onChange={handleChange}
                className="w-16 border-b border-gray-400 focus:outline-none text-center print:border-none bg-transparent"
                placeholder="godina"
              />
              <span>god.</span>
            </div>
          </div>

          {/* Rad zapocet / zavrsen */}
          <div className="flex border-2 border-black mb-4">
            <div className="w-1/2 border-r-2 border-black p-2 flex items-center text-sm font-semibold">
              <span className="mr-2">Rad započet:</span>
              <input 
                type="text" 
                name="radZapocet" 
                value={formData.radZapocet} 
                onChange={handleChange}
                className="flex-grow border-b border-gray-400 focus:outline-none text-center print:border-none bg-transparent"
              />
            </div>
            <div className="w-1/2 p-2 flex items-center text-sm font-semibold">
              <span className="mr-2">Rad završen:</span>
              <input 
                type="text" 
                name="radZavrsen" 
                value={formData.radZavrsen} 
                onChange={handleChange}
                className="flex-grow border-b border-gray-400 focus:outline-none text-center print:border-none bg-transparent"
              />
            </div>
          </div>

          {/* Naslov RADNI NALOG */}
          <div className="flex border-2 border-black mb-4 h-12">
            <div className="bg-indigo-400 text-white w-[70%] flex items-center justify-center print:bg-slate-300 print:text-black">
               <h1 className="text-2xl font-black uppercase tracking-widest">Radni Nalog</h1>
            </div>
            <div className="w-[30%] bg-indigo-300 flex items-center justify-center font-bold print:bg-slate-200">
               <span className="text-xl mr-2">br.</span>
               <input 
                  type="text" 
                  name="radniNalogBroj" 
                  value={formData.radniNalogBroj} 
                  onChange={handleChange}
                  className="w-20 bg-transparent border-b border-indigo-500 focus:outline-none text-lg text-center print:border-none print:text-black"
               />
            </div>
          </div>

          {/* Troskovi */}
          <div className="space-y-2 mb-4">
            <div className="border border-black p-2 flex text-sm font-semibold">
               <span className="w-32">Mjesto troška:</span>
               <input 
                  type="text" 
                  name="mjestoTroska" 
                  value={formData.mjestoTroska} 
                  onChange={handleChange}
                  className="flex-grow border-b border-gray-400 focus:outline-none bg-transparent print:border-none"
               />
            </div>
            <div className="border border-black p-2 flex text-sm font-semibold">
               <span className="w-32">Nositelj troška:</span>
               <input 
                  type="text" 
                  name="nositeljTroska" 
                  value={formData.nositeljTroska} 
                  onChange={handleChange}
                  className="flex-grow border-b border-gray-400 focus:outline-none bg-transparent print:border-none"
               />
            </div>
          </div>

          {/* Opis rada - Lista */}
          <div className="border border-black min-h-[300px] p-4 flex flex-col relative text-sm">
            <div className="font-semibold mb-4 text-gray-700">Opis rada:</div>
            
            <div className="flex-grow">
              {formData.items.length === 0 ? (
                <div className="text-gray-400 italic print:hidden text-center mt-10">
                  Nema unesenih stavki. Kliknite "Dodaj stavku" za unos.
                </div>
              ) : (
                <table className="w-full text-left table-fixed">
                  <colgroup>
                    <col className="w-[70%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                    <col className="w-10 print:hidden" />
                  </colgroup>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="group hover:bg-gray-50 print:hover:bg-transparent">
                        <td className="py-1 pr-2 uppercase font-medium">
                          <input 
                            type="text" 
                            value={item.naziv} 
                            onChange={(e) => handleItemChange(item.id, 'naziv', e.target.value)}
                            className="w-full focus:outline-none bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 print:border-none uppercase"
                            placeholder="NAZIV STAVKE..."
                          />
                        </td>
                        <td className="py-1 px-2 text-right">
                          <input 
                            type="number" 
                            value={item.kolicina} 
                            onChange={(e) => handleItemChange(item.id, 'kolicina', e.target.value)}
                            className="w-full focus:outline-none bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 print:border-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input 
                            type="text" 
                            value={item.jm} 
                            onChange={(e) => handleItemChange(item.id, 'jm', e.target.value)}
                            className="w-full focus:outline-none bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 print:border-none lowercase"
                          />
                        </td>
                        <td className="print:hidden text-right">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition px-2"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-4 print:hidden">
              <button 
                onClick={addItem}
                className="text-indigo-600 font-medium text-sm hover:text-indigo-800 flex items-center gap-1"
              >
                + Dodaj stavku
              </button>
            </div>

            <div className="mt-16 mr-8 flex justify-end">
              <div className="text-center w-48">
                <div className="text-xs text-gray-500 mb-1">Ispostavio:</div>
                <input 
                    type="text" 
                    name="ispostavio" 
                    value={formData.ispostavio} 
                    onChange={handleChange}
                    className="w-full border-b border-gray-400 focus:outline-none text-center bg-transparent print:border-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ARHIVA SAČUVANIH (LISTA) */}
      <div className="max-w-5xl mx-auto pt-8 border-t border-slate-700 print:hidden">
        <h2 className="text-2xl font-bold text-white mb-4">Arhiva Sačuvanih PDF Obrazaca (Baza)</h2>
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
          {archive.length === 0 ? (
            <div className="p-6 text-slate-400 text-center">Dodajte i sačuvajte novi nalog da bi se ovdje pojavio.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID Baze</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Broj Naloga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Naručitelj</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Datum Unosa/Izmjene</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {archive.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">#{doc.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      {doc.payload?.radniNalogBroj || 'Bez broja'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate">
                      {doc.payload?.narucitelj || 'Nepoznat'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(doc.updated_at).toLocaleString('sr')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                       <button onClick={() => loadFromArchive(doc)} className="text-blue-500 hover:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-md transition">
                         Otvori za štampu
                       </button>
                       <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md transition">
                         Obriši
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
