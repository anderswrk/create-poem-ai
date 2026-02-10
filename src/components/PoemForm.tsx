import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import functions from '@/lib/shared/kliv-functions';
import { useToast } from '@/hooks/use-toast';

interface PoemFormProps {
  onPoemGenerated: (poem: { title: string; content: string; keywords: string }) => void;
}

export default function PoemForm({ onPoemGenerated }: PoemFormProps) {
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywords.trim()) {
      toast({
        title: "Keywords required",
        description: "Please enter some keywords to inspire your poem.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await functions.post('generate-poem', { keywords });
      
      if (response.success) {
        onPoemGenerated(response.poem);
        setKeywords('');
        toast({
          title: "Poem created! ✨",
          description: "Your beautiful poem has been generated.",
        });
      } else {
        throw new Error('Failed to generate poem');
      }
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate poem. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter keywords (e.g., sunset, ocean, dreams, moonlight)..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={isGenerating}
            className="pr-4 py-6 text-lg bg-white/50 backdrop-blur-sm border-purple-200 focus:border-purple-400 transition-colors"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Crafting your poem...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Poem
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
