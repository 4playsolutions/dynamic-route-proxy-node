
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Save } from 'lucide-react';
import { Route } from '@/types/api';

interface RouteFormProps {
  onSubmit: (route: Omit<Route, 'id' | 'current'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Route;
}

export function RouteForm({ onSubmit, onCancel, initialData }: RouteFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    path: initialData?.path || '',
    description: initialData?.description || '',
    targets: initialData?.targets || [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!formData.path.startsWith('/')) {
      setError('O caminho deve começar com "/"');
      setLoading(false);
      return;
    }

    const validTargets = formData.targets.filter(target => target.trim() !== '');
    if (validTargets.length === 0) {
      setError('Adicione pelo menos um target válido');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        name: formData.name || formData.path,
        path: formData.path,
        description: formData.description,
        targets: validTargets,
      });
    } catch (err) {
      setError('Erro ao salvar rota. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addTarget = () => {
    setFormData(prev => ({
      ...prev,
      targets: [...prev.targets, '']
    }));
  };

  const removeTarget = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index)
    }));
  };

  const updateTarget = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.map((target, i) => i === index ? value : target)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          {initialData ? 'Editar Rota' : 'Nova Rota'}
        </CardTitle>
        <CardDescription>
          Configure uma nova rota para o proxy reverso
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Rota</Label>
              <Input
                id="name"
                placeholder="ex: API Principal"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="path">Caminho *</Label>
              <Input
                id="path"
                placeholder="ex: /api"
                value={formData.path}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito desta rota..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Targets (Servidores de Destino) *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTarget}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.targets.map((target, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="ex: http://localhost:8080"
                    value={target}
                    onChange={(e) => updateTarget(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.targets.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTarget(index)}
                      className="px-3"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar Rota'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
