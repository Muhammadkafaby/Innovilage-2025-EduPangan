'use client';

import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { ProgressBar } from '../shared/ProgressBar';
import { Toggle } from '../shared/Toggle';
import { recipes } from '../../data/staticData';

const MenuGizi = ({ onNavigateBack, userHarvests = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showOnlyFromGarden, setShowOnlyFromGarden] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = [
    { id: 'Semua', icon: 'grid' },
    { id: 'Sayuran', icon: 'sparkles' },
    { id: 'Lauk', icon: 'fire' },
    { id: 'Salad', icon: 'heart' },
    { id: 'Sup', icon: 'drop' },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'Semua' || recipe.category === selectedCategory;

    const hasGardenIngredients = recipe.ingredients.some(
      (ing) => ing.fromGarden
    );
    const matchesGardenFilter = !showOnlyFromGarden || hasGardenIngredients;

    return matchesCategory && matchesGardenFilter;
  });

  const nutritionTargets = [
    { label: 'Sayur & Buah', current: 280, target: 400, unit: 'g', color: 'green' },
    { label: 'Protein', current: 45, target: 60, unit: 'g', color: 'orange' },
    { label: 'Serat', current: 18, target: 25, unit: 'g', color: 'blue' },
  ];

  if (selectedRecipe) {
    const gardenIngredientsCount = selectedRecipe.ingredients.filter(
      (i) => i.fromGarden
    ).length;

    return (
      <div className="min-h-screen bg-transparent pb-8">
        <div className="px-6 pt-8 pb-4">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="neo-button w-10 h-10 flex items-center justify-center mb-4 border border-white/45"
          >
            <Icon name="arrowLeft" size={20} color="#6B7280" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Detail Resep</h1>
        </div>

        <div className="px-6 space-y-5">
          <div className="neo-card overflow-hidden border border-white/45">
            <div className="w-full h-48 neo-inset flex items-center justify-center">
              <div className="w-24 h-24 neo-button rounded-2xl flex items-center justify-center">
                <Icon name="heart" size={48} color="#F97316" />
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h2>
              
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Icon name="clock" size={14} />
                  {selectedRecipe.prepTime} + {selectedRecipe.cookTime}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Icon name="fire" size={14} />
                  {selectedRecipe.difficulty}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Icon name="users" size={14} />
                  {selectedRecipe.servings} porsi
                </div>
              </div>

              {gardenIngredientsCount > 0 && (
                <Badge variant="success" className="mb-4">
                  <Icon name="sparkles" size={12} color="white" className="mr-1" />
                  {gardenIngredientsCount} bahan dari kebun
                </Badge>
              )}

              <div className="neo-inset p-4 rounded-xl mb-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3">
                  Informasi Gizi (per porsi)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="neo-button p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-500">Kalori</p>
                    <p className="font-bold text-gray-800">{selectedRecipe.nutritionPerServing.calories}</p>
                  </div>
                  <div className="neo-button p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-500">Protein</p>
                    <p className="font-bold text-gray-800">{selectedRecipe.nutritionPerServing.protein}</p>
                  </div>
                  <div className="neo-button p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-500">Karbo</p>
                    <p className="font-bold text-gray-800">{selectedRecipe.nutritionPerServing.carbs}</p>
                  </div>
                  <div className="neo-button p-3 rounded-xl text-center">
                    <p className="text-xs text-gray-500">Lemak</p>
                    <p className="font-bold text-gray-800">{selectedRecipe.nutritionPerServing.fat}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-3">Bahan-bahan</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className={`neo-inset p-3 rounded-xl flex items-center justify-between ${
                        ingredient.fromGarden ? 'border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          ingredient.fromGarden ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon
                            name={ingredient.fromGarden ? 'sparkles' : 'shoppingBag'}
                            size={16}
                            color={ingredient.fromGarden ? '#4CAF50' : '#9CA3AF'}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {ingredient.item}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3">Cara Membuat</h3>
                <div className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 neo-button rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-orange-500">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button
              onClick={() => alert('Resep disimpan ke favorit!')}
              className="neo-button py-4 flex items-center justify-center gap-2 text-red-500 font-semibold border border-white/45"
            >
              <Icon name="heart" size={20} color="#EF4444" />
              Simpan
            </button>
            <button
              onClick={() => alert('Fitur bagikan akan segera hadir!')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:neo-button-active"
            >
              <Icon name="share" size={20} color="white" />
              Bagikan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-8">
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onNavigateBack}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4 border border-white/45"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Menu Gizi Sehat</h1>
        <p className="text-sm text-gray-500">
          Rekomendasi menu dari hasil panen Anda ({userHarvests.length} hasil kebun)
        </p>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap
                  font-medium text-sm transition-all
                  ${selectedCategory === cat.id
                    ? 'neo-button text-orange-500 border border-white/45'
                    : 'neo-inset text-gray-500'
                  }
                `}
              >
                <Icon
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? '#F97316' : '#9CA3AF'}
                />
                {cat.id}
              </button>
            ))}
          </div>
        </div>

        <div className="neo-card p-4 border border-white/45">
          <Toggle
            enabled={showOnlyFromGarden}
            onChange={setShowOnlyFromGarden}
            label="Dari Kebun Saya"
            description="Tampilkan menu yang bisa dibuat dengan hasil panen"
          />
        </div>
      </div>

      <div className="px-6">
        <p className="text-sm text-gray-500 mb-4">
          {filteredRecipes.length} resep tersedia
        </p>

        <div className="space-y-4">
          {filteredRecipes.map((recipe) => {
            const gardenIngredientsCount = recipe.ingredients.filter(
              (i) => i.fromGarden
            ).length;

            return (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full neo-card overflow-hidden text-left active:neo-button-active transition-all border border-white/45"
              >
                <div className="flex">
                  <div className="w-28 h-28 neo-inset flex items-center justify-center flex-shrink-0">
                    <Icon name="heart" size={40} color="#F97316" />
                  </div>

                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{recipe.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Icon name="clock" size={12} /> {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="fire" size={12} /> {recipe.difficulty}
                      </span>
                    </div>

                    {gardenIngredientsCount > 0 && (
                      <Badge variant="success" className="mb-2">
                        <Icon name="sparkles" size={10} color="white" className="mr-1" />
                        {gardenIngredientsCount} dari kebun
                      </Badge>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {recipe.nutritionPerServing.calories} kalori/porsi
                      </span>
                      <span className="text-orange-500 font-semibold flex items-center gap-1">
                        Lihat Resep
                        <Icon name="chevronRight" size={14} color="#F97316" />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="heart" size={32} color="#9CA3AF" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Resep tidak ditemukan</p>
            <p className="text-sm text-gray-400">Coba ubah filter pencarian</p>
          </div>
        )}
      </div>

      <div className="px-6 mt-6">
        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center">
              <Icon name="chart" size={20} color="#4CAF50" />
            </div>
            <h3 className="font-bold text-gray-800">Target Gizi Harian</h3>
          </div>

          <div className="space-y-4">
            {nutritionTargets.map((item, idx) => (
              <div key={idx}>
                <ProgressBar
                  value={item.current}
                  max={item.target}
                  color={item.color}
                  showLabel
                  label={item.label}
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {item.current}/{item.target} {item.unit}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Data berdasarkan catatan panen Anda hari ini
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuGizi;
