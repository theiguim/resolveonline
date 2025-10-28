// Este pode ser um Server Component (não precisa de 'use client')
export default function Footer() {
  return (
    <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner mt-auto flex-shrink-0">
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Resolve Online. Todos os direitos reservados.
      </p>
    </footer>
  );
}
