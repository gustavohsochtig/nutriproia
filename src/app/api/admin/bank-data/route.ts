import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Aqui você salvaria os dados em um banco de dados
    // Por enquanto, vamos simular o salvamento
    console.log('Dados bancários salvos:', data);
    
    // Validação básica
    if (!data.ruyterApiKey || !data.ruyterAccountId) {
      return NextResponse.json(
        { error: 'API Key e Account ID são obrigatórios' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Dados bancários salvos com sucesso! Agora você está pronto para receber pagamentos.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao salvar dados bancários' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Aqui você buscaria os dados do banco de dados
    // Por enquanto, retornamos dados simulados
    return NextResponse.json({
      ruyterApiKey: 'ruy_live_***************',
      ruyterAccountId: 'acc_***************',
      bankName: 'Banco configurado',
      bankAccount: '****-****',
      pixKey: '***@email.com',
      pixName: 'Seu Nome',
      monthlyPrice: 49.90,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar dados bancários' },
      { status: 500 }
    );
  }
}
