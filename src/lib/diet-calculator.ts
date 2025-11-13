import { UserProfile, DietPlan, Meal } from './types';

export function calculateCalories(profile: UserProfile): number {
  // Fórmula de Harris-Benedict
  let bmr: number;
  
  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  }

  // Multiplicador de atividade
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  let calories = bmr * activityMultipliers[profile.activityLevel];

  // Ajuste baseado no objetivo
  if (profile.goal === 'lose') {
    calories -= 500; // Déficit de 500 calorias
  } else if (profile.goal === 'gain') {
    calories += 500; // Superávit de 500 calorias
  }

  return Math.round(calories);
}

export function generateDietPlan(profile: UserProfile): DietPlan {
  const totalCalories = calculateCalories(profile);
  
  // Distribuição de macronutrientes
  const protein = Math.round((totalCalories * 0.30) / 4); // 30% proteína
  const carbs = Math.round((totalCalories * 0.40) / 4); // 40% carboidratos
  const fats = Math.round((totalCalories * 0.30) / 9); // 30% gorduras

  const meals: Meal[] = [
    {
      id: '1',
      name: 'Café da Manhã',
      time: '07:00',
      calories: Math.round(totalCalories * 0.25),
      foods: [
        { name: 'Ovos mexidos', quantity: '2 unidades', calories: 140, protein: 12, carbs: 2, fats: 10 },
        { name: 'Pão integral', quantity: '2 fatias', calories: 160, protein: 8, carbs: 28, fats: 2 },
        { name: 'Abacate', quantity: '1/2 unidade', calories: 120, protein: 2, carbs: 6, fats: 11 },
        { name: 'Café com leite', quantity: '200ml', calories: 80, protein: 6, carbs: 10, fats: 2 }
      ]
    },
    {
      id: '2',
      name: 'Lanche da Manhã',
      time: '10:00',
      calories: Math.round(totalCalories * 0.10),
      foods: [
        { name: 'Iogurte natural', quantity: '150g', calories: 90, protein: 8, carbs: 12, fats: 2 },
        { name: 'Granola', quantity: '30g', calories: 120, protein: 3, carbs: 20, fats: 4 }
      ]
    },
    {
      id: '3',
      name: 'Almoço',
      time: '12:30',
      calories: Math.round(totalCalories * 0.35),
      foods: [
        { name: 'Arroz integral', quantity: '4 colheres', calories: 180, protein: 4, carbs: 38, fats: 1 },
        { name: 'Feijão', quantity: '2 conchas', calories: 140, protein: 10, carbs: 24, fats: 1 },
        { name: 'Frango grelhado', quantity: '150g', calories: 240, protein: 45, carbs: 0, fats: 6 },
        { name: 'Salada verde', quantity: '1 prato', calories: 50, protein: 2, carbs: 8, fats: 1 },
        { name: 'Azeite', quantity: '1 colher', calories: 90, protein: 0, carbs: 0, fats: 10 }
      ]
    },
    {
      id: '4',
      name: 'Lanche da Tarde',
      time: '16:00',
      calories: Math.round(totalCalories * 0.10),
      foods: [
        { name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fats: 0 },
        { name: 'Pasta de amendoim', quantity: '1 colher', calories: 95, protein: 4, carbs: 3, fats: 8 }
      ]
    },
    {
      id: '5',
      name: 'Jantar',
      time: '19:30',
      calories: Math.round(totalCalories * 0.20),
      foods: [
        { name: 'Batata doce', quantity: '200g', calories: 180, protein: 4, carbs: 41, fats: 0 },
        { name: 'Peixe grelhado', quantity: '150g', calories: 200, protein: 40, carbs: 0, fats: 4 },
        { name: 'Brócolis', quantity: '1 xícara', calories: 55, protein: 4, carbs: 11, fats: 1 }
      ]
    }
  ];

  return {
    id: Date.now().toString(),
    userId: profile.id,
    calories: totalCalories,
    protein,
    carbs,
    fats,
    meals,
    createdAt: new Date()
  };
}
