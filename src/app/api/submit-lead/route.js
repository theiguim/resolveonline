// app/api/submit-lead/route.js

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para IDs únicos
import nodemailer from 'nodemailer'; // Necessário para enviar e-mails (Lembre-se de instalar com npm install nodemailer)

// --- Configuração (Deve estar em variáveis de ambiente) ---
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
// CRÍTICO: E-mail para notificação interna (seu 'dashboard' por e-mail)
const EMAIL_ADMIN_NOTIFY = process.env.EMAIL_ADMIN_NOTIFY || 'seu.email.admin@resolveonline.com.br';
const WHATSAPP_NUMBER = '553184815969'; // Número do WhatsApp (para o CTA)

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.seuservidor.com", // Use variáveis de ambiente!
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // Use TLS
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// ====================================================
// 1. LÓGICA DE LEAD SCORING (Regras de Negócio)
// ====================================================
function calculateScore(serviceType, data) {
    const defaultScore = { score: 'B', eta: '24 horas úteis', title: 'Análise Padrão' };

    switch (serviceType.toLowerCase()) {
        case 'pix':
            const valor = parseFloat(data.valor) || 0;
            const diffDays = data.dataTransacao ? Math.floor(Math.abs(new Date() - new Date(data.dataTransacao)) / (1000 * 60 * 60 * 24)) : 999;

            // SCORE A: DENTRO DE 10 DIAS E ALTO VALOR (Requisito 4.1)
            if (diffDays <= 10 && valor >= 500 && data.erroTipo === 'Fui induzido ao erro (golpe)') {
                return { score: 'A', eta: '2 horas úteis', title: 'Excelente Notícia! Prioridade Máxima (MED Urgente)' };
            }
            // SCORE B: DENTRO DO PRAZO PADRÃO
            if (diffDays <= 80) {
                return { score: 'B', eta: '24 horas úteis', title: 'Boa notícia! Você está dentro do prazo.' };
            }
            // SCORE C: FORA DO PRAZO
            return { score: 'C', eta: '48 horas úteis', title: 'Atenção: Prazo formal expirado.' };

        case 'aereo':
            const horas = parseFloat(data.horas) || 0;
            const isInternacional = data.escopo === 'internacional';

            // SCORE A: DANO ALTO E INTERNACIONAL (ou 6h+)
            if (horas >= 6 && isInternacional) {
                return { score: 'A', eta: '2 horas úteis', title: 'Alta Probabilidade de Indenização (Prioridade Máxima)' };
            }
            // SCORE B: DANO MÉDIO/ALTO (Direito a Reacomodação/Hospedagem)
            if (horas >= 4) {
                return { score: 'B', eta: '24 horas úteis', title: 'Direitos de Reacomodação Confirmados.' };
            }
            // SCORE C: DANO BAIXO/MÉDIO
            return { score: 'C', eta: '48 horas úteis', title: 'Direitos básicos de assistência ou análise alternativa.' };


        case 'energia':
            const valorMedio = parseFloat(data.valorMedio) || 0;
            const tempoSemEnergia = parseFloat(data.tempoSemEnergia) || 0;
            const aparelhoQueimou = data.aparelhoQueimado === 'sim';
            const atrasoReligacao = parseFloat(data.tempoReligacao) || 0;

            // SCORE A: DANO MÁXIMO
            if (aparelhoQueimou || atrasoReligacao >= 3) {
                return { score: 'A', eta: '2 horas úteis', title: 'Dano Material Alto (Prioridade Máxima)' };
            }
            // SCORE B: DIC/FIC ALTO OU CONTA SUSPEITA
            if (tempoSemEnergia >= 24 || valorMedio >= 300) {
                return { score: 'B', eta: '24 horas úteis', title: 'Forte Indício de Compensação (DIC/FIC)' };
            }
            // SCORE C: INFORMATIVO
            return { score: 'C', eta: '48 horas úteis', title: 'Análise Indicativa (Baixa Prioridade)' };

        case 'saude':
            const isUrgente = data.urgencia === 'sim';
            const temDocs = data.documentosProntos === 'sim';
            const problemaTipo = data.problema;

            // SCORE A: CASO CRÍTICO E URGENTE
            if (isUrgente && (problemaTipo === 'negativa' || problemaTipo === 'cancelamento')) {
                return { score: 'A', eta: '2 horas úteis', title: 'Urgência Médica e Legal (Prioridade Máxima)' };
            }
            // SCORE B: CASO ALTA PROBABILIDADE
            if (temDocs && (problemaTipo === 'reajuste' || problemaTipo === 'reembolso')) {
                return { score: 'B', eta: '24 horas úteis', title: 'Alta Probabilidade de Contestação Judicial' };
            }
            // SCORE C: CASOS COMPLEXOS (Portabilidade) ou Casos sem Documentação
            if (problemaTipo === 'portabilidade' || temDocs === 'nao') {
                return { score: 'C', eta: '48 horas úteis', title: 'Análise Complexa ou Preventiva' };
            }

            return { score: 'B', eta: '24 horas úteis', title: 'Análise Padrão' };

        default:
            return defaultScore;
    }
}


