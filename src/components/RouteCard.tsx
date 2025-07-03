
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Trash2, ExternalLink } from 'lucide-react';
import { Route as RouteType } from '@/types/api';

interface RouteCardProps {
  route: RouteType;
  onDelete: (id: string) => void;
  onEdit?: (route: RouteType) => void;
}

export function RouteCard({ route, onDelete, onEdit }: RouteCardProps) {
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar esta rota?')) {
      onDelete(route.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{route.name || route.path}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {route.path}
                </code>
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(route)}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {route.description && (
          <p className="text-sm text-gray-600 mb-3">{route.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Targets:</span>
            <Badge variant="secondary">{route.targets.length} servidor(es)</Badge>
          </div>
          
          <div className="space-y-1">
            {route.targets.map((target, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  index === route.current 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  index === route.current ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <code className="flex-1">{target}</code>
                {index === route.current && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                    Ativo
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
