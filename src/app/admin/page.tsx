'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, DollarSign, Users, TrendingUp, CreditCard, Key, Bell, CheckCircle, Clock, XCircle, Download, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const [ruyterApiKey, setRuyterApiKey] = useState('');
  const [ruyterAccountId, setRuyterAccountId] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixName, setPixName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('49.90');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    loadBankData();
  }, []);

  const loadBankData = async () => {
    try {
      const response = await fetch('/api/admin/bank-data');
      if (response.ok) {
        const data = await response.json();
        setRuyterApiKey(data.ruyterApiKey || '');
        setRuyterAccountId(data.ruyterAccountId || '');
        setBankName(data.bankName || '');
        setBankAccount(data.bankAccount || '');
        setPixKey(data.pixKey || '');
        setPixName(data.pixName || '');
        setMonthlyPrice(data.monthlyPrice?.toString() || '49.90');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/bank-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruyterApiKey,
          ruyterAccountId,
          bankName,
          bankAccount,
          pixKey,
          pixName,
          monthlyPrice: parseFloat(monthlyPrice),
        }),
      });

      if (response.ok) {
        alert('✅ Configurações salvas com sucesso! Agora você está pronto para receber pagamentos.');
      } else {
        alert('❌ Erro ao salvar configurações. Tente novamente.');
      }
    } catch (error) {
      alert('❌ Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Simulação de notificações recentes
  const recentNotifications = [
    { id: 1, message: 'Novo pagamento de R$ 49,90 recebido de João Silva', time: '2 min atrás', type: 'success' },
    { id: 2, message: 'Pagamento de R$ 49,90 aprovado - Maria Santos', time: '15 min atrás', type: 'success' },
    { id: 3, message: 'Pagamento pendente de confirmação - Carlos Souza', time: '1 hora atrás', type: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header com notificações */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Painel Administrativo</h1>
            <p className="text-slate-600">Gerencie seu negócio e acompanhe pagamentos em tempo real</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2">3</Badge>
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* Notificações Recentes */}
        <Card className="mb-6 border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  {notif.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{notif.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-emerald-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">R$ 4.990</div>
                  <p className="text-xs text-slate-500 mt-1">+12% vs mês anterior</p>
                  <div className="mt-3 text-xs text-slate-600">
                    💰 Você recebe: <strong>R$ 4.790</strong> (após taxas)
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Assinantes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">127</div>
                  <p className="text-xs text-slate-500 mt-1">+8 novos esta semana</p>
                  <div className="mt-3 text-xs text-slate-600">
                    📈 Crescimento: <strong>+6.7%</strong>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">23%</div>
                  <p className="text-xs text-slate-500 mt-1">Visitantes → Assinaturas</p>
                  <div className="mt-3 text-xs text-slate-600">
                    🎯 Meta: <strong>25%</strong>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Próximo Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">R$ 6.340</div>
                  <p className="text-xs text-slate-500 mt-1">Previsão para 01/02</p>
                  <div className="mt-3 text-xs text-slate-600">
                    📅 Em <strong>16 dias</strong>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Como o dinheiro chega até você */}
            <Card className="shadow-lg border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Como o Dinheiro Chega Até Você
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Cliente Assina</h4>
                      <p className="text-sm text-slate-600">Cliente escolhe plano e paga via PIX ou Cartão</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Ruyter Processa</h4>
                      <p className="text-sm text-slate-600">Pagamento é validado e aprovado pela Ruyter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Você Recebe</h4>
                      <p className="text-sm text-slate-600">
                        <strong>PIX:</strong> Dinheiro cai na sua conta em segundos<br/>
                        <strong>Cartão:</strong> Dinheiro cai em 1-2 dias úteis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Notificação Automática</h4>
                      <p className="text-sm text-slate-600">Você recebe email e notificação no painel</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-700">
                    <strong>💡 Exemplo:</strong> Cliente paga R$ 49,90 → Ruyter desconta taxa de R$ 1,50 (3%) → 
                    <strong className="text-emerald-600"> Você recebe R$ 48,40</strong> na sua conta bancária cadastrada na Ruyter
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Crescimento nos Últimos 6 Meses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[45, 62, 78, 95, 112, 127].map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${(value / 127) * 100}%` }}
                      />
                      <span className="text-xs text-slate-600 mt-2">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Usuários Cadastrados
                </CardTitle>
                <CardDescription>Lista de todos os usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'João Silva', email: 'joao@email.com', status: 'Ativo', plan: 'Mensal', value: 'R$ 49,90' },
                    { name: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', plan: 'Mensal', value: 'R$ 49,90' },
                    { name: 'Pedro Costa', email: 'pedro@email.com', status: 'Ativo', plan: 'Mensal', value: 'R$ 49,90' },
                    { name: 'Ana Oliveira', email: 'ana@email.com', status: 'Expirado', plan: 'Mensal', value: 'R$ 0,00' },
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-700">{user.value}</span>
                        <span className="text-sm text-slate-600">{user.plan}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Transações Recentes
                </CardTitle>
                <CardDescription>Histórico de pagamentos processados pela Ruyter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'João Silva', amount: 49.90, received: 48.40, method: 'PIX', status: 'Aprovado', date: '15/01/2025', time: '14:32', pixKey: '1736956320abc123' },
                    { user: 'Maria Santos', amount: 49.90, received: 48.40, method: 'Cartão', status: 'Aprovado', date: '15/01/2025', time: '13:15', pixKey: null },
                    { user: 'Carlos Souza', amount: 49.90, received: 0, method: 'PIX', status: 'Pendente', date: '14/01/2025', time: '18:45', pixKey: '1736869500def456' },
                    { user: 'Ana Oliveira', amount: 49.90, received: 0, method: 'Cartão', status: 'Recusado', date: '14/01/2025', time: '16:20', pixKey: null },
                  ].map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        {payment.status === 'Aprovado' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : payment.status === 'Pendente' ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-800">{payment.user}</div>
                          <div className="text-sm text-slate-500">
                            {payment.date} às {payment.time} • {payment.method}
                            {payment.pixKey && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                Chave: {payment.pixKey}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">R$ {payment.amount.toFixed(2)}</div>
                        {payment.received > 0 && (
                          <div className="text-sm text-emerald-600">Você recebeu: R$ {payment.received.toFixed(2)}</div>
                        )}
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-600" />
                  Configurações Gerais
                </CardTitle>
                <CardDescription>Configure o preço da mensalidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthly-price">Preço Mensal (R$)</Label>
                  <Input 
                    id="monthly-price" 
                    type="number" 
                    step="0.01"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-emerald-600" />
                  Integração Ruyter Payments
                </CardTitle>
                <CardDescription>
                  Configure suas credenciais da Ruyter para receber pagamentos diretamente na sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📋 Como Configurar:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Acesse <a href="https://ruyter.com" target="_blank" className="underline font-semibold">ruyter.com</a> e crie sua conta</li>
                    <li>Vá em <strong>Configurações → API</strong> e copie sua API Key</li>
                    <li>Copie também seu <strong>Account ID</strong></li>
                    <li>Cadastre sua <strong>conta bancária</strong> na Ruyter para receber os pagamentos</li>
                    <li>Cole as credenciais abaixo e salve</li>
                  </ol>
                </div>

                <div>
                  <Label htmlFor="ruyter-api-key">Ruyter API Key *</Label>
                  <Input 
                    id="ruyter-api-key" 
                    type="password"
                    placeholder="ruy_live_..."
                    value={ruyterApiKey}
                    onChange={(e) => setRuyterApiKey(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Encontre em: Painel Ruyter → Configurações → API
                  </p>
                </div>

                <div>
                  <Label htmlFor="ruyter-account-id">Ruyter Account ID *</Label>
                  <Input 
                    id="ruyter-account-id" 
                    placeholder="acc_..."
                    value={ruyterAccountId}
                    onChange={(e) => setRuyterAccountId(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    ID da sua conta para receber os pagamentos
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Dados Bancários (Cadastrados na Ruyter)
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank-name">Banco</Label>
                      <Input 
                        id="bank-name" 
                        placeholder="Ex: Banco do Brasil, Nubank, Inter..."
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-account">Conta Bancária</Label>
                      <Input 
                        id="bank-account" 
                        placeholder="Agência e conta (apenas para referência)"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        ⚠️ A conta bancária deve estar cadastrada no painel da Ruyter
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Dados PIX (Opcional - para referência)
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>🔑 Chaves PIX Aleatórias:</strong> O sistema gera automaticamente uma chave PIX única e aleatória para cada pagamento. 
                      Isso aumenta a segurança e permite rastrear cada transação individualmente.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pix-key">Chave PIX (Referência)</Label>
                      <Input 
                        id="pix-key" 
                        placeholder="seu@email.com, CPF ou CNPJ"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Apenas para referência - cada pagamento terá uma chave única
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="pix-name">Nome do Beneficiário</Label>
                      <Input 
                        id="pix-name" 
                        placeholder="Seu nome ou empresa"
                        value={pixName}
                        onChange={(e) => setPixName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg py-6"
                >
                  {isSaving ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Salvar Configurações
                    </>
                  )}
                </Button>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-900 mb-2">✅ Como Funciona Após Configurar:</h4>
                  <ul className="text-sm text-emerald-800 space-y-2">
                    <li>• Cliente assina e paga → Ruyter processa automaticamente</li>
                    <li>• <strong>Chave PIX única</strong> é gerada para cada pagamento (segurança máxima)</li>
                    <li>• Pagamento aprovado → Dinheiro cai na sua conta bancária cadastrada na Ruyter</li>
                    <li>• Você recebe notificação por email e no painel</li>
                    <li>• <strong>PIX:</strong> Dinheiro cai em segundos</li>
                    <li>• <strong>Cartão:</strong> Dinheiro cai em 1-2 dias úteis</li>
                    <li>• Taxa da Ruyter: ~3% por transação (descontada automaticamente)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
