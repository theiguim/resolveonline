'use client';
import { useState } from "react";
import "../../../styles/FormPages.css";
import { submitForm } from "../actions/formActions";

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
      setSubmitted(false); // Reseta o sucesso caso tente de novo

    const leadData = { name, email, message };

    try {
    const { success, error } = await submitForm('contato', leadData);

    if (error) {
      throw new Error(error);
    }

    // Sucesso
    setSubmitted(true);
        // Limpa o formulário
        setName("");
        setEmail("");
        setMessage("");

    } catch (error) {
    console.error("Falha ao enviar formulário de contato:", error.message);
    setSubmitError("Houve um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
    setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <h1 className="page-title-alt" style={{ marginBottom: "3rem", color: "#0958d7" }}>Entre em contato conosco</h1>

      <div className="form-card-contato box-shadow">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name" className="form-label">Nome</label>
            <input
              type="text"
              id="contact-name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" className="form-label">Email</label>
            <input
              type="email"
              id="contact-email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-label">Mensagem</label>
            <textarea
              id="contact-message"
              rows="5"
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {submitError && (
            <div className="p-3 my-3 text-red-700 bg-red-100 border border-red-200 rounded-md">
            {submitError}
            </div>
          )}

          <button
            type="submit"
            className="btn-submit btn-blue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
          </button>
        </form>

        {submitted && (
          <div className="text-center-box" style={{ marginTop: "1.5rem" }}>
            <p>Mensagem enviada com sucesso!</p>
          </div>
        )}

        <div className="text-center-box" style={{ marginTop: "2rem" }}>
          <p>Ou fale conosco via:</p>
          <p style={{ fontWeight: 600 }}>E-mail: <a href="mailto:contato@resolveonline.com.br">contato@resolveonline.com.br</a></p>
          <p style={{ fontWeight: 600 }}>WhatsApp: <a href="https://wa.me/553184815969?text=Ol%C3%A1,%20eu%20gostaria%20de%20conhecer%20melhor%20a%20Resolve%20Online.">(31) 8481-5969</a></p>
        </div>
      </div>
    </main>
  );
}
