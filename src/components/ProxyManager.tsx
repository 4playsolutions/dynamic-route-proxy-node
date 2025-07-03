
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/services/api';
import { ManagedProxy } from '@/types/api';
import { 
  Plus, 
  Server, 
  Trash2, 
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProxyManager() {
  const [proxies, setProxies] = useState<ManagedProxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ip: '',
    port: 3000,
    username: '',
    password: '',
    privateKey: '',
    usePrivateKey: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const loadProxies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getManagedProxies();
      setProxies(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os proxies gerenciados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProxies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.ip || !formData.username || (!formData.password && !formData.privateKey)) {
      setError('IP, usuário e senha/chave privada são obrigatórios');
      setSubmitting(false);
      return;
    }

    try {
      await apiService.addManagedProxy({
        ip: formData.ip,
        port: formData.port,
        username: formData.username,
        password: formData.usePrivateKey ? undefined : formData.password,
        privateKey: formData.usePrivateKey ? formData.privateKey : undefined,
      });

      await loadProxies();
      setShowForm(false);
      setFormData({
        ip: '',
        port: 3000,
        username: '',
        password: '',
        privateKey: '',
        usePrivateKey: false,
      });
      
      toast({
        title: "Sucesso",
        description: "Proxy adicionado com sucesso! O deploy pode levar alguns minutos.",
      });
    } catch (error: any) {
      setError(error.message || 'Erro ao adicionar proxy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveProxy = async (ip: string, port: number) => {
    if (!window.confirm('Tem certeza que deseja remover este proxy?')) return;

    try {
      await apiService.removeManagedProxy(ip, port);
      await loadProxies();
      toast({
        title: "Sucesso",
        description: "Proxy removido com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o proxy",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'deploying':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showForm) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Novo Proxy
          </CardTitle>
          <CardDescription>
            Configure um novo servidor proxy para balanceamento de carga
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP do Servidor *</Label>
                <Input
                  id="ip"
                  placeholder="ex: 192.168.1.100"
                  value={formData.ip}
                  onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">Porta</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="3000"
                  value={formData.port}
                  onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuário SSH *</Label>
              <Input
                id="username"
                placeholder="ex: root"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="usePrivateKey"
                  checked={formData.usePrivateKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, usePrivateKey: e.target.checked }))}
                />
                <Label htmlFor="usePrivateKey">Usar chave privada SSH</Label>
              </div>
            </div>

            {formData.usePrivateKey ? (
              <div className="space-y-2">
                <Label htmlFor="privateKey">Chave Privada SSH *</Label>
                <Textarea
                  id="privateKey"
                  placeholder="-----BEGIN PRIVATE KEY-----..."
                  value={formData.privateKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, privateKey: e.target.value }))}
                  rows={4}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="password">Senha SSH *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha do usuário SSH"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? 'Adicionando...' : 'Adicionar Proxy'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Proxies Gerenciados</h2>
          <p className="text-gray-600">Gerencia servidores proxy para balanceamento de carga</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProxies}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Proxy
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : proxies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum proxy gerenciado
            </h3>
            <p className="text-gray-600 mb-4">
              Adicione servidores proxy para distribuir a carga automaticamente
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Proxy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {proxies.map((proxy) => (
            <Card key={`${proxy.ip}:${proxy.port}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(proxy.status)}
                    <div>
                      <CardTitle className="text-lg">{proxy.ip}:{proxy.port}</CardTitle>
                      <CardDescription>
                        Adicionado em {new Date(proxy.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProxy(proxy.ip, proxy.port)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={getStatusColor(proxy.status)}>
                    {proxy.status === 'active' && 'Ativo'}
                    {proxy.status === 'deploying' && 'Implantando'}
                    {proxy.status === 'error' && 'Erro'}
                    {proxy.status === 'inactive' && 'Inativo'}
                  </Badge>
                </div>
                
                {proxy.lastSeen && (
                  <div className="mt-2 text-sm text-gray-600">
                    Última atividade: {new Date(proxy.lastSeen).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
