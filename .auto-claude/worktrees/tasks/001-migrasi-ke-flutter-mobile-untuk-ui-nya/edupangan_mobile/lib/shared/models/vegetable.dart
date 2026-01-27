/// EduPangan Data Models - Vegetable
/// Based on data/dummyData.js vegetable structure

/// Nutrition facts for a vegetable
class NutritionFacts {
  final int calories;
  final String protein;
  final String carbs;
  final String fiber;
  final String vitaminA;
  final String vitaminC;
  final String iron;
  final String calcium;

  const NutritionFacts({
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fiber,
    this.vitaminA = '0%',
    this.vitaminC = '0%',
    this.iron = '0%',
    this.calcium = '0%',
  });

  factory NutritionFacts.fromJson(Map<String, dynamic> json) {
    return NutritionFacts(
      calories: json['calories'] as int? ?? 0,
      protein: json['protein'] as String? ?? '0g',
      carbs: json['carbs'] as String? ?? '0g',
      fiber: json['fiber'] as String? ?? '0g',
      vitaminA: json['vitaminA'] as String? ?? '0%',
      vitaminC: json['vitaminC'] as String? ?? '0%',
      iron: json['iron'] as String? ?? '0%',
      calcium: json['calcium'] as String? ?? '0%',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fiber': fiber,
      'vitaminA': vitaminA,
      'vitaminC': vitaminC,
      'iron': iron,
      'calcium': calcium,
    };
  }

  NutritionFacts copyWith({
    int? calories,
    String? protein,
    String? carbs,
    String? fiber,
    String? vitaminA,
    String? vitaminC,
    String? iron,
    String? calcium,
  }) {
    return NutritionFacts(
      calories: calories ?? this.calories,
      protein: protein ?? this.protein,
      carbs: carbs ?? this.carbs,
      fiber: fiber ?? this.fiber,
      vitaminA: vitaminA ?? this.vitaminA,
      vitaminC: vitaminC ?? this.vitaminC,
      iron: iron ?? this.iron,
      calcium: calcium ?? this.calcium,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NutritionFacts &&
        other.calories == calories &&
        other.protein == protein &&
        other.carbs == carbs &&
        other.fiber == fiber &&
        other.vitaminA == vitaminA &&
        other.vitaminC == vitaminC &&
        other.iron == iron &&
        other.calcium == calcium;
  }

  @override
  int get hashCode {
    return Object.hash(
      calories,
      protein,
      carbs,
      fiber,
      vitaminA,
      vitaminC,
      iron,
      calcium,
    );
  }

  @override
  String toString() {
    return 'NutritionFacts(calories: $calories, protein: $protein, carbs: $carbs, fiber: $fiber)';
  }
}

/// Vegetable category enum
enum VegetableCategory {
  leafy,
  fruit,
  root,
  legume,
  herb,
}

extension VegetableCategoryExtension on VegetableCategory {
  String get displayName {
    switch (this) {
      case VegetableCategory.leafy:
        return 'Sayuran Daun';
      case VegetableCategory.fruit:
        return 'Sayuran Buah';
      case VegetableCategory.root:
        return 'Sayuran Umbi';
      case VegetableCategory.legume:
        return 'Kacang-kacangan';
      case VegetableCategory.herb:
        return 'Rempah';
    }
  }

  static VegetableCategory fromString(String value) {
    switch (value.toLowerCase()) {
      case 'leafy':
      case 'sayuran daun':
        return VegetableCategory.leafy;
      case 'fruit':
      case 'sayuran buah':
        return VegetableCategory.fruit;
      case 'root':
      case 'sayuran umbi':
        return VegetableCategory.root;
      case 'legume':
      case 'kacang-kacangan':
        return VegetableCategory.legume;
      case 'herb':
      case 'rempah':
        return VegetableCategory.herb;
      default:
        return VegetableCategory.leafy;
    }
  }
}

/// Difficulty level enum
enum DifficultyLevel {
  easy,
  medium,
  hard,
}

extension DifficultyLevelExtension on DifficultyLevel {
  String get displayName {
    switch (this) {
      case DifficultyLevel.easy:
        return 'Mudah';
      case DifficultyLevel.medium:
        return 'Sedang';
      case DifficultyLevel.hard:
        return 'Sulit';
    }
  }