// ====================================================
// 2. LÓGICA DE GERAÇÃO DE CONTEÚDO FINAL (ResultDisplay)
// ====================================================
// ====================================================
// 2. LÓGICA DE GERAÇÃO DE CONTEÚDO FINAL (ResultDisplay)
// ====================================================
function generateResultContent(serviceType, data, scoring, protocol) {
    const isUrgente = scoring.score === 'A';
    const ctaText = isUrgente ? 'Falar Imediatamente no WhatsApp' : 'Continuar para Atendimento';
    const baseDisclaimer = "Aviso: A análise é indicativa. Protocolo gerado: " + protocol;

    // Definições Default caso o serviço não seja encontrado
    let content = [];
    let checklist = [];
    let extraMessage = `Seu caso foi classificado como *Score ${scoring.score}*. ETA: ${scoring.eta}.`;


    if (serviceType === 'pix') {
        const diffDays = data.dataTransacao ? Math.floor(Math.abs(new Date() - new Date(data.dataTransacao)) / (1000 * 60 * 60 * 24)) : 999;

        content.push(`Sua transação (${data.fraudeTipo}) ocorreu há ${diffDays} dias.`);
        if (scoring.score !== 'C') {
            content.push("Aja rápido: registre contestação com o banco e boletim de ocorrência.");
        }
        checklist = ['Comprovante do PIX (E2E visível)', 'B.O. e protocolo do banco'];

    } else if (serviceType === 'aereo') {
        const horas = parseFloat(data.horas) || 0;

        content.push(`Problema: ${data.problema} (${horas} horas de atraso).`);
        if (horas >= 4) {
            content.push("Você tem fortes indícios de direito à indenização por danos morais.");
        }
        checklist = ['Cópia dos Bilhetes Aéreos', 'Comprovantes de despesas (se aplicável)'];

    } else if (serviceType === 'energia') {
        content.push(`Sua distribuidora é: ${data.distribuidora}. Score de Prioridade: ${scoring.score}.`);
        content.push(`Tempo de contato estimado: ${scoring.eta}.`);

        if (scoring.score === 'A') {
            content.push("🚨 O dano material (aparelho queimado ou atraso) exige ação imediata para abertura do processo de ressarcimento na concessionária.");
        } else if (scoring.score === 'B') {
            content.push("O tempo de falta de energia/valor da conta sugere que a compensação DIC/FIC pode ser devida. Precisamos analisar suas faturas.");
        }
        checklist = ['Últimas 12 faturas de energia', 'Documento de identificação', 'Comprovante de residência'];

        // CORREÇÃO: O CTA da ENERGIA é diferente
        return {
            title: scoring.title,
            content: content,
            checklist: checklist,
            disclaimer: "Lembre-se: O resultado é indicativo. A confirmação depende da análise detalhada das suas faturas.",
            ctaText: 'Enviar Faturas para Análise', // CTA ÚNICO DA ENERGIA
            whatsappUrl: generateWhatsappMessage(serviceType, data, protocol, scoring.score),
            urgenteUrl: generateWhatsappMessage(serviceType, data, protocol, 'A'),
        };

    } else if (serviceType === 'saude') { // <-- AGORA É UM ELSE IF SEPARADO
        const saudeCtaText = 'Falar com Especialista em Saúde';
        const isSaudeUrgente = data.urgencia === 'sim';
        const problemaTipo = data.problema;

        content.push(`Problema: ${problemaTipo.toUpperCase()}. Plano: ${data.operadora || 'Não Informado'}. Score: ${scoring.score}.`);
        content.push(`Tempo de contato estimado: ${scoring.eta}.`);

        if (problemaTipo === 'negativa') {
            content.push(`Orientações: A cobertura pode ser obrigatória mesmo fora do Rol da ANS. ${isSaudeUrgente ? 'A urgência exige autorização imediata.' : ''}`);
        } else if (problemaTipo === 'reajuste') {
            content.push(`Orientações: Analisaremos se o aumento em seu plano ${data.tipoPlano} é abusivo.`);
        }

        return {
            title: scoring.title,
            content: content,
            checklist: [
                'Pedido médico e negativa formal (se aplicável)',
                'Últimos boletos pagos',
                'Protocolos abertos na operadora'
            ],
            disclaimer: "Importante: Para ações judiciais em saúde, a urgência é um fator crucial. Nossa equipe prioriza casos onde a saúde do paciente está em risco.",
            ctaText: saudeCtaText,
            whatsappUrl: generateWhatsappMessage(serviceType, data, protocol, scoring.score),
            urgenteUrl: generateWhatsappMessage(serviceType, data, protocol, 'A'),
        };
    }

    // Retorno FINAL Padrão para PIX/AÉREO (ou qualquer outro serviço que não tenha seu próprio return com CTA customizado)
    return {
        title: scoring.title,
        content: content,
        checklist,
        disclaimer: baseDisclaimer,
        ctaText,
        extraMessage: extraMessage,
        whatsappUrl: generateWhatsappMessage(serviceType, data, protocol, scoring.score),
        urgenteUrl: generateWhatsappMessage(serviceType, data, protocol, 'A'),
    };
}

