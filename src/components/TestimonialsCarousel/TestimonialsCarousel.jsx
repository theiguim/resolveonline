"use client";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import "./TestimonialsCarousel.css";

export default function TestimonialsCarousel() {
    const scrollRef = useRef(null);
    const pathname = usePathname();

    // Detecta a vertical da página atual
    const currentService =
        pathname?.replace("/", "")?.replace("-", "")?.toLowerCase() || "";

    // Base de depoimentos por vertical (agora com avatar)
    const testimonials = {
        aereo: [
            {
                name: "Renata P. – São Paulo/SP",
                text: "Achei que nunca veria esse dinheiro de volta. A Resolve cuidou de tudo e em menos de 15 dias recebi minha indenização.",
                avatar: "/avatars/renata-min.jpg",
            },
            {
                name: "Marcelo T. – Curitiba/PR",
                text: "Meu voo atrasou mais de 6 horas e a companhia não respondeu. A Resolve fez tudo online e me manteve informado o tempo todo.",
                avatar: "/avatars/marcelo-min.jpg",
            },
            {
                name: "Débora S. – Recife/PE",
                text: "Não precisei nem ir atrás de advogado. Tudo foi feito com transparência e o valor caiu direitinho na minha conta.",
                avatar: "/avatars/debora-min.jpg",
            },
            {
                name: "Fábio R. – Belo Horizonte/MG",
                text: "Atendimento nota 10! Resolveram algo que eu nem sabia que tinha direito.",
                avatar: "/avatars/fabio-min.jpg",
            },
        ],
        energia: [
            {
                name: "Juliana C. – Campinas/SP",
                text: "A conta veio absurda e eu nem sabia como reclamar. A Resolve analisou meu caso e consegui o reembolso completo.",
                avatar: "/avatars/juliana-min.jpg",
            },
            {
                name: "Paulo H. – Salvador/BA",
                text: "Rápido, fácil e sem papelada. Recebi o estorno direto, fiquei impressionado com a agilidade.",
                avatar: "/avatars/paulo-min.jpg",
            },
            {
                name: "Lívia A. – Brasília/DF",
                text: "Excelente atendimento! Explicaram cada etapa e resolveram tudo sem eu precisar ligar pra concessionária.",
                avatar: "/avatars/livia-min.jpg",
            },
            {
                name: "Rogério M. – Porto Alegre/RS",
                text: "Achei que seria mais uma promessa da internet, mas funcionou! Já recomendei pra amigos.",
                avatar: "/avatars/rogerio-min.jpg",
            },
        ],
        pix: [
            {
                name: "Mariana F. – Rio de Janeiro/RJ",
                text: "Fui vítima de um golpe no PIX e achei que não teria volta. A Resolve me orientou e consegui recuperar parte do valor.",
                avatar: "/avatars/mariana-min.jpg",
            },
            {
                name: "João R. – Fortaleza/CE",
                text: "Achei sensacional! Tudo digital, com acompanhamento pelo e-mail, sem stress de banco.",
                avatar: "/avatars/joao-min.jpg",
            },
            {
                name: "Tatiane M. – Uberlândia/MG",
                text: "O suporte foi humano, me ouviram de verdade. Hoje recomendo a Resolve pra todo mundo.",
                avatar: "/avatars/tatiane-min.jpg",
            },
            {
                name: "Diego C. – Niterói/RJ",
                text: "Transparência total. Eles explicaram os prazos e cumpriram cada um.",
                avatar: "/avatars/diego-min.jpg",
            },
        ],
        saude: [
            {
                name: "André L. – Ribeirão Preto/SP",
                text: "O plano se negou a reembolsar meu exame, e a Resolve conseguiu reverter. Atendimento impecável.",
                avatar: "/avatars/andre-min.jpg",
            },
            {
                name: "Beatriz M. – São José dos Campos/SP",
                text: "Resolveram em poucos dias algo que eu tentava há meses com o convênio.",
                avatar: "/avatars/beatriz-min.jpg",
            },
            {
                name: "Rafaela D. – Belo Horizonte/MG",
                text: "Foi tudo muito prático, sem burocracia e com informação o tempo todo.",
                avatar: "/avatars/rafaela-min.jpg",
            },
            {
                name: "Cláudia V. – Curitiba/PR",
                text: "Não precisei entender de leis, eles cuidaram de tudo com ética e respeito.",
                avatar: "/avatars/claudia-min.jpg",
            },
        ],
    };

    const currentTestimonials = testimonials[currentService] || [];
    const cardWidth = 332;

    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    };

    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    };

    const titleMap = {
        pix: "O que dizem sobre a Resolve Online (PIX)",
        aereo: "O que dizem sobre a Resolve Online (Aéreo)",
        energia: "O que dizem sobre a Resolve Online (Energia)",
        saude: "O que dizem sobre a Resolve Online (Saúde)",
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-wrapper">
                <h2 className="testimonials-title">
                    {titleMap[currentService] || "O que dizem nossos clientes"}
                </h2>

                <div className="testimonials-container" ref={scrollRef}>
                    {currentTestimonials.map((t, i) => (
                        <div className="testimonial-card" key={i}>
                            <div className="card-header">
                                

                                {t.avatar && (
                                    <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                                )}
                                <p className="testimonial-stars">⭐⭐⭐⭐⭐</p>
                            </div>

                            <p className="testimonial-text">“{t.text}”</p>
                            <h4 className="testimonial-name">{t.name}</h4>
                        </div>
                    ))}
                </div>

                <div className="testimonials-controls">
                    <button onClick={scrollLeft} className="scroll-btn">←</button>
                    <button onClick={scrollRight} className="scroll-btn">→</button>
                </div>
            </div>
        </section>
    );
}
