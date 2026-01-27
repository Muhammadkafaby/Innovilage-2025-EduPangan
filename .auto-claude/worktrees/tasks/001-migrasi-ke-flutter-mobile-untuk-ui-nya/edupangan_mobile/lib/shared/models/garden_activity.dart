/// EduPangan Data Models - Garden Activity
/// Based on data/dummyData.js activity structure

/// Activity type enum
enum ActivityType {
  planting,
  watering,
  harvesting,
  fertilizing,
  weeding,
  seedRequest,
  seedDonation,
  other,
}

extension ActivityTypeExtension on ActivityType {
  String get displayName {
    switch (this) {
      case ActivityType.planting:
        return 'Menanam';
      case ActivityType.watering:
        return 'Menyiram';
      case ActivityType.harvesting:
        return 'Panen';
      case ActivityType.fertilizing:
        return 'Pemupukan';
      case ActivityType.weeding:
        return 'Penyiangan';
      case ActivityType.seedRequest:
        return 'Permintaan Bibit';
      case ActivityType.seedDonation:
        return 'Donasi Bibit';
      case ActivityType.other:
        return 'Lainnya';
    }
  }

  String get emoji {
    switch (this) {
      case ActivityType.planting:
        return '\u{1F331}'; // 🌱
      case ActivityType.watering:
        return '\u{1F4A7}'; // 💧
      case ActivityType.harvesting:
        return '\u{1F33E}'; // 🌾
      case ActivityType.fertilizing:
        return '\u{1F9EA}'; // 🧪
      case ActivityType.weeding:
        return '\u{1F33F}'; // 🌿
      case ActivityType.seedRequest:
        return '\u{1F4E6}'; // 📦
      case ActivityType.seedDonation:
        return '\u{1F381}'; // 🎁
      case ActivityType.other:
        return '\u{1F4CB}'; // 📋
    }
  }

  static ActivityType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'planting':
      case 'menanam':
        return ActivityType.planting;
      case 'watering':
      case 'menyiram':
        return ActivityType.watering;
      case 'harvesting':
      case 'harvest':
      case 'panen':
        return ActivityType.harvesting;
      case 'fertilizing':
      case 'pemupukan':
        return ActivityType.fertilizing;
      case 'weeding':
      case 'penyiangan':
        return ActivityType.weeding;
      case 'seed_request':
      case 'seedrequest':
      case 'permintaan bibit':
        return ActivityType.seedRequest;
      case 'seed_donation':
      case 'seeddonation':
      case 'donasi bibit':
        return ActivityType.seedDonation;
      default:
        return ActivityType.other;
    }
  }
}

/// Garden activity model for tracking user activities
class GardenActivity {
  final int id;
  final String type;
  final String title;
  final String description;
  final String date;
  final String time;
  final int? userId;
  final String? userName;
  final String? plantName;
  final double? quantity;
  final String? unit;
  final String? notes;
  final String? image;

  const GardenActivity({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.date,
    required this.time,
    this.userId,
    this.userName,
    this.plantName,
    this.quantity,
    this.unit,
    this.notes,
    this.image,
  });

  factory GardenActivity.fromJson(Map<String, dynamic> json) {
    return GardenActivity(
      id: json['id'] as int,
      type: json['type'] as String? ?? 'other',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      date: json['date'] as String? ?? '',
      time: json['time'] as String? ?? '',
      userId: json['userId'] as int?,
      userName: json['userName'] as String?,
      plantName: json['plantName'] as String?,
      quantity: (json['quantity'] as num?)?.toDouble(),
      unit: json['unit'] as String?,
      notes: json['notes'] as String?,
      image: json['image'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'description': description,
      'date': date,
      'time': time,
      'userId': userId,
      'userName': userName,
      'plantName': plantName,
      'quantity': quantity,
      'unit': unit,
      'notes': notes,
      'image': image,
    };
  }

  GardenActivity copyWith({
    int? id,
    String? type,
    String? title,
    String? description,
    String? date,
    String? time,
    int? userId,
    String? userName,
    String? plantName,
    double? quantity,
    String? unit,
    String? notes,
    String? image,
  }) {
    return GardenActivity(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      description: description ?? this.description,
      date: date ?? this.date,
      time: time ?? this.time,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      plantName: plantName ?? this.plantName,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      notes: notes ?? this.notes,
      image: image ?? this.image,
    );
  }

  /// Get activity type as enum
  ActivityType get activityType => ActivityTypeExtension.fromString(type);

  /// Get emoji for the activity type
  String get emoji => activityType.emoji;

  /// Get formatted date and time
  String get formattedDateTime => '$date $time'.trim();

  /// Get quantity with unit
  String? get formattedQuantity {
    if (quantity == null) return null;
    final unitText = unit ?? 'kg';
    return '${quantity!.toStringAsFixed(1)} $unitText';
  }

  /// Get short description
  String get shortDescription {
    const maxLength = 80;
    if (description.length <= maxLength) return description;
    return '${description.substring(0, maxLength)}...';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is GardenActivity && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'GardenActivity(id: $id, type: $type, title: $title, date: $date)';
  }
}

/// Harvest record for Catat Panen feature
class HarvestRecord {
  final int id;
  final int plantId;
  final String plantName;
  final double quantity;
  final String unit;
  final String date;
  final String? notes;
  final String? quality;
  final int? userId;

