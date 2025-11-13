import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Função para calcular CRC16 (necessário para PIX)
function crc16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// Função para formatar valor para PIX
function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

// Função para criar campo PIX
function createPixField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

// Função para gerar código PIX Copia e Cola
function generatePixCode(pixKey: string, amount: number, name: string, city: string, txid: string): string {
  // Payload Format Indicator
  let payload = createPixField('00', '01');
  
  // Merchant Account Information
  const gui = createPixField('00', 'br.gov.bcb.pix');
  const key = createPixField('01', pixKey);
  const merchantAccount = createPixField('26', gui + key);
  payload += merchantAccount;
  
  // Merchant Category Code
  payload += createPixField('52', '0000');
  
  // Transaction Currency
  payload += createPixField('53', '986');
  
  // Transaction Amount
  payload += createPixField('54', formatAmount(amount));
  
  // Country Code
  payload += createPixField('58', 'BR');
  
  // Merchant Name
  payload += createPixField('59', name.substring(0, 25));
  
  // Merchant City
  payload += createPixField('60', city.substring(0, 15));
  
  // Additional Data Field
  const additionalData = createPixField('05', txid.substring(0, 25));
  payload += createPixField('62', additionalData);
  
  // CRC16
  payload += '6304';
  const crc = crc16(payload);
  payload += crc;
  
  return payload;
}

// Função para buscar dados bancários do admin
async function getAdminBankData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/bank-data`);
    if (!response.ok) {
      throw new Error('Dados bancários não configurados');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      );
    }
    
    // Busca os dados bancários reais do administrador
    const adminData = await getAdminBankData();
    
    if (!adminData || !adminData.pixKey) {
      return NextResponse.json(
        { 
          error: 'Sistema de pagamento não configurado. Entre em contato com o suporte.',
          details: 'O administrador precisa configurar a chave PIX no painel administrativo.'
        },
        { status: 503 }
      );
    }
    
    // Gera um ID de transação único
    const txid = `NUTRIPRO${Date.now().toString().slice(-10)}`;
    
    // Usa a chave PIX REAL do administrador
    const pixCopyPaste = generatePixCode(
      adminData.pixKey,
      amount,
      adminData.pixName || 'NUTRIPRO AI',
      adminData.city || 'SAO PAULO',
      txid
    );
    
    // Gera o QR Code a partir do código PIX
    const qrCodeDataUrl = await QRCode.toDataURL(pixCopyPaste, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    // Log para debug (remover em produção)
    console.log('PIX gerado com sucesso:', {
      pixKey: adminData.pixKey,
      amount,
      txid,
    });
    
    return NextResponse.json({
      success: true,
      pixKey: adminData.pixKey,
      qrCode: qrCodeDataUrl,
      pixCopyPaste: pixCopyPaste,
      amount: amount,
      txid: txid,
      expiresIn: 3600, // 1 hora em segundos
      message: 'PIX gerado com sucesso! Escaneie o QR Code ou copie o código para pagar.',
      recipientName: adminData.pixName || 'NUTRIPRO AI',
    });
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao gerar pagamento PIX',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para verificar status do pagamento
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const txid = searchParams.get('txid');
    
    if (!txid) {
      return NextResponse.json(
        { error: 'ID da transação não fornecido' },
        { status: 400 }
      );
    }
    
    // Em produção, você consultaria o status no banco de dados
    // const transaction = await getTransaction(txid);
    
    // Simulação de resposta
    return NextResponse.json({
      status: 'pending', // pending, approved, expired
      txid: txid,
      message: 'Aguardando pagamento',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao verificar status do pagamento' },
      { status: 500 }
    );
  }
}
