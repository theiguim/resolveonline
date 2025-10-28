import Image from 'next/image';
import Link from 'next/link'; // <--- Adicionado para os cards
import { notFound } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';

/**
 * Helper para formatar a data
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Data não definida';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
  } catch (e) {
    return 'Data inválida';
  }
};

/**
 * Busca o post específico no servidor
 */
async function getPost(slug) {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    notFound();
  }
  return data;
}

/**
 * NOVO: Busca posts relacionados (mesma categoria, menos o atual)
 */
async function getRelatedPosts(category, currentPostId) {
  if (!category) return []; // Não busca se não tiver categoria

  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)    // Da mesma categoria
    .neq('id', currentPostId)    // Que não seja o post atual
    .eq('status', 'published')   // Apenas publicados
    .order('publishedAt', { ascending: false }) // Mais novos primeiro
    .limit(5); // Limita a 5 posts para o carrossel

  if (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    return [];
  }
  return data;
}

/**
 * Gera os metadados de SEO para o <head>
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  // (Nenhuma alteração aqui, seu código de metadados está ótimo)
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [
        {
          url: post.ogImage || post.coverImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

/**
 * Esta é a página do post individual /blog/[slug]
 */
export default async function PostPage({ params }) {
  const resolvedParams = await params;
  // 1. Busca o post principal
  const post = await getPost(resolvedParams.slug);

  // 2. Busca os posts relacionados
  const relatedPosts = await getRelatedPosts(post.category, post.id);

  return (
    <main className="mt-[100px] bg-[#fdfcfc]">
        
        {/* 🔙 Botão de Voltar */}
        <div className="max-w-4xl mx-auto px-4 mb-4">
            <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#0958d7] font-medium hover:underline transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o blog
            </Link>
        </div>
      {/* 1. Header do Post (Imagem e Título) */}
      <header className="relative h-[450px] md:h-[550px] w-full">
        {/* (Seu código do header aqui - sem alterações) */}
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-4xl mx-auto px-4 pb-16">
          {post.category && (
            <span className="text-lg font-bold text-[#ebf5ff] uppercase">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-200 mt-4 max-w-2xl">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-gray-300">
            {post.author?.name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Por {post.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            {post.readTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime} min de leitura</span>
              </div>
            )}
          </div>
        </div>
      </header>

    {/* 🔙 Botão de Voltar */}
        <div className="max-w-4xl mt-6 mx-auto px-4 mb-4">
            <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#0958d7] font-medium hover:underline transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o blog
            </Link>
        </div>

      {/* 2. Conteúdo do Post */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div
          className="
            prose prose-lg lg:prose-xl max-w-none
            prose-h1:text-[#0d3074]
            prose-h2:text-[#0d3074]
            prose-h3:text-[#0d3074]
            prose-a:text-[#0958d7]
            prose-strong:text-[#0d3074]
            prose-blockquote:border-l-[#0958d7]
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* 3. NOVA SEÇÃO: Posts Relacionados */}
      {relatedPosts && relatedPosts.length > 0 && (
        <RelatedPostsSection posts={relatedPosts} />
      )}
    </main>
  );
}


// --- NOVOS COMPONENTES ADICIONADOS ---

/**
 * Componente da Seção "Posts Relacionados"
 */
function RelatedPostsSection({ posts }) {
  return (
    <section className="bg-white border-t border-gray-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#0d3074] mb-8 text-center">
          Posts Relacionados
        </h2>
        
        {/* Container do "Carrossel" de Rolagem Horizontal */}
        <div className="flex overflow-x-auto gap-6 pb-6 -mb-6">
          {posts.map((post) => (
            // Wrapper para forçar o tamanho do card no carrossel
            <div key={post.id} className="flex-shrink-0 w-[340px]">
              <PostCard post={post} />
            </div>
          ))}
          {/* Padding "fantasma" no final para dar espaço */}
          <div className="flex-shrink-0 w-1" />
        </div>
      </div>
    </section>
  );
}

/**
 * Componente: PostCard (O MESMO da página /blog)
 * Reutilizado aqui para manter a consistência.
 */
function PostCard({ post }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Imagem */}
      <div className="relative w-full h-56">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="340px" // Tamanho fixo do card no carrossel
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem Imagem</span>
          </div>
        )}
      </div>
      
      {/* Conteúdo do Card */}
      <div className="p-6 flex flex-col flex-1">
        {/* Categoria e Tempo de Leitura */}
        <div className="flex justify-between items-center mb-2">
          {post.category && (
            <span className="text-sm font-bold text-[#0958d7] uppercase">
              {post.category}
            </span>
          )}
          {post.readTime > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" /> {post.readTime} min
            </span>
          )}
        </div>
        
        {/* Título */}
        <h2 className="text-2xl font-bold text-[#0d3074] mb-3 group-hover:text-[#0958d7] transition-colors line-clamp-2">
          {post.title}
        </h2>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
        
        {/* Data */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}