  const HarvestRecord({
    required this.id,
    required this.plantId,
    required this.plantName,
    required this.quantity,
    required this.unit,
    required this.date,
    this.notes,
    this.quality,
    this.userId,
  });

  factory HarvestRecord.fromJson(Map<String, dynamic> json) {
    return HarvestRecord(
      id: json['id'] as int,
      plantId: json['plantId'] as int,
      plantName: json['plantName'] as String,
      quantity: (json['quantity'] as num).toDouble(),
      unit: json['unit'] as String? ?? 'kg',
      date: json['date'] as String,
      notes: json['notes'] as String?,
      quality: json['quality'] as String?,
      userId: json['userId'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'plantId': plantId,
      'plantName': plantName,
      'quantity': quantity,
      'unit': unit,
      'date': date,
      'notes': notes,
      'quality': quality,
      'userId': userId,
    };
  }

  HarvestRecord copyWith({
    int? id,
    int? plantId,
    String? plantName,
    double? quantity,
    String? unit,
    String? date,
    String? notes,
    String? quality,
    int? userId,
  }) {
    return HarvestRecord(
      id: id ?? this.id,
      plantId: plantId ?? this.plantId,
      plantName: plantName ?? this.plantName,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      date: date ?? this.date,
      notes: notes ?? this.notes,
      quality: quality ?? this.quality,
      userId: userId ?? this.userId,
    );
  }

  /// Get formatted quantity with unit
  String get formattedQuantity => '${quantity.toStringAsFixed(1)} $unit';

  /// Convert to GardenActivity
  GardenActivity toActivity() {
    return GardenActivity(
      id: id,
      type: 'harvesting',
      title: 'Panen $plantName',
      description: 'Hasil panen: $formattedQuantity${notes != null ? '. $notes' : ''}',
      date: date,
      time: '',
      userId: userId,
      plantName: plantName,
      quantity: quantity,
      unit: unit,
      notes: notes,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is HarvestRecord && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'HarvestRecord(id: $id, plantName: $plantName, quantity: $formattedQuantity, date: $date)';
  }
}

/// Seed transaction for Bank Bibit
class SeedTransaction {
  final int id;
  final String type; // 'request' or 'donation'
  final int vegetableId;
  final String vegetableName;
  final int quantity;
  final String unit;
  final String date;
  final String status; // 'pending', 'approved', 'completed', 'rejected'
  final int? userId;
  final String? userName;
  final String? notes;

  const SeedTransaction({
    required this.id,
    required this.type,
    required this.vegetableId,
    required this.vegetableName,
    required this.quantity,
    required this.unit,
    required this.date,
    required this.status,
    this.userId,
    this.userName,
    this.notes,
  });

  factory SeedTransaction.fromJson(Map<String, dynamic> json) {
    return SeedTransaction(
      id: json['id'] as int,
      type: json['type'] as String,
      vegetableId: json['vegetableId'] as int,
      vegetableName: json['vegetableName'] as String,
      quantity: json['quantity'] as int,
      unit: json['unit'] as String? ?? 'biji',
      date: json['date'] as String,
      status: json['status'] as String? ?? 'pending',
      userId: json['userId'] as int?,
      userName: json['userName'] as String?,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'vegetableId': vegetableId,
      'vegetableName': vegetableName,
      'quantity': quantity,
      'unit': unit,
      'date': date,
      'status': status,
      'userId': userId,
      'userName': userName,
      'notes': notes,
    };
  }

  SeedTransaction copyWith({
    int? id,
    String? type,
    int? vegetableId,
    String? vegetableName,
    int? quantity,
    String? unit,
    String? date,
    String? status,
    int? userId,
    String? userName,
    String? notes,
  }) {
    return SeedTransaction(
      id: id ?? this.id,
      type: type ?? this.type,
      vegetableId: vegetableId ?? this.vegetableId,
      vegetableName: vegetableName ?? this.vegetableName,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      date: date ?? this.date,
      status: status ?? this.status,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      notes: notes ?? this.notes,
    );
  }

  /// Check if this is a request transaction
  bool get isRequest => type == 'request';

  /// Check if this is a donation transaction
  bool get isDonation => type == 'donation';

  /// Check if transaction is pending
  bool get isPending => status == 'pending';

  /// Check if transaction is completed
  bool get isCompleted => status == 'completed';

  /// Get formatted quantity with unit
  String get formattedQuantity => '$quantity $unit';

  /// Get status display text
  String get statusDisplayText {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'completed':
        return 'Selesai';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  }

  /// Get type display text
  String get typeDisplayText {
    return isRequest ? 'Permintaan' : 'Donasi';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SeedTransaction && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'SeedTransaction(id: $id, type: $type, vegetableName: $vegetableName, quantity: $formattedQuantity, status: $status)';
  }
}
