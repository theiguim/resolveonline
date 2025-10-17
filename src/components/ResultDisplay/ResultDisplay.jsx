// src/components/ResultDisplay/ResultDisplay.jsx
// Componente de Exibição de Resultado Padrão (com CTA WhatsApp)

import React from 'react';
import "./ResultDisplay.css";

export default function ResultDisplay({ title, content, ctaText, checklist, disclaimer, expenses, serviceType }) {
  // Garantir que arrays não sejam nulos
  const contentArray = Array.isArray(content) ? content : (content ? [content] : []);
  const checklistArray = Array.isArray(checklist) ? checklist : [];

  // Construção da mensagem do WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Olá! Vim do simulador de ${serviceType}. ${ctaText}`
  );

  const whatsappUrl = `https://wa.me/553299526526?text=${whatsappMessage}`;

  return (
    <div id="result-display" className="result-box" style={{ marginTop: '1.5rem' }}>
      
      {/* Título do Resultado */}
      <h4 className="res-title">{title}</h4>
      
      {/* Conteúdo Principal */}
      <div className="res-txt-content">
        {contentArray.map((p, index) => (
          <p 
            key={index}  
            className={p.includes('indenização') || p.includes('Recomendação') ? 'font-bold' : ''}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Despesas Informadas */}
      {expenses > 0 && (
        <p className="font-medium text-green-700 mt-3">
          Suas despesas informadas foram de: <strong>R$ {expenses.toFixed(2)}</strong>. Guarde todos os comprovantes!
        </p>
      )}

      {/* Checklist de Documentos */}
      {checklistArray.length > 0 && (
        <>
          <h5 className="font-semibold mt-4 text-gray-700">Checklist de Documentos Essenciais:</h5>
          <ul className="list-disc list-inside ml-2 text-sm text-gray-600">
            {checklistArray.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </>
      )}

      {/* Disclaimer/Aviso Legal */}
      {disclaimer && (
        <p className="res-aviso">{disclaimer}</p>
      )}

      {/* CTA WhatsApp */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <button className="btn-success" style={{ marginTop: "1rem" }}>
          {ctaText}
        </button>
      </a>
    </div>
  );
}
