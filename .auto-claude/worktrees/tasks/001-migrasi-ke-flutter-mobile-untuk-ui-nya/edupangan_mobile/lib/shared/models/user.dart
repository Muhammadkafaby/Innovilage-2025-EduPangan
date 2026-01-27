/// EduPangan Data Models - User
/// Based on data/dummyData.js user structure

/// User role enum
enum UserRole {
  member,
  coordinator,
  admin,
}

extension UserRoleExtension on UserRole {
  String get displayName {
    switch (this) {
      case UserRole.member:
        return 'Anggota';
      case UserRole.coordinator:
        return 'Koordinator';
      case UserRole.admin:
        return 'Admin';
    }
  }

  static UserRole fromString(String value) {
    switch (value.toLowerCase()) {
      case 'member':
      case 'anggota':
        return UserRole.member;
      case 'coordinator':
      case 'koordinator':
        return UserRole.coordinator;
      case 'admin':
        return UserRole.admin;
      default:
        return UserRole.member;
    }
  }
}

/// User model representing an app user
class User {
  final int id;
  final String name;
  final String phone;
  final String rw;
  final String role;
  final String joinDate;
  final String gardenSize;
  final double totalHarvest;
  final int activePlants;
  final String? avatar;
  final String? address;
  final int? seedBankContribution;

  const User({
    required this.id,
    required this.name,
    required this.phone,
    required this.rw,
    required this.role,
    required this.joinDate,
    required this.gardenSize,
    required this.totalHarvest,
    required this.activePlants,
    this.avatar,
    this.address,
    this.seedBankContribution,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      phone: json['phone'] as String? ?? '',
      rw: json['rw'] as String? ?? '',
      role: json['role'] as String? ?? 'member',
      joinDate: json['joinDate'] as String? ?? '',
      gardenSize: json['gardenSize'] as String? ?? '',
      totalHarvest: (json['totalHarvest'] as num?)?.toDouble() ?? 0.0,
      activePlants: json['activePlants'] as int? ?? 0,
      avatar: json['avatar'] as String?,
      address: json['address'] as String?,
      seedBankContribution: json['seedBankContribution'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'rw': rw,
      'role': role,
      'joinDate': joinDate,
      'gardenSize': gardenSize,
      'totalHarvest': totalHarvest,
      'activePlants': activePlants,
      'avatar': avatar,
      'address': address,
      'seedBankContribution': seedBankContribution,
    };
  }

  User copyWith({
    int? id,
    String? name,
    String? phone,
    String? rw,
    String? role,
    String? joinDate,
    String? gardenSize,
    double? totalHarvest,
    int? activePlants,
    String? avatar,
    String? address,
    int? seedBankContribution,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      rw: rw ?? this.rw,
      role: role ?? this.role,
      joinDate: joinDate ?? this.joinDate,
      gardenSize: gardenSize ?? this.gardenSize,
      totalHarvest: totalHarvest ?? this.totalHarvest,
      activePlants: activePlants ?? this.activePlants,
      avatar: avatar ?? this.avatar,
      address: address ?? this.address,
      seedBankContribution: seedBankContribution ?? this.seedBankContribution,
    );
  }

  /// Get role as enum
  UserRole get roleType => UserRoleExtension.fromString(role);

  /// Check if user is admin
  bool get isAdmin => roleType == UserRole.admin;

  /// Check if user is coordinator
  bool get isCoordinator => roleType == UserRole.coordinator;

  /// Get first name
  String get firstName {
    final parts = name.split(' ');
    return parts.isNotEmpty ? parts.first : name;
  }

  /// Get initials for avatar
  String get initials {
    final parts = name.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  /// Get formatted join date
  String get formattedJoinDate {
    // joinDate format could be "2024-01-15" or "15 Januari 2024"
    // Return as-is for now, can be enhanced with intl package
    return joinDate;
  }

  /// Get formatted total harvest
  String get formattedTotalHarvest {
    if (totalHarvest >= 1000) {
      return '${(totalHarvest / 1000).toStringAsFixed(1)} ton';
    }
    return '${totalHarvest.toStringAsFixed(1)} kg';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User(id: $id, name: $name, role: $role, rw: $rw)';
  }
}

/// User garden statistics
class UserGarden {
  final int activePlants;
  final int readyToHarvest;
  final double totalHarvest;
  final int seedBankContribution;

  const UserGarden({
    required this.activePlants,
    required this.readyToHarvest,
    required this.totalHarvest,
    required this.seedBankContribution,
  });

  factory UserGarden.fromJson(Map<String, dynamic> json) {
    return UserGarden(
      activePlants: json['activePlants'] as int? ?? 0,
      readyToHarvest: json['readyToHarvest'] as int? ?? 0,
      totalHarvest: (json['totalHarvest'] as num?)?.toDouble() ?? 0.0,
      seedBankContribution: json['seedBankContribution'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'activePlants': activePlants,
      'readyToHarvest': readyToHarvest,
      'totalHarvest': totalHarvest,
      'seedBankContribution': seedBankContribution,
    };
  }

  UserGarden copyWith({
    int? activePlants,
    int? readyToHarvest,
    double? totalHarvest,
    int? seedBankContribution,
  }) {
    return UserGarden(
      activePlants: activePlants ?? this.activePlants,
      readyToHarvest: readyToHarvest ?? this.readyToHarvest,
      totalHarvest: totalHarvest ?? this.totalHarvest,
      seedBankContribution: seedBankContribution ?? this.seedBankContribution,
    );
  }

  /// Get formatted total harvest
  String get formattedTotalHarvest {
    if (totalHarvest >= 1000) {
      return '${(totalHarvest / 1000).toStringAsFixed(1)} ton';
    }
    return '${totalHarvest.toStringAsFixed(1)} kg';
  }

  /// Get formatted seed bank contribution
  String get formattedSeedBankContribution {
    if (seedBankContribution >= 1000) {
      return '${(seedBankContribution / 1000).toStringAsFixed(1)}k';
    }
    return seedBankContribution.toString();
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserGarden &&
        other.activePlants == activePlants &&
        other.readyToHarvest == readyToHarvest &&
        other.totalHarvest == totalHarvest &&
        other.seedBankContribution == seedBankContribution;
  }

  @override
  int get hashCode {
    return Object.hash(
      activePlants,
      readyToHarvest,
      totalHarvest,
      seedBankContribution,
    );
  }

  @override
  String toString() {
    return 'UserGarden(activePlants: $activePlants, readyToHarvest: $readyToHarvest, totalHarvest: $totalHarvest)';
  }
}
