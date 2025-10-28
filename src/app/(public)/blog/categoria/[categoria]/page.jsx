import Link from 'next/link';
import Image from 'next/image';
import { createServer } from '@/lib/supabase/server';
import { Calendar, Clock, ChevronRight, ArrowLeft } from 'lucide-react'; // <-- 1. ADICIONADO ArrowLeft
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

// --- Helpers (Sem alterações) ---

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

const capitalizeCategory = (text) => {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

// --- Funções de Busca de Dados (Sem alterações) ---

async function getPageData(categorySlug) {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  const categoryName = decodeURIComponent(categorySlug);

  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .ilike('category', categoryName)
    .eq('status', 'published')
    .order('publishedAt', { ascending: false });

  if (postsError) {
    console.error('Erro ao buscar posts da categoria:', postsError);
  }

  const { data: recentPosts, error: recentError } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('publishedAt', { ascending: false })
    .limit(5);

  const { data: categoriesData, error: categoriesError } = await supabase
    .from('posts')
    .select('category')
    .eq('status', 'published');

  const allCategories = categoriesData
    ? [...new Set(categoriesData.map(post => post.category).filter(Boolean))]
    : [];

  if (!posts || posts.length === 0) {
    notFound();
  }

  return { 
    posts: posts || [], 
    recentPosts: recentPosts || [], 
    allCategories, 
    displayName: capitalizeCategory(categoryName) 
  };
}

// --- Metadados (Sem alterações) ---
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // 👈 precisa aguardar
  const displayName = decodeURIComponent(resolvedParams.categoria);
  
  return {
    title: `Categoria: ${displayName}`,
    description: `Veja todos os posts da categoria ${displayName}.`,
  };
}

// --- Início da Página da Categoria ---

export default async function CategoriaPage({ params }) {
  
  const resolvedParams = await params; // 👈 aguarda
  const categoria = resolvedParams.categoria;

  const { posts, recentPosts, allCategories, displayName } = await getPageData(categoria);

  return (
    <div className="mt-[100px] bg-[#fdfcfc]">
      
      {/* 1. SEÇÃO HERO (com o título da categoria) */}
      <section className="bg-white shadow-sm border-b border-gray-100">
        {/* Adicionado text-center ao container */}
        <div className="max-w-7xl mx-auto px-4 py-16 text-center"> 
          <p className="text-lg font-semibold text-[#0958d7] mb-2">
            Categoria
          </p>
          <h1 className="text-5xl font-bold text-[#0d3074] mb-4">
            {displayName}
          </h1>
          
          {/* --- 2. BOTÃO ADICIONADO --- */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0958d7] transition-colors mt-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para todas as postagens
          </Link>
          {/* --- Fim do Botão --- */}

        </div>
      </section>

      {/* 2. CONTEÚDO E SIDEBAR (Sem alterações) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          {/* Coluna Principal */}
          <main className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-28 space-y-8">
              <RecentPostsWidget posts={recentPosts} />
              <CategoriesWidget categories={allCategories} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

// --- Componentes Reutilizáveis (Sem alterações) ---

function PostCard({ post }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col"
    >
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
      <div className="p-6 flex flex-col flex-1">
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
        <h2 className="text-2xl font-bold text-[#0d3074] mb-3 group-hover:text-[#0958d7] transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
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

function CategoriesWidget({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <SidebarWidget title="Categorias">
      {categories.map(category => (
        <Link 
          key={category} 
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