import { useQuery } from '@tanstack/react-query';
import db from '@/lib/shared/kliv-database';
import PoemCard from './PoemCard';
import { Loader2, BookOpen } from 'lucide-react';

export default function PoemList() {
  const { data: poems, isLoading } = useQuery({
    queryKey: ['poems'],
    queryFn: async () => {
      const result = await db.query('poems', {
        _deleted: 'eq.0'
      });
      return result.sort((a: { _created_at: number }, b: { _created_at: number }) => b._created_at - a._created_at);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!poems || poems.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 mx-auto text-purple-300 mb-4" />
        <p className="text-gray-500 text-lg">
          No poems yet. Create your first masterpiece!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {poems.map((poem: { _row_id: string; title?: string; content: string; keywords: string; _created_at: string }) => (
        <PoemCard
          key={poem._row_id}
          title={poem.title || 'Untitled'}
          content={poem.content}
          keywords={poem.keywords}
          createdAt={poem._created_at}
        />
      ))}
    </div>
  );
}
