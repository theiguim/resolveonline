// src/components/ResultDisplay/ResultDisplay.jsx
// Design System: Componente de Exibição de Resultado Padrão

import React from 'react';
import "./ResultDisplay.css"

// Estilos embutidos do seu HTML original foram mantidos, mas idealmente
// seriam migrados para classes Tailwind para total padronização.

export default function ResultDisplay({ title, content, ctaText, checklist, disclaimer, expenses }) {
  // Configurações básicas para garantir que os arrays não sejam nulos
  const contentArray = Array.isArray(content) ? content : (content ? [content] : []);
  const checklistArray = Array.isArray(checklist) ? checklist : [];

  return (
    <div id="result-display" className="result-box" style={{ marginTop: '1.5rem' }}>
      
      {/* Título do Resultado (ex: Seus Direitos Prováveis / Análise Indicativa) */}
      <h4 className="text-blue-800 font-semibold mb-3">{title}</h4>
      
      {/* Conteúdo Principal (Regras/Veredito) */}
      <div className="mb-4">
        {contentArray.map((p, index) => (
          // Mantendo estilos originais para parágrafos
          <p 
            key={index} 
            style={{ marginTop: '0.5rem' }} 
            // Destaque para indenização (do requisito Aéreo)
            className={p.includes('indenização') || p.includes('Recomendação') ? 'font-bold' : ''}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Seção Exclusiva Aéreo: Despesas Informadas (Requisito 4.2) */}
      {expenses > 0 && (
        <p className="font-medium text-green-700 mt-3">
          Suas despesas informadas foram de: <strong>R$ {expenses.toFixed(2)}</strong>. Guarde todos os comprovantes!
        </p>
      )}

      {/* Checklist de Documentos (Requisito 4.x) */}
      {checklistArray.length > 0 && (
        <>
          <h5 className="font-semibold mt-4 text-gray-700">Checklist de Documentos Essenciais:</h5>
          <ul className="list-disc list-inside ml-2 text-sm text-gray-600">
            {checklistArray.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </>
      )}

      {/* Disclaimer/Aviso Legal (Requisito 7 - LGPD & Segurança) */}
      {disclaimer && (
          <p className="mt-5 text-sm p-3 border-l-4 border-orange-500 bg-orange-100 text-orange-800">
              {disclaimer}
          </p>
      )}

      {/* CTA (Botão de Ação) */}
      <button className="btn-success mt-4" style={{ marginTop: "1rem" }}>{ctaText}</button>
    </div>
  );
}