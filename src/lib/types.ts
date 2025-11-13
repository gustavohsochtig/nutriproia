export interface UserProfile {
  id: string;
  email: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  subscriptionStatus: 'trial' | 'active' | 'expired';
  subscriptionEnd?: Date;
  isAdmin?: boolean;
}

export interface DietPlan {
  id: string;
  userId: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Meal[];
  createdAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  calories: number;
}

export interface Food {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface PaymentData {
  userId: string;
  amount: number;
  method: 'pix' | 'credit_card';
  status: 'pending' | 'approved' | 'rejected';
  transactionId?: string;
  pixKey?: string; // Chave PIX aleatória gerada para este pagamento
  createdAt: Date;
}

export interface AdminSettings {
  ruyterApiKey: string;
  ruyterAccountId: string;
  monthlyPrice: number;
  pixKey?: string;
  pixName?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface BankData {
  ruyterApiKey: string;
  ruyterAccountId: string;
  bankName: string;
  bankAccount: string;
  pixKey?: string;
  pixName?: string;
  monthlyPrice: number;
}

export interface PixPaymentResponse {
  success: boolean;
  pixKey: string; // Chave aleatória única para este pagamento
  qrCode: string;
  pixCopyPaste: string;
  amount: number;
  expiresIn: number;
  message: string;
}
