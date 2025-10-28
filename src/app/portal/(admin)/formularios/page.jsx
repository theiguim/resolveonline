'use client';

import { useState, useEffect } from 'react';
// CORREÇÃO: Importamos a FUNÇÃO 'createClient'
import { createClient } from '@/lib/supabase/client';
import { X, Loader2 } from 'lucide-react';

// CORREÇÃO: Criamos a instância do cliente aqui
const supabase = createClient();

// Modal para exibir os dados JSON do formulário
function SubmissionModal({ submission, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detalhes: {submission.form_name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            <strong>ID:</strong> {submission.id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <strong>Recebido em:</strong> {new Date(submission.created_at).toLocaleString('pt-BR')}
          </p>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Dados Enviados:</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-200 overflow-x-auto">
            {JSON.stringify(submission.data, null, 2)}
          </pre>
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-right">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
           >
             Fechar
           </button>
        </div>
      </div>
    </div>
  );
}

export default function FormulariosPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // Formulário selecionado

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar formulários:', error.message);
      } else {
        setSubmissions(data);
      }
      setLoading(false);
    }

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-16 h-16 animate-spin text-medium-blue" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Formulários Recebidos
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome (se houver)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(sub.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {sub.form_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {sub.data.nome || sub.data.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowGrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelected(sub)}
                      className="text-medium-blue dark:text-blue-400 hover:text-hard-blue"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para ver detalhes do JSON */}
      {selected && (
        <SubmissionModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