// ====================================================
// 3. LÓGICA PARA GERAR A MENSAGEM WHATSAPP (DETALHADA)
// ====================================================
function generateWhatsappMessage(serviceType, data, protocol, score) {
    const isUrgente = score === 'A';
    const cabecalho = isUrgente ? `🚨 CASO URGENTE (${serviceType.toUpperCase()}) 🚨` : `📋 Protocolo: ${protocol} (Score: ${score})`;
    const fechamento = isUrgente ? "\n\n⚠️ Preciso de atendimento imediato!" : "\n\nAguardo as orientações para prosseguir.";

    let detalhes;

    switch (serviceType.toLowerCase()) {
        case "pix":
            detalhes = `
💸 Simulação PIX:
- Valor: R$ ${data.valor || '0,00'}
- Fraude: ${data.fraudeTipo || 'Não informado'}
- Tentativa Banco: ${data.tentouResolver || 'Não'}
- Tipo de Erro: ${data.erroTipo || 'Não informado'}
`;
            break;

        case "aereo":
            detalhes = `
✈️ Simulação Aéreo:
- Problema: ${data.problema || 'Não informado'}
- Horas Atraso: ${data.horas || '0'}
- Pernoite: ${data.pernoite || 'Não'}
- Despesas Extras: R$ ${data.despesas || '0,00'}
- Escopo: ${data.escopo || 'Doméstico'}
`;
            break;

        case 'energia':
            detalhes = `
⚡ Simulação Energia:
- Problema Principal: ${data.problema || '-'}
- Concessionária: ${data.distribuidora || '-'}
- Valor Médio Conta: R$ ${data.valorMedio || '0,00'}
- Aparelho Queimou?: ${data.aparelhoQueimado || 'Não'}
- Tempo Sem Energia: ${data.tempoSemEnergia || '0'}h
- Atraso Religação: ${data.tempoReligacao || '0'} dias
- Perfil: ${data.perfil || 'Residencial'}
`;
            break;
        case 'saude':
            detalhes = `
🏥 Simulação Saúde:
- Problema: ${data.problema || '-'}
- Operadora: ${data.operadora || '-'}
- Tipo de Plano: ${data.tipoPlano || '-'}
- Urgência/Emergência: ${data.urgencia || 'Não'}
- Docs Prontos: ${data.documentosProntos || 'Não'}
- Detalhe Extra: ${data.outrosServicos || 'N/A'}
`;
            break;


        default:
            detalhes = `Detalhes não disponíveis. Favor consultar Protocolo: ${protocol}`;
            break;
    }

    const mensagemCompleta = `
${cabecalho}

*Nome:* ${data.nome}
*WhatsApp:* ${data.whats}
*E-mail:* ${data.email}

${detalhes.trim()}

${fechamento.trim()}
    `.trim();

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemCompleta)}`;
}


// ====================================================
// 4. LÓGICA DE ENVIO DE E-MAIL (Notificação Admin e Cliente)
// ====================================================

// Funções para enviar e-mail (usando Nodemailer)
async function sendEmail(to, subject, html) {
    if (!EMAIL_USER) {
        console.warn("Nodemailer não configurado. E-mail de confirmação não foi enviado.");
        return;
    }
    const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
    };
    await transporter.sendMail(mailOptions);
}

// CRÍTICO: Função de Notificação Interna (Substitui Dashboard)
function generateAdminEmailBody(serviceType, data, scoring, protocol, resultData) {
    // CRIA UMA STRING COM TODOS OS DADOS BRUTOS DO FORMULÁRIO PARA O ADMIN
    const formDetails = Object.keys(data).map(key => `<li><strong>${key}:</strong> ${data[key]}</li>`).join('');

    return `
        <html>
        <body>
            <h3>🚨 NOVO LEAD | ${serviceType.toUpperCase()} | SCORE ${scoring.score} 🚨</h3>
            <p><strong>Protocolo:</strong> ${protocol}</p>
            <p><strong>Prioridade (ETA):</strong> ${scoring.eta}</p>
            
            <hr/>
            <h4>Dados do Lead:</h4>
            <ul>
                <li><strong>Nome:</strong> ${data.nome}</li>
                <li><strong>WhatsApp:</strong> ${data.whats}</li>
                <li><strong>E-mail:</strong> ${data.email}</li>
            </ul>

            <h4>Detalhes do Formulário:</h4>
            <ul>
                ${formDetails}
            </ul>

            <p><strong>Ação:</strong> Priorize o contato com base no Score. O cliente já recebeu o Protocolo e o Checklist.</p>
        </body>
        </html>
    `;
}


// ====================================================
// 5. ROTA PRINCIPAL (POST)
// ====================================================
export async function POST(request) {
    try {
        const payload = await request.json();
        const { serviceType, ...data } = payload;

        if (!serviceType || !data.nome || !data.email) {
            return NextResponse.json({ success: false, error: "Dados essenciais do lead ausentes." }, { status: 400 });
        }

        // 1. Geração de Protocolo
        const protocolPrefix = serviceType.toUpperCase().substring(0, 5);
        const protocolDate = new Date().toISOString().substring(0, 10).replace(/-/g, '');
        const protocolSuffix = uuidv4().substring(0, 4).toUpperCase();
        const protocol = `${protocolPrefix}-${protocolDate}-${protocolSuffix}`;

        // 2. Cálculo de Score
        const scoring = calculateScore(serviceType, data);

        // 3. Geração do conteúdo completo
        const resultData = generateResultContent(serviceType, data, scoring, protocol);

        // 4. Disparo de E-mails (Assíncrono)
        // a) E-mail para o Cliente (Confirmação)
        await sendEmail(data.email, `[Protocolo ${protocol}] Seu Resultado Resolve Online`, resultData.disclaimer + '<br>' + resultData.content.join('<br>'));

        // b) CRÍTICO: E-mail de Notificação Interna para o Admin
        const adminEmailBody = generateAdminEmailBody(serviceType, data, scoring, protocol, resultData);
        await sendEmail(EMAIL_ADMIN_NOTIFY, `[NOVO LEAD | Score ${scoring.score}] ${serviceType.toUpperCase()}: ${data.nome}`, adminEmailBody);

        // 5. Retorna a resposta ao Front-end
        return NextResponse.json({
            success: true,
            protocol: protocol,
            score: scoring.score,
            eta: scoring.eta,
            resultData: resultData, // Contém Title, Content, Checklist, e URLs do Wpp
        }, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: "Erro interno no servidor ao processar o lead." }, { status: 500 });
    }
}