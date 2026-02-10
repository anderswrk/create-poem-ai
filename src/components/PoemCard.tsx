import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PoemCardProps {
  title: string;
  content: string;
  keywords: string;
  createdAt?: string;
}

export default function PoemCard({ title, content, keywords, createdAt }: PoemCardProps) {
  return (
    <Card className="p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-200 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
      <div className="space-y-6">
        <div>
          <h3 className="font-playfair text-3xl font-bold text-purple-900 mb-2">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.split(',').map((keyword, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                {keyword.trim()}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="font-playfair text-lg text-gray-700 leading-relaxed whitespace-pre-line">
          {content}
        </div>
        
        {createdAt && (
          <p className="text-sm text-gray-500 italic">
            Created {new Date(parseInt(createdAt) * 1000).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}
