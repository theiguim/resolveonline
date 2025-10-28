'use client';

import { useState, useEffect } from 'react';
// CORREÇÃO: Importamos a FUNÇÃO 'createClient'
import { createClient } from '@/lib/supabase/client';
import { 
  X, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
  FileUp, // NOVO ÍCONE
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Para nomes de arquivo únicos

// CORREÇÃO: Criamos a instância do cliente aqui
const supabase = createClient();
const BUCKET_NAME = 'blog-media'; // <-- AJUSTE AQUI se o nome do seu bucket for diferente

// --- MODAL DE NOVO/EDITAR POST (MODIFICADO PARA UPLOAD) ---
function PostModal({ post, onClose, onSave }) {
  // --- Estados do Formulário (Expandidos) ---
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  
  // Metadados
  const [status, setStatus] = useState(post?.status || 'draft');
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
  );
  const [category, setCategory] = useState(post?.category || '');
  const [tagsString, setTagsString] = useState(post?.tags?.join(', ') || '');
  const [readTime, setReadTime] = useState(post?.readTime || 0);
  const [authorName, setAuthorName] = useState(post?.author?.name || '');

  // Mídia (URLs atuais salvas no banco)
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImage || '');
  const [ogImageUrl, setOgImageUrl] = useState(post?.ogImage || '');
  
  // Mídia (Arquivos selecionados para novo upload)
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedOgFile, setSelectedOgFile] = useState(null);

  // SEO
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');

  const [isSaving, setIsSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(''); // Feedback de upload
  
  // --- Funções Auxiliares ---
  const generateSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!post) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (fileType === 'cover') {
        setSelectedCoverFile(file);
      } else if (fileType === 'og') {
        setSelectedOgFile(file);
      }
    }
  };

  /**
   * Função de Upload de Arquivo
   * Lida com o upload para o Supabase Storage.
   * @param {File} file - O arquivo a ser enviado.
   * @param {string | null} oldImageUrl - A URL da imagem antiga, para exclusão (opcional).
   * @returns {Promise<string | null>} A URL pública da nova imagem, ou null se não houver arquivo.
   */
  const handleFileUpload = async (file, oldImageUrl) => {
    if (!file) return null; // Nenhum arquivo novo

    // 1. (Opcional) Excluir o arquivo antigo se ele existir
    if (oldImageUrl) {
      try {
        // Extrai o nome do arquivo da URL antiga
        const oldFileName = oldImageUrl.split(`${BUCKET_NAME}/`).pop();
        if (oldFileName) {
          console.log(`Removendo arquivo antigo: ${oldFileName}`);
          await supabase.storage.from(BUCKET_NAME).remove([oldFileName]);
        }
      } catch (removeError) {
        console.warn("Erro ao remover imagem antiga:", removeError.message);
        // Não bloqueia o novo upload se a exclusão falhar
      }
    }

    // 2. Fazer upload do novo arquivo
    const fileExt = file.name.split('.').pop();
    const newFileName = `${uuidv4()}.${fileExt}`; // Caminho único
    
    setUploadMessage(`Enviando ${file.name}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFileName, file, {
        cacheControl: '3600', // Cache de 1 hora
        upsert: false, // Não sobrescrever (já temos uuid)
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // 3. Obter a URL pública
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Não foi possível obter a URL pública após o upload.");
    }
    
    return publicUrlData.publicUrl;
  };


  // --- Envio do Formulário ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadMessage('');

    try {
      // --- Lógica de Upload ---
      let finalCoverUrl = coverImageUrl; // Começa com a URL existente
      let finalOgUrl = ogImageUrl;     // Começa com a URL existente

      // Se um novo arquivo de CAPA foi selecionado, faça o upload
      if (selectedCoverFile) {
        setUploadMessage('Enviando imagem de capa...');
        // Passa a URL antiga (coverImageUrl) para exclusão
        finalCoverUrl = await handleFileUpload(selectedCoverFile, post?.coverImage); 
      }

      // Se um novo arquivo OG foi selecionado, faça o upload
      if (selectedOgFile) {
        setUploadMessage('Enviando imagem OG...');
        // Passa a URL antiga (ogImageUrl) para exclusão
        finalOgUrl = await handleFileUpload(selectedOgFile, post?.ogImage);
      }
      
      setUploadMessage('Uploads concluídos. Salvando post...');

      // --- Preparação dos Dados do Post ---
      const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);
      const author = { name: authorName };
      const finalPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : null;

      const postData = { 
        title, 
        content, 
        slug, 
        status,
        excerpt,
        category,
        tags,
        readTime: Number(readTime),
        author,
        seoTitle,
        seoDescription,
        publishedAt: finalPublishedAt,
        // Salva as URLs finais (novas ou as antigas)
        coverImage: finalCoverUrl, 
        ogImage: finalOgUrl
      };
      
      // --- Salvar no Banco (Insert ou Update) ---
      let error;
      if (post) {
        ({ error } = await supabase.from('posts').update(postData).match({ id: post.id }));
      } else {
        ({ error } = await supabase.from('posts').insert([postData]));
      }

      if (error) {
        throw new Error(`Erro ao salvar post: ${error.message}`);
      }

      setIsSaving(false);
      onSave(); // Sucesso, fecha o modal

    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      alert('Erro: ' + error.message);
      setIsSaving(false);
      setUploadMessage('');
    }
  };
  
  // Classe CSS reutilizável para inputs (definida para consistência)
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-medium-blue focus:border-medium-blue bg-white dark:bg-gray-700 dark:text-white";


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{post ? 'Editar Post' : 'Novo Post'}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        
        {/* Corpo do Formulário com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Seção: Conteúdo Principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input type="text" id="title" value={title} onChange={handleTitleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug (URL)</label>
              <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className={`${inputClass} bg-gray-50 dark:bg-gray-900 font-mono`} />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resumo (Excerpt)</label>
            <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={`${inputClass} font-mono`} placeholder="Um breve resumo do post..."></textarea>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo (Markdown ou HTML)</label>
            <textarea id="content" rows={15} value={content} onChange={(e) => setContent(e.target.value)} className={`${inputClass} font-mono`} placeholder="Escreva seu post aqui..."></textarea>
          </div>

          {/* Seção: Metadados */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="draft">Rascunho (Draft)</option>
                <option value="published">Publicado (Published)</option>
              </select>
            </div>
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Publicação</label>
              <input type="date" id="publishedAt" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="Ex: energia" />
            </div>
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tempo de Leitura (min)</label>
              <input type="number" id="readTime" value={readTime} onChange={(e) => setReadTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Autor</label>
              <input type="text" id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={inputClass} placeholder="Ex: ResolveOnline" />
            </div>
          </div>
          <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (separadas por vírgula)</label>
              <input type="text" id="tags" value={tagsString} onChange={(e) => setTagsString(e.target.value)} className={inputClass} placeholder="Ex: tusd, tust, fatura" />
          </div>

          {/* --- Seção: Mídia (MODIFICADA PARA UPLOAD) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campo de Upload: Imagem de Capa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem de Capa</label>
              <div className="mt-1 flex items-center gap-4">
                {/* Preview */}
                <div className="flex-shrink-0 w-24 h-24 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {selectedCoverFile ? (
                    <img src={URL.createObjectURL(selectedCoverFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : coverImageUrl ? (
                    <img src={coverImageUrl} alt="Capa Atual" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                {/* Botão de Upload */}
                <label htmlFor="cover-file-upload" className="relative cursor-pointer rounded-md font-medium text-medium-blue hover:text-hard-blue">
                  <span className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FileUp className="w-5 h-5" />
                    {selectedCoverFile ? 'Trocar arquivo' : 'Selecionar arquivo'}
                  </span>
                  <input id="cover-file-upload" name="cover-file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'cover')} accept="image/png, image/jpeg, image/webp, image/gif" />
                </label>
              </div>
              {selectedCoverFile && (
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">Arquivo selecionado: {selectedCoverFile.name}</span>
              )}
            </div>

            {/* Campo de Upload: Imagem OG */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem de Compartilhamento (OG)</label>
               <div className="mt-1 flex items-center gap-4">
                {/* Preview */}
                <div className="flex-shrink-0 w-24 h-24 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {selectedOgFile ? (
                    <img src={URL.createObjectURL(selectedOgFile)} alt="Preview OG" className="w-full h-full object-cover" />
                  ) : ogImageUrl ? (
                    <img src={ogImageUrl} alt="OG Atual" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                {/* Botão de Upload */}
                <label htmlFor="og-file-upload" className="relative cursor-pointer rounded-md font-medium text-medium-blue hover:text-hard-blue">
                  <span className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FileUp className="w-5 h-5" />
                    {selectedOgFile ? 'Trocar arquivo' : 'Selecionar arquivo'}
                  </span>
                  <input id="og-file-upload" name="og-file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'og')} accept="image/png, image/jpeg, image/webp" />
                </label>
              </div>
              {selectedOgFile && (
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">Arquivo selecionado: {selectedOgFile.name}</span>
              )}
            </div>
          </div>

          {/* Seção: SEO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título SEO</label>
              <input type="text" id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição SEO</label>
              <input type="text" id="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
        
        {/* Footer do Modal */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center gap-3">
           {/* Mensagem de status do upload */}
           <span className="text-sm text-gray-600 dark:text-gray-300">
             {isSaving ? uploadMessage : ''}
           </span>
           
           <div className="flex gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition" disabled={isSaving}>Cancelar</button>
             <button type="submit" className="btn flex items-center gap-2" disabled={isSaving}>
               {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
               {isSaving ? 'Salvando...' : (post ? 'Atualizar Post' : 'Criar Post')}
             </button>
           </div>
        </div>
      </form>
    </div>
  );
}

// --- MODAL DE CONFIRMAÇÃO DE DELETE (Sem alterações) ---
// (Cole o código do ConfirmDeleteModal da sua versão original aqui)
function ConfirmDeleteModal({ post, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // --- NOVO: Excluir imagens do Storage ao excluir o post ---
    try {
      const filesToRemove = [];
      if (post.coverImage) {
        filesToRemove.push(post.coverImage.split(`${BUCKET_NAME}/`).pop());
      }
      if (post.ogImage) {
        filesToRemove.push(post.ogImage.split(`${BUCKET_NAME}/`).pop());
      }

      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filesToRemove.filter(Boolean)); // Filtra nomes nulos/inválidos
        
        if (storageError) {
          console.warn("Erro ao excluir arquivos do Storage:", storageError.message);
          // Continua para excluir o post do DB mesmo se falhar a remoção do arquivo
        }
      }
    } catch (e) {
      console.warn("Erro ao preparar exclusão de arquivos:", e.message);
    }
    // --- FIM DA NOVA LÓGICA ---

    const { error: dbError } = await supabase.from('posts').delete().match({ id: post.id });
    
    if (dbError) {
      alert('Erro ao excluir post: ' + dbError.message);
    }
    
    setIsDeleting(false);
    onConfirm(); // Fecha o modal e recarrega a lista
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Excluir Post
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Tem certeza que deseja excluir o post "<strong>{post.title}</strong>"? Esta ação também removerá as imagens associadas e não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Excluir'}
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none sm:w-auto sm:text-sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}


// --- PÁGINA PRINCIPAL (AdminBlogPage) ---
// (Cole o código do AdminBlogPage da resposta anterior, com layout de cards)
export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Erro ao buscar posts:', error.message);
    else setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  const openEditModal = (post) => { setEditingPost(post); setShowPostModal(true); };
  const openNewModal = () => { setEditingPost(null); setShowPostModal(true); };
  const openDeleteModal = (post) => { setDeletingPost(post); };
  
  const handleCloseModals = () => {
    setShowPostModal(false);
    setDeletingPost(null);
  };
  
  const onSaveAndClose = () => {
    handleCloseModals();
    fetchPosts();
  };

  // Helper para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Não agendado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC' // Garante que a data não mude por fuso
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header da Página */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Blog</h1>
        <button onClick={openNewModal} className="btn flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Novo Post
        </button>
      </div>

      {/* Conteúdo da Página */}
      {loading ? (
        // Estado de Carregamento
         <div className="flex justify-center items-center h-64"><Loader2 className="w-16 h-16 animate-spin text-medium-blue" /></div>
      ) : (
        // Lista de Posts (Layout de Cards)
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nenhum post encontrado.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-lg">
                
                {/* Imagem de Capa */}
                {post.coverImage ? (
                  // Usamos um 'link' para a imagem ou um 'img' tag normal. 'img' é mais simples aqui.
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full sm:w-48 h-48 sm:h-auto object-cover flex-shrink-0 bg-gray-100" 
                  />
                ) : (
                  <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                
                {/* Informações do Post */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      {/* Badge de Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                      {/* Categoria */}
                      {post.category && (
                        <span className="text-xs font-semibold uppercase text-medium-blue dark:text-blue-400">
                          {post.category}
                        </span>
                      )}
                    </div>
                    
                    {/* Título */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    
                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  
                  {/* Footer do Card (Data e Ações) */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                      Publicar em: {formatDate(post.publishedAt)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => openEditModal(post)} className="text-medium-blue dark:text-blue-400 hover:text-hard-blue flex items-center gap-1 text-sm" title="Editar">
                        <Edit className="w-4 h-4" /> Editar
                      </button>
                      <button onClick={() => openDeleteModal(post)} className="text-red-600 dark:text-red-400 hover:text-red-800 flex items-center gap-1 text-sm" title="Excluir">
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modais */}
      {showPostModal && <PostModal post={editingPost} onClose={handleCloseModals} onSave={onSaveAndClose} />}
      {deletingPost && <ConfirmDeleteModal post={deletingPost} onClose={handleCloseModals} onConfirm={onSaveAndClose} />}
    </div>
  );
}