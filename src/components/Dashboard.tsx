
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RouteCard } from './RouteCard';
import { RouteForm } from './RouteForm';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Route } from '@/types/api';
import { 
  Plus, 
  LogOut, 
  Server, 
  Search, 
  RefreshCw,
  Activity,
  Globe,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const { logout } = useAuth();
  const { toast } = useToast();

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRoutes();
      setRoutes(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as rotas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleCreateRoute = async (routeData: Omit<Route, 'id' | 'current'>) => {
    try {
      await apiService.createRoute(routeData);
      await loadRoutes();
      setShowForm(false);
      toast({
        title: "Sucesso",
        description: "Rota criada com sucesso!",
      });
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteRoute = async (id: string) => {
    try {
      await apiService.deleteRoute(id);
      await loadRoutes();
      toast({
        title: "Sucesso",
        description: "Rota removida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a rota",
        variant: "destructive",
      });
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTargets = routes.reduce((sum, route) => sum + route.targets.length, 0);

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <RouteForm
            onSubmit={handleCreateRoute}
            onCancel={() => setShowForm(false)}
            initialData={editingRoute || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Proxy Reverso</h1>
                <p className="text-sm text-gray-600">Gerenciamento de Rotas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadRoutes}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Rotas</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
              <p className="text-xs text-muted-foreground">
                rotas configuradas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Targets</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTargets}</div>
              <p className="text-xs text-muted-foreground">
                servidores configurados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Ativo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                proxy funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar rotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Rota
          </Button>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredRoutes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma rota encontrada' : 'Nenhuma rota configurada'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos da busca'
                  : 'Comece criando sua primeira rota para o proxy reverso'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Rota
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRoutes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onDelete={handleDeleteRoute}
                onEdit={(route) => {
                  setEditingRoute(route);
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
