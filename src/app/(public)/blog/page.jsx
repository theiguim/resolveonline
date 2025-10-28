import Link from 'next/link';
import Image from 'next/image';
import { createServer } from '@/lib/supabase/server';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { cookies } from 'next/headers';

// --- Helpers (Mantidos do seu código) ---

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

// --- Início da Página Principal do Blog ---

export default async function BlogPage() {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  
  // 1. Busca os posts (como você já fazia)
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') 
    .order('publishedAt', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts:', error);
    return <p className="mt-[100px] text-center">Ocorreu um erro ao carregar o blog.</p>;
  }

  // 2. Prepara os dados para os widgets (SEM NOVAS QUERIES!)
  // Pegamos os 5 posts mais recentes do array que já buscamos
  const recentPosts = posts ? posts.slice(0, 5) : [];
  
  // Criamos uma lista única de categorias a partir dos posts
  const allCategories = posts 
    ? [...new Set(posts.map(post => post.category).filter(Boolean))] 
    : [];

  // --- Renderização da Página ---

  return (
    <div className="mt-[100px] bg-[#fdfcfc]">
      
      {/* 1. SEÇÃO HERO (Substitui o título solto) */}
      <section className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-[#0d3074] mb-4">
            Nosso Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, dicas e artigos sobre engenharia, tecnologia e inovação.
          </p>
        </div>
      </section>

      {/* 2. CONTEÚDO E SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Layout principal com Grid (2/3 para posts, 1/3 para sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          {/* Coluna Principal: Grid de Posts */}
          <main className="lg:col-span-2">
            {!posts || posts.length === 0 ? (
              <p className="text-center text-gray-600">Nenhum post publicado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </main>

          {/* Coluna da Sidebar */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-28 space-y-8">
              {/* Widget de Posts Recentes */}
              <RecentPostsWidget posts={recentPosts} />
              
              {/* Widget de Categorias */}
              <CategoriesWidget categories={allCategories} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

// --- Componentes Reutilizáveis ---

/**
 * 3. COMPONENTE: PostCard
 * O card que você gostou, agora isolado para organizar o código.
 */
function PostCard({ post }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col"
    >
      {/* Imagem */}
      <div className="relative w-full h-56">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <h2 className="text-2xl font-bold text-[#0d3074] mb-3 group-hover:text-[#0958d7] transition-colors">
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

/**
 * 4. COMPONENTE: SidebarWidget (Wrapper)
 * Um "molde" para os widgets da sidebar terem o mesmo estilo.
 */
function SidebarWidget({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-[#0d3074] mb-5 pb-3 border-b border-gray-200">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * 5. NOVO WIDGET: Posts Recentes
 */
function RecentPostsWidget({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <SidebarWidget title="Posts Recentes">
      {posts.map(post => (
        <Link 
          key={post.id} 
          href={`/blog/${post.slug}`}
          className="flex items-center gap-4 group"
        >
          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            {post.coverImage ? (
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 group-hover:text-[#0958d7] transition-colors line-clamp-2">
              {post.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </Link>
      ))}
    </SidebarWidget>
  );
}

/**
 * 6. NOVO WIDGET: Categorias
 */
function CategoriesWidget({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <SidebarWidget title="Categorias">
      {categories.map(category => (
        <Link 
          key={category} 
          // Ajuste o link se sua rota de categoria for diferente
          href={`/blog/categoria/${encodeURIComponent(category.toLowerCase())}`}
          className="flex justify-between items-center text-gray-700 hover:text-[#0958d7] transition-colors group"
        >
          <span className="font-medium">{category}</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0958d7]" />
        </Link>
      ))}
    </SidebarWidget>
  );
}