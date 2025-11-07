// ResultDisplay.jsx - AJUSTADO PARA USAR DADOS DA API

import React from "react";
import "./ResultDisplay.css";

export default function ResultDisplay({
    title,
    content,
    ctaText,
    checklist,
    disclaimer,
    extraMessage,
    whatsappUrl, // NOVO: URL do Wpp pronta
    urgenteUrl, // NOVO: URL urgente pronta
    protocol, // NOVO: Protocolo
    score, // NOVO: Score
}) {
    // ... (Lógica de arrays mantida)
    const contentArray = Array.isArray(content) ? content : content ? [content] : [];
    const checklistArray = Array.isArray(checklist) ? checklist : [];

    // REMOVIDA A FUNÇÃO gerarMensagem() E LÓGICA DE URLS

    return (
        <div id="result-display" className="result-box" style={{ marginTop: "1.5rem" }}>
            
            {/* NOVO: Exibe Protocolo e Score (Requisito 3 e 1) */}
            {(protocol || score) && (
                 <div className="protocol-info mb-3 p-3 bg-gray-100 border-l-4 border-blue-500 rounded">
                    {protocol && <p className="text-sm font-semibold">Protocolo: <span className="text-blue-700">{protocol}</span></p>}
                    {score && <p className="text-sm">Score de Prioridade: <span className="font-bold text-green-700">{score}</span></p>}
                </div>
            )}
            
            <h4 className="res-title">{title}</h4>

            {extraMessage && (
                <div className="extra-message mt-3 p-3 bg-blue-50 border-l-4 border-blue-700 rounded">
                    <p>{extraMessage}</p>
                </div>
            )}

            {/* ... (O restante do JSX de conteúdo e checklist é mantido) */}

            {/* CTAs usam as URLs prontas da API */}
            {ctaText && whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <button className="btn-success mt-4">{ctaText}</button>
                </a>
            )}

            {urgenteUrl && (
                <a href={urgenteUrl} target="_blank" rel="noopener noreferrer">
                    <button className="btn-danger mt-3">🚨 Meu caso é urgente</button>
                </a>
            )}
        </div>
    );
}