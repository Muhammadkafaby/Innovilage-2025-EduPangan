/// EduPangan Data Models - Recipe
/// Based on data/dummyData.js recipe structure

/// Ingredient for a recipe
class Ingredient {
  final String name;
  final String amount;
  final String? unit;
  final bool isOptional;

  const Ingredient({
    required this.name,
    required this.amount,
    this.unit,
    this.isOptional = false,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) {
    return Ingredient(
      name: json['name'] as String,
      amount: json['amount'] as String? ?? '',
      unit: json['unit'] as String?,
      isOptional: json['isOptional'] as bool? ?? false,
    );
  }

  /// Parse from simple string format like "2 siung bawang putih"
  factory Ingredient.fromString(String text) {
    final parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return Ingredient(
        amount: parts[0],
        unit: parts.length > 2 ? parts[1] : null,
        name: parts.length > 2 ? parts.sublist(2).join(' ') : parts[1],
      );
    }
    return Ingredient(name: text, amount: '');
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'amount': amount,
      'unit': unit,
      'isOptional': isOptional,
    };
  }

  Ingredient copyWith({
    String? name,
    String? amount,
    String? unit,
    bool? isOptional,
  }) {
    return Ingredient(
      name: name ?? this.name,
      amount: amount ?? this.amount,
      unit: unit ?? this.unit,
      isOptional: isOptional ?? this.isOptional,
    );
  }

  /// Get full display text
  String get displayText {
    final buffer = StringBuffer();
    if (amount.isNotEmpty) {
      buffer.write(amount);
      if (unit != null && unit!.isNotEmpty) {
        buffer.write(' $unit');
      }
      buffer.write(' ');
    }
    buffer.write(name);
    if (isOptional) {
      buffer.write(' (opsional)');
    }
    return buffer.toString();
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Ingredient &&
        other.name == name &&
        other.amount == amount &&
        other.unit == unit &&
        other.isOptional == isOptional;
  }

  @override
  int get hashCode => Object.hash(name, amount, unit, isOptional);

  @override
  String toString() => displayText;
}

/// Nutrition information per serving
class NutritionPerServing {
  final int calories;
  final String protein;
  final String carbs;
  final String fat;
  final String fiber;
  final String sodium;

  const NutritionPerServing({
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    this.fiber = '0g',
    this.sodium = '0mg',
  });

  factory NutritionPerServing.fromJson(Map<String, dynamic> json) {
    return NutritionPerServing(
      calories: json['calories'] as int? ?? 0,
      protein: json['protein'] as String? ?? '0g',
      carbs: json['carbs'] as String? ?? '0g',
      fat: json['fat'] as String? ?? '0g',
      fiber: json['fiber'] as String? ?? '0g',
      sodium: json['sodium'] as String? ?? '0mg',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fat': fat,
      'fiber': fiber,
      'sodium': sodium,
    };
  }

  NutritionPerServing copyWith({
    int? calories,
    String? protein,
    String? carbs,
    String? fat,
    String? fiber,
    String? sodium,
  }) {
    return NutritionPerServing(
      calories: calories ?? this.calories,
      protein: protein ?? this.protein,
      carbs: carbs ?? this.carbs,
      fat: fat ?? this.fat,
      fiber: fiber ?? this.fiber,
      sodium: sodium ?? this.sodium,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NutritionPerServing &&
        other.calories == calories &&
        other.protein == protein &&
        other.carbs == carbs &&
        other.fat == fat &&
        other.fiber == fiber &&
        other.sodium == sodium;
  }

  @override
  int get hashCode {
    return Object.hash(calories, protein, carbs, fat, fiber, sodium);
  }

  @override
  String toString() {
    return 'NutritionPerServing(calories: $calories, protein: $protein, carbs: $carbs, fat: $fat)';
  }
}

/// Recipe category enum
enum RecipeCategory {
  mainDish,
  sideDish,
  soup,
  snack,
  drink,
  dessert,
}

extension RecipeCategoryExtension on RecipeCategory {
  String get displayName {
    switch (this) {
      case RecipeCategory.mainDish:
        return 'Makanan Utama';
      case RecipeCategory.sideDish:
        return 'Lauk Pauk';
      case RecipeCategory.soup:
        return 'Sup & Sayur';
      case RecipeCategory.snack:
        return 'Camilan';
      case RecipeCategory.drink:
        return 'Minuman';
      case RecipeCategory.dessert:
        return 'Dessert';
    }
  }

  static RecipeCategory fromString(String value) {
    switch (value.toLowerCase()) {
      case 'main':
      case 'maindish':
      case 'makanan utama':
        return RecipeCategory.mainDish;
      case 'side':
      case 'sidedish':
      case 'lauk pauk':
        return RecipeCategory.sideDish;
      case 'soup':
      case 'sup':
      case 'sup & sayur':
        return RecipeCategory.soup;
      case 'snack':
      case 'camilan':
        return RecipeCategory.snack;
      case 'drink':
      case 'minuman':
        return RecipeCategory.drink;
      case 'dessert':
        return RecipeCategory.dessert;
      default:
        return RecipeCategory.mainDish;
    }
  }
}

/// Recipe difficulty enum
enum RecipeDifficulty {
  easy,
  medium,
  hard,
}

extension RecipeDifficultyExtension on RecipeDifficulty {
  String get displayName {
    switch (this) {
      case RecipeDifficulty.easy:
        return 'Mudah';
      case RecipeDifficulty.medium:
        return 'Sedang';
      case RecipeDifficulty.hard:
        return 'Sulit';
    }
  }

  static RecipeDifficulty fromString(String value) {
    switch (value.toLowerCase()) {
      case 'easy':
      case 'mudah':
        return RecipeDifficulty.easy;
      case 'medium':
      case 'sedang':
        return RecipeDifficulty.medium;
      case 'hard':
      case 'sulit':
        return RecipeDifficulty.hard;
      default:
        return RecipeDifficulty.easy;
    }
  }
}

/// Recipe model representing a food recipe in Menu Gizi
class Recipe {
  final int id;
  final String name;
  final String category;
  final String difficulty;
  final String prepTime;
  final String cookTime;
  final int servings;
  final List<Ingredient> ingredients;
  final List<String> instructions;
  final NutritionPerServing nutritionPerServing;
  final String image;
  final String? description;
  final List<String>? tags;

  const Recipe({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.ingredients,
    required this.instructions,
    required this.nutritionPerServing,
    required this.image,
    this.description,
    this.tags,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    // Parse ingredients - can be list of strings or list of objects
    final ingredientsList = json['ingredients'] as List<dynamic>? ?? [];
    final parsedIngredients = ingredientsList.map((item) {
      if (item is String) {
        return Ingredient.fromString(item);
      } else if (item is Map<String, dynamic>) {
        return Ingredient.fromJson(item);
      }
      return Ingredient(name: item.toString(), amount: '');
    }).toList();

    // Parse instructions - list of strings
    final instructionsList = json['instructions'] as List<dynamic>? ?? [];
    final parsedInstructions =
        instructionsList.map((item) => item.toString()).toList();

    // Parse tags if present
    final tagsList = json['tags'] as List<dynamic>?;
    final parsedTags = tagsList?.map((item) => item.toString()).toList();

    return Recipe(
      id: json['id'] as int,
      name: json['name'] as String,
      category: json['category'] as String? ?? 'Makanan Utama',
      difficulty: json['difficulty'] as String? ?? 'Mudah',
      prepTime: json['prepTime'] as String? ?? '0 menit',
      cookTime: json['cookTime'] as String? ?? '0 menit',
      servings: json['servings'] as int? ?? 1,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      nutritionPerServing: json['nutritionPerServing'] != null
          ? NutritionPerServing.fromJson(
              json['nutritionPerServing'] as Map<String, dynamic>)
          : const NutritionPerServing(
              calories: 0,
              protein: '0g',
              carbs: '0g',
              fat: '0g',
            ),
      image: json['image'] as String? ?? '',
      description: json['description'] as String?,
      tags: parsedTags,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'difficulty': difficulty,
      'prepTime': prepTime,
      'cookTime': cookTime,
      'servings': servings,
      'ingredients': ingredients.map((i) => i.toJson()).toList(),
      'instructions': instructions,
      'nutritionPerServing': nutritionPerServing.toJson(),
      'image': image,
      'description': description,
      'tags': tags,
    };
  }

  Recipe copyWith({
    int? id,
    String? name,
    String? category,
    String? difficulty,
    String? prepTime,
    String? cookTime,
    int? servings,
    List<Ingredient>? ingredients,
    List<String>? instructions,
    NutritionPerServing? nutritionPerServing,
    String? image,
    String? description,
    List<String>? tags,
  }) {
    return Recipe(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      difficulty: difficulty ?? this.difficulty,
      prepTime: prepTime ?? this.prepTime,
      cookTime: cookTime ?? this.cookTime,
      servings: servings ?? this.servings,
      ingredients: ingredients ?? this.ingredients,
      instructions: instructions ?? this.instructions,
      nutritionPerServing: nutritionPerServing ?? this.nutritionPerServing,
      image: image ?? this.image,
      description: description ?? this.description,
      tags: tags ?? this.tags,
    );
  }

  /// Get total time (prep + cook)
  String get totalTime {
    // Simple parsing - assumes format like "15 menit"
    final prepMinutes = _parseMinutes(prepTime);
    final cookMinutes = _parseMinutes(cookTime);
    final total = prepMinutes + cookMinutes;
    return '$total menit';
  }

  int _parseMinutes(String time) {
    final match = RegExp(r'(\d+)').firstMatch(time);
    return match != null ? int.tryParse(match.group(1)!) ?? 0 : 0;
  }

  /// Get difficulty as enum
  RecipeDifficulty get difficultyLevel =>
      RecipeDifficultyExtension.fromString(difficulty);

  /// Get category as enum
  RecipeCategory get categoryType => RecipeCategoryExtension.fromString(category);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Recipe && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Recipe(id: $id, name: $name, category: $category, servings: $servings)';
  }
}
