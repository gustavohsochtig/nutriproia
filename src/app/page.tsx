'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Dumbbell, Target, CreditCard, QrCode, Copy, Check, Loader2 } from 'lucide-react';

export default function Home() {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixData, setPixData] = useState<any>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cpf: '',
  });

  const handleGeneratePix = async () => {
    if (!formData.email || !formData.fullName || !formData.cpf) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoadingPix(true);
    try {
      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.email,
          amount: 49.90,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPixData(data);
      } else {
        alert('Erro ao gerar PIX: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar PIX. Tente novamente.');
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCopyPix = async () => {
    if (pixData?.pixCopyPaste) {
      try {
        // Tenta usar a Clipboard API moderna
        await navigator.clipboard.writeText(pixData.pixCopyPaste);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback: cria um elemento temporário para copiar
        const textArea = document.createElement('textarea');
        textArea.value = pixData.pixCopyPaste;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Erro ao copiar:', error);
          alert('Não foi possível copiar automaticamente. Por favor, copie manualmente o código PIX.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => {
              setShowPayment(false);
              setPixData(null);
            }}
            className="mb-4"
          >
            ← Voltar
          </Button>

          <Card className="shadow-2xl border-emerald-200">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl">Assine Agora</CardTitle>
              <CardDescription className="text-emerald-50">
                Acesso completo ao seu plano de dieta personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-2">R$ 49,90</div>
                <div className="text-gray-600">por mês</div>
              </div>

              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'pix' | 'credit_card')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="credit_card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Cartão
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="space-y-4 mt-6">
                  {!pixData ? (
                    <>
                      <div className="space-y-4 mb-6">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="full-name">Nome Completo</Label>
                          <Input 
                            id="full-name" 
                            placeholder="Seu nome completo"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input 
                            id="cpf" 
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleGeneratePix}
                        disabled={loadingPix}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg"
                      >
                        {loadingPix ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Gerando PIX...
                          </>
                        ) : (
                          'Gerar PIX'
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="bg-emerald-50 p-6 rounded-lg">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                          PIX Gerado com Sucesso!
                        </h3>
                        <p className="text-sm text-gray-600">
                          Escaneie o QR Code ou copie o código abaixo
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                        <img 
                          src={pixData.qrCode} 
                          alt="QR Code PIX" 
                          className="w-64 h-64"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Código PIX Copia e Cola:</Label>
                          <div className="flex gap-2 mt-1">
                            <Input 
                              value={pixData.pixCopyPaste}
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button
                              onClick={handleCopyPix}
                              variant="outline"
                              className="flex-shrink-0"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Instruções:</strong>
                          </p>
                          <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                            <li>Abra o app do seu banco</li>
                            <li>Escolha pagar com PIX</li>
                            <li>Escaneie o QR Code ou cole o código</li>
                            <li>Confirme o pagamento de R$ 49,90</li>
                          </ol>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            Após o pagamento, seu acesso será liberado automaticamente
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Código expira em {Math.floor(pixData.expiresIn / 60)} minutos
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="credit_card" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-number">Número do Cartão</Label>
                      <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Nome no Cartão</Label>
                      <Input id="name" placeholder="Nome completo" />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="email-card">Email</Label>
                      <Input id="email-card" type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="full-name-card">Nome Completo</Label>
                      <Input id="full-name-card" placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <Label htmlFor="cpf-card">CPF</Label>
                      <Input id="cpf-card" placeholder="000.000.000-00" />
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg mt-6">
                    Confirmar Pagamento
                  </Button>
                </TabsContent>
              </Tabs>

              <p className="text-xs text-center text-gray-500 mt-4">
                Pagamento seguro processado via Ruyter Payments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            NutriPro AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Seu nutricionista pessoal com inteligência artificial
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Dietas personalizadas baseadas no seu peso, altura, idade e objetivos. Alcance seus resultados de forma saudável e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowPayment(true)}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Assinar Agora
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Apple className="h-12 w-12 text-emerald-500 mb-2" />
              <CardTitle>Dieta Personalizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Plano alimentar calculado especificamente para você, considerando suas características e objetivos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-teal-500 mb-2" />
              <CardTitle>Objetivos Claros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Quer perder, manter ou ganhar peso? Nosso sistema adapta as calorias e macros para seu objetivo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Dumbbell className="h-12 w-12 text-emerald-600 mb-2" />
              <CardTitle>Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitore seu progresso diariamente e ajuste seu plano conforme evolui.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="max-w-md mx-auto shadow-2xl border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Plano Mensal</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-emerald-600 mb-2">R$ 49,90</div>
              <div className="text-gray-600">por mês</div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span>Dieta personalizada completa</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span>5 refeições diárias planejadas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span>Cálculo de macronutrientes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span>Atualizações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span>Suporte via WhatsApp</span>
              </li>
            </ul>
            <Button 
              onClick={() => setShowPayment(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg"
            >
              Começar Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
