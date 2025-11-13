'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, TrendingDown, Calendar, Target, Dumbbell, User } from 'lucide-react';
import { generateDietPlan } from '@/lib/diet-calculator';
import { UserProfile, DietPlan } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const handleGenerateDiet = () => {
    const fullProfile: UserProfile = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'Usuário',
      weight: profile.weight || 70,
      height: profile.height || 170,
      age: profile.age || 30,
      gender: profile.gender || 'male',
      activityLevel: profile.activityLevel || 'moderate',
      goal: profile.goal || 'maintain',
      subscriptionStatus: 'active'
    };
    
    const diet = generateDietPlan(fullProfile);
    setDietPlan(diet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Meu Plano Nutricional
          </h1>
          <p className="text-slate-600">Gerencie sua dieta e acompanhe seu progresso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <User className="h-4 w-4" />
                Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">Ativa</div>
              <p className="text-xs text-slate-500 mt-1">Renovação em 30 dias</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">-2.5 kg</div>
              <p className="text-xs text-slate-500 mt-1">Nos últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">65 kg</div>
              <p className="text-xs text-slate-500 mt-1">Faltam 5 kg</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Meus Dados
              </CardTitle>
              <CardDescription>Atualize suas informações para recalcular sua dieta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={profile.weight}
                    onChange={(e) => setProfile({...profile, weight: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    value={profile.height}
                    onChange={(e) => setProfile({...profile, height: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={profile.gender} onValueChange={(v) => setProfile({...profile, gender: v as 'male' | 'female'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Nível de Atividade</Label>
                <Select value={profile.activityLevel} onValueChange={(v) => setProfile({...profile, activityLevel: v as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário</SelectItem>
                    <SelectItem value="light">Levemente Ativo</SelectItem>
                    <SelectItem value="moderate">Moderadamente Ativo</SelectItem>
                    <SelectItem value="active">Muito Ativo</SelectItem>
                    <SelectItem value="very_active">Extremamente Ativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal">Objetivo</Label>
                <Select value={profile.goal} onValueChange={(v) => setProfile({...profile, goal: v as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Perder Peso</SelectItem>
                    <SelectItem value="maintain">Manter Peso</SelectItem>
                    <SelectItem value="gain">Ganhar Peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateDiet}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Gerar Nova Dieta
              </Button>
            </CardContent>
          </Card>

          {dietPlan && (
            <Card className="shadow-lg border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-emerald-600" />
                  Seu Plano Diário
                </CardTitle>
                <CardDescription>Macronutrientes calculados para você</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-emerald-600">{dietPlan.calories}</div>
                    <div className="text-sm text-gray-600">Calorias/dia</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">{dietPlan.protein}g</div>
                    <div className="text-sm text-gray-600">Proteínas</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-600">{dietPlan.carbs}g</div>
                    <div className="text-sm text-gray-600">Carboidratos</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">{dietPlan.fats}g</div>
                    <div className="text-sm text-gray-600">Gorduras</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Refeições de Hoje
                  </h3>
                  {dietPlan.meals.map((meal) => (
                    <div key={meal.id} className="border border-emerald-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-emerald-700">{meal.name}</h4>
                        <span className="text-xs text-gray-500">{meal.time}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {meal.calories} kcal • {meal.foods.length} alimentos
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {dietPlan && (
          <Card className="shadow-lg border-emerald-200 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-emerald-600" />
                Detalhes das Refeições
              </CardTitle>
              <CardDescription>Plano alimentar completo para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dietPlan.meals.map((meal) => (
                  <div key={meal.id} className="border border-emerald-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-emerald-700">{meal.name}</h3>
                      <span className="text-sm text-gray-500 bg-emerald-50 px-3 py-1 rounded-full">{meal.time}</span>
                    </div>
                    <div className="space-y-3">
                      {meal.foods.map((food, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium text-slate-800">{food.name}</div>
                            <div className="text-sm text-slate-500">{food.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-emerald-600">{food.calories} kcal</div>
                            <div className="text-xs text-slate-500">
                              P: {food.protein}g • C: {food.carbs}g • G: {food.fats}g
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-200">
                      <div className="flex justify-between text-sm font-semibold text-slate-700">
                        <span>Total da Refeição</span>
                        <span>{meal.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