  static DifficultyLevel fromString(String value) {
    switch (value.toLowerCase()) {
      case 'easy':
      case 'mudah':
        return DifficultyLevel.easy;
      case 'medium':
      case 'sedang':
        return DifficultyLevel.medium;
      case 'hard':
      case 'sulit':
        return DifficultyLevel.hard;
      default:
        return DifficultyLevel.easy;
    }
  }
}

/// Water needs level enum
enum WaterNeeds {
  low,
  medium,
  high,
}

extension WaterNeedsExtension on WaterNeeds {
  String get displayName {
    switch (this) {
      case WaterNeeds.low:
        return 'Sedikit';
      case WaterNeeds.medium:
        return 'Sedang';
      case WaterNeeds.high:
        return 'Banyak';
    }
  }

  static WaterNeeds fromString(String value) {
    switch (value.toLowerCase()) {
      case 'low':
      case 'sedikit':
        return WaterNeeds.low;
      case 'medium':
      case 'sedang':
        return WaterNeeds.medium;
      case 'high':
      case 'banyak':
        return WaterNeeds.high;
      default:
        return WaterNeeds.medium;
    }
  }
}

/// Vegetable model representing a plant/seed in the bank bibit
class Vegetable {
  final int id;
  final String name;
  final String scientificName;
  final String category;
  final int stockAvailable;
  final String unit;
  final String growthPeriod;
  final String waterNeeds;
  final String difficulty;
  final int price;
  final NutritionFacts nutritionFacts;
  final String image;
  final String tips;

  const Vegetable({
    required this.id,
    required this.name,
    required this.scientificName,
    required this.category,
    required this.stockAvailable,
    required this.unit,
    required this.growthPeriod,
    required this.waterNeeds,
    required this.difficulty,
    required this.price,
    required this.nutritionFacts,
    required this.image,
    required this.tips,
  });

  factory Vegetable.fromJson(Map<String, dynamic> json) {
    return Vegetable(
      id: json['id'] as int,
      name: json['name'] as String,
      scientificName: json['scientificName'] as String? ?? '',
      category: json['category'] as String,
      stockAvailable: json['stockAvailable'] as int? ?? 0,
      unit: json['unit'] as String? ?? 'biji',
      growthPeriod: json['growthPeriod'] as String? ?? '',
      waterNeeds: json['waterNeeds'] as String? ?? 'Sedang',
      difficulty: json['difficulty'] as String? ?? 'Mudah',
      price: json['price'] as int? ?? 0,
      nutritionFacts: json['nutritionFacts'] != null
          ? NutritionFacts.fromJson(json['nutritionFacts'] as Map<String, dynamic>)
          : const NutritionFacts(
              calories: 0,
              protein: '0g',
              carbs: '0g',
              fiber: '0g',
            ),
      image: json['image'] as String? ?? '',
      tips: json['tips'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'scientificName': scientificName,
      'category': category,
      'stockAvailable': stockAvailable,
      'unit': unit,
      'growthPeriod': growthPeriod,
      'waterNeeds': waterNeeds,
      'difficulty': difficulty,
      'price': price,
      'nutritionFacts': nutritionFacts.toJson(),
      'image': image,
      'tips': tips,
    };
  }

  Vegetable copyWith({
    int? id,
    String? name,
    String? scientificName,
    String? category,
    int? stockAvailable,
    String? unit,
    String? growthPeriod,
    String? waterNeeds,
    String? difficulty,
    int? price,
    NutritionFacts? nutritionFacts,
    String? image,
    String? tips,
  }) {
    return Vegetable(
      id: id ?? this.id,
      name: name ?? this.name,
      scientificName: scientificName ?? this.scientificName,
      category: category ?? this.category,
      stockAvailable: stockAvailable ?? this.stockAvailable,
      unit: unit ?? this.unit,
      growthPeriod: growthPeriod ?? this.growthPeriod,
      waterNeeds: waterNeeds ?? this.waterNeeds,
      difficulty: difficulty ?? this.difficulty,
      price: price ?? this.price,
      nutritionFacts: nutritionFacts ?? this.nutritionFacts,
      image: image ?? this.image,
      tips: tips ?? this.tips,
    );
  }

  /// Check if vegetable is in stock
  bool get isInStock => stockAvailable > 0;

  /// Get difficulty level as enum
  DifficultyLevel get difficultyLevel =>
      DifficultyLevelExtension.fromString(difficulty);

  /// Get water needs as enum
  WaterNeeds get waterNeedsLevel => WaterNeedsExtension.fromString(waterNeeds);

  /// Get category as enum
  VegetableCategory get categoryType =>
      VegetableCategoryExtension.fromString(category);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Vegetable && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Vegetable(id: $id, name: $name, category: $category, stock: $stockAvailable)';
  }
}
