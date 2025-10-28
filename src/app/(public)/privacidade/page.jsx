// /pages/politica-de-privacidade.jsx ou /app/politica-de-privacidade/page.jsx
import "../../../styles/FormPages.css";

const PoliticaDePrivacidadePage = () => {
  return (
    <main>
      <div className="termos-container">
        <h1>Política de Privacidade – Resolve Online</h1>
        <p>
          <strong>Última atualização:</strong> 16 de outubro de 2025
        </p>

        <h2>1. Nosso Compromisso</h2>
        <p>
          A Resolve Online (“nós”, “nosso”) leva a sua privacidade a sério. Esta Política de Privacidade descreve como tratamos as informações e os dados pessoais dos usuários (“você”, “seu”) que acessam nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/18).
        </p>
        
        <h2>2. Quais Dados Coletamos e Por Quê</h2>
        
        <h3>2.1. Dados Fornecidos nos Simuladores e Calculadoras</h3>
        <p>
          <strong>NÃO COLETAMOS NEM ARMAZENAMOS DADOS PESSOAIS INSERIDOS EM NOSSOS SIMULADORES.</strong>
        </p>
        <p>
          As informações que você digita em nossas ferramentas (como valores, datas, detalhes de voos, etc.) são processadas exclusivamente no seu próprio dispositivo (no navegador, via JavaScript) para gerar um resultado de elegibilidade imediato. Esses dados <strong>não são transmitidos para nossos servidores</strong>, não são salvos em nosso banco de dados e são descartados quando você fecha ou atualiza a página.
        </p>
        
        <h3>2.2. Dados Fornecidos via Contato Direto (WhatsApp)</h3>
        <p>
          Quando você decide iniciar uma conversa com nossa equipe através do botão de WhatsApp, você está voluntariamente compartilhando seus dados (como nome, número de telefone e detalhes do seu caso) conosco através da plataforma WhatsApp (Meta). A partir desse momento, trataremos esses dados com a finalidade de:
        </p>
        <ul>
          <li>Realizar o atendimento e a análise inicial do seu caso.</li>
          <li>Fornecer as orientações e os próximos passos.</li>
          <li>Formalizar uma proposta de prestação de serviços, se aplicável.</li>
        </ul>
        <p>
          O tratamento desses dados se dará com base no seu consentimento e na necessidade de executar procedimentos preliminares a um contrato.
        </p>
        
        <h3>2.3. Dados de Navegação (Cookies)</h3>
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. Os cookies são pequenos arquivos de texto armazenados em seu navegador. Usamos:
        </p>
        <ul>
          <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site.</li>
          <li><strong>Cookies de Análise e Desempenho:</strong> Ferramentas como Google Analytics e Hotjar nos ajudam a entender como os usuários interagem com a plataforma (de forma anônima ou pseudonymizada), como quais páginas são mais visitadas e onde há possíveis erros. Isso nos permite otimizar o site.</li>
          <li><strong>Cookies de Marketing:</strong> Podemos usar pixels (como o do Facebook/Meta) para medir a eficácia de campanhas publicitárias, caso venhamos a veicular anúncios.</li>
        </ul>
        <p>
          Você pode gerenciar ou desativar os cookies através das configurações do seu navegador.
        </p>

        <h2>3. Compartilhamento de Dados Pessoais</h2>
        <p>
          Nós não compartilhamos, vendemos ou alugamos seus dados pessoais. Os dados que recebemos via WhatsApp podem ser compartilhados internamente com a equipe responsável pelo seu caso ou com parceiros (como advogados associados) estritamente necessários para a prestação do serviço, sempre com o seu conhecimento e consentimento.
        </p>

        <h2>4. Seus Direitos como Titular de Dados (LGPD)</h2>
        <p>
          Você tem o direito de solicitar a qualquer momento:
        </p>
        <ul>
          <li>A confirmação da existência de tratamento de seus dados.</li>
          <li>O acesso aos seus dados.</li>
          <li>A correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>A anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
          <li>A portabilidade dos seus dados a outro fornecedor de serviço.</li>
          <li>A eliminação dos dados tratados com o seu consentimento.</li>
          <li>Informações sobre com quem compartilhamos seus dados.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO).
        </p>

        <h2>5. Segurança dos Dados</h2>
        <p>
          Adotamos medidas de segurança para proteger nossa plataforma, como o uso de certificado SSL (HTTPS) para criptografar a comunicação entre seu navegador e nosso servidor. Para os dados recebidos via WhatsApp e armazenados para a condução do seu caso, aplicamos controles de acesso restrito e políticas de segurança da informação.
        </p>

        <h2>6. Retenção de Dados</h2>
        <p>
          Como não coletamos dados dos simuladores, não há período de retenção para eles. Para os dados de clientes que iniciam o atendimento via WhatsApp, os mesmos serão retidos pelo tempo necessário para cumprir a finalidade para a qual foram coletados, incluindo obrigações legais, contratuais ou para a proteção de direitos.
        </p>

        <h2>7. Contato do Encarregado (DPO)</h2>
        <p>
          Para qualquer questão relacionada a esta Política de Privacidade ou para exercer seus direitos como titular, entre em contato com nosso Encarregado de Proteção de Dados.
        </p>
        <p>
          {/* <strong>Nome do DPO:</strong> [Nome do Responsável pela Proteção de Dados]<br />
          <strong>E-mail:</strong> [email.dpo@resolveonline.com.br] */}
        </p>

        <h2>8. Atualizações desta Política</h2>
        <p>
          Esta Política de Privacidade pode ser atualizada a qualquer momento. A data da última versão será sempre indicada no topo deste documento.
        </p>
      </div>
    </main>
  );
};

export default PoliticaDePrivacidadePage;