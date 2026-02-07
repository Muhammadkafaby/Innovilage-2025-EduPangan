import React, { useState } from 'react';
import { recipes } from '../../data/staticData';

/**
 * Menu Gizi Component
 * Rekomendasi menu sehat berdasarkan hasil panen
 * Features:
 * - Filter by category
 * - Filter by ingredients from garden
 * - Recipe details
 * - Nutrition info
 */
const MenuGizi = ({ onNavigateBack, userHarvests = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showOnlyFromGarden, setShowOnlyFromGarden] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = ['Semua', 'Sayuran', 'Lauk', 'Salad', 'Sup'];

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'Semua' || recipe.category === selectedCategory;

    const hasGardenIngredients = recipe.ingredients.some(
      (ing) => ing.fromGarden
    );
    const matchesGardenFilter = !showOnlyFromGarden || hasGardenIngredients;

    return matchesCategory && matchesGardenFilter;
  });

  // Recipe Detail View
  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="bg-orange-500 pt-8 pb-6 px-6">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="text-white mb-4 flex items-center text-sm font-medium"
          >
            <span className="mr-2">←</span> Kembali
          </button>
          <h1 className="text-2xl font-bold text-white">Detail Resep</h1>
        </div>

        {/* Content */}
        <div className="px-6 -mt-2">
          {/* Recipe Image */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>

            <div className="p-6">
              {/* Title & Meta */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedRecipe.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <span className="mr-1">👨‍🍳</span> {selectedRecipe.difficulty}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span> {selectedRecipe.prepTime} +{' '}
                  {selectedRecipe.cookTime}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">👥</span> {selectedRecipe.servings}{' '}
                  porsi
                </span>
              </div>

              {/* Nutrition Facts */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">
                  Informasi Gizi (per porsi)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Kalori</p>
                    <p className="font-bold text-gray-800">
                      {selectedRecipe.nutritionPerServing.calories}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Protein</p>
                    <p className="font-bold text-gray-800">
                      {selectedRecipe.nutritionPerServing.protein}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Karbohidrat</p>
                    <p className="font-bold text-gray-800">
                      {selectedRecipe.nutritionPerServing.carbs}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Lemak</p>
                    <p className="font-bold text-gray-800">
                      {selectedRecipe.nutritionPerServing.fat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-3">Bahan-bahan</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${ingredient.fromGarden
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {ingredient.fromGarden ? '🌱' : '🛒'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {ingredient.item}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {ingredient.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <span className="mr-1">🌱</span> Dari kebun Anda
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Cara Membuat</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex">
                      <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 active:scale-95">
              ❤️ Simpan
            </button>
            <button className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 active:scale-95">
              📤 Bagikan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recipe List View
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-orange-500 pt-8 pb-6 px-6">
        <button
          onClick={onNavigateBack}
          className="text-white mb-4 flex items-center text-sm font-medium"
        >
          <span className="mr-2">←</span> Kembali
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">Menu Gizi Sehat</h1>
        <p className="text-orange-100 text-sm">
          Rekomendasi menu dari hasil panen Anda
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 space-y-3">
        {/* Category Filter */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Garden Ingredient Toggle */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Dari Kebun Saya
                </p>
                <p className="text-xs text-gray-600">
                  Tampilkan menu yang bisa dibuat dengan hasil panen
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlyFromGarden}
                onChange={(e) => setShowOnlyFromGarden(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-14 h-8 rounded-full transition-colors ${showOnlyFromGarden ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${showOnlyFromGarden ? 'translate-x-7' : 'translate-x-1'
                    } mt-1`}
                ></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="px-6">
        <p className="text-sm text-gray-600 mb-4">
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
                className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow active:scale-98 text-left"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl">🍽️</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                      <span>⏱️ {recipe.prepTime}</span>
                      <span>•</span>
                      <span>👨‍🍳 {recipe.difficulty}</span>
                    </div>

                    {gardenIngredientsCount > 0 && (
                      <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-2">
                        <span className="text-xs font-semibold text-green-700">
                          🌱 {gardenIngredientsCount} bahan dari kebun
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {recipe.nutritionPerServing.calories} kalori/porsi
                      </span>
                      <span className="text-orange-600 font-semibold">
                        Lihat Resep →
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
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-gray-600 mb-2">Resep tidak ditemukan</p>
            <p className="text-sm text-gray-500">
              Coba ubah filter pencarian
            </p>
          </div>
        )}
      </div>

      {/* Daily Nutrition Target */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">
            Target Gizi Harian Anda
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Sayur & Buah', current: 280, target: 400, unit: 'g' },
              { label: 'Protein', current: 45, target: 60, unit: 'g' },
              { label: 'Serat', current: 18, target: 25, unit: 'g' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-gray-600">
                    {item.current}/{item.target} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2 transition-all"
                    style={{
                      width: `${(item.current / item.target) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Data berdasarkan catatan panen Anda hari ini
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuGizi;
