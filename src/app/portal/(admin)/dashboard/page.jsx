import { cookies } from 'next/headers';
import { createServer } from '@/lib/supabase/server';
import { ClipboardList, Newspaper } from 'lucide-react';

// Componente auxiliar para o Dashboard
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    // Usando as cores do tema
    blue: 'from-medium-blue to-hard-blue',
    green: 'from-green-500 to-green-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium uppercase opacity-80">{title}</p>
          <p className="text-4xl font-bold">{value || 0}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Esta é uma Server Component Page
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);

  // Busca dados reais do Supabase
  const { count: formCount, error: formError } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true });

  const { count: postCount, error: postError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });
  
  if(formError) console.error("Erro ao buscar contagem de formulários:", formError.message);
  if(postError) console.error("Erro ao buscar contagem de posts:", postError.message);

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Formulários Recebidos"
          value={formCount}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard 
          title="Posts no Blog"
          value={postCount}
          icon={Newspaper}
          color="green"
        />
        {/* Adicione mais cards conforme necessário */}
      </div>
    </div>
  );
}
