
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { Metrics } from '@/types/api';
import { 
  RefreshCw,
  Activity,
  Download,
  Upload,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMetrics();
      setMetrics(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as métricas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    // Atualiza métricas a cada 30 segundos
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalBytes = (type: 'bytesIn' | 'bytesOut') => {
    return Object.values(metrics).reduce((total, metric) => total + metric[type], 0);
  };

  const routeEntries = Object.entries(metrics);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Métricas de Tráfego</h2>
          <p className="text-gray-600">Monitoramento de banda por rota</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadMetrics}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Download</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(getTotalBytes('bytesOut'))}</div>
            <p className="text-xs text-muted-foreground">
              dados enviados aos clientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Upload</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(getTotalBytes('bytesIn'))}</div>
            <p className="text-xs text-muted-foreground">
              dados recebidos dos clientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              rotas com tráfego
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes por rota */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : routeEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma métrica disponível
            </h3>
            <p className="text-gray-600">
              As métricas aparecerão aqui quando houver tráfego nas rotas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detalhes por Rota</h3>
          <div className="grid grid-cols-1 gap-4">
            {routeEntries.map(([routePath, routeMetrics]) => (
              <Card key={routePath}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {routePath}
                    </code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Upload</div>
                        <div className="text-lg font-bold">{formatBytes(routeMetrics.bytesIn)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">Download</div>
                        <div className="text-lg font-bold">{formatBytes(routeMetrics.bytesOut)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
