import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PoemForm from '@/components/PoemForm';
import PoemCard from '@/components/PoemCard';
import PoemList from '@/components/PoemList';
import db from '@/lib/shared/kliv-database';
import { Feather } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentPoem, setCurrentPoem] = useState<{ title: string; content: string; keywords: string } | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handlePoemGenerated = async (poem: { title: string; content: string; keywords: string }) => {
    setCurrentPoem(poem);
    
    // Save poem to database
    try {
      await db.insert('poems', {
        title: poem.title,
        content: poem.content,
        keywords: poem.keywords
      });
      
      // Refresh the poem list
      queryClient.invalidateQueries({ queryKey: ['poems'] });
    } catch (error) {
      console.error('Error saving poem:', error);
      toast({
        title: "Save failed",
        description: "Poem was generated but couldn't be saved.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Feather className="h-8 w-8 text-purple-600" />
            <h1 className="font-playfair text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Poem Generator
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2 font-inter">
            Transform your keywords into beautiful poetry
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Poem Generation Form */}
        <section className="mb-16">
          <PoemForm onPoemGenerated={handlePoemGenerated} />
        </section>

        {/* Current Generated Poem */}
        {currentPoem && (
          <section className="mb-16 animate-in fade-in duration-500">
            <h2 className="font-playfair text-3xl font-bold text-center text-purple-900 mb-8">
              Your Latest Creation
            </h2>
            <div className="max-w-3xl mx-auto">
              <PoemCard
                title={currentPoem.title}
                content={currentPoem.content}
                keywords={currentPoem.keywords}
              />
            </div>
          </section>
        )}

        {/* Previously Created Poems */}
        <section>
          <h2 className="font-playfair text-3xl font-bold text-center text-purple-900 mb-8">
            Poetry Collection
          </h2>
          <PoemList />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p className="font-inter text-sm">
            Powered by AI • Creating beauty with words
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;