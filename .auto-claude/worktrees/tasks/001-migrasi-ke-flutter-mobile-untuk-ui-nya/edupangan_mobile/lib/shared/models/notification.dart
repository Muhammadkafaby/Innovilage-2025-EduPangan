/// EduPangan Data Models - Notification
/// Based on data/dummyData.js notification structure

/// Notification type enum
enum NotificationType {
  info,
  success,
  warning,
  reminder,
  harvest,
  seedBank,
  community,
}

extension NotificationTypeExtension on NotificationType {
  String get displayName {
    switch (this) {
      case NotificationType.info:
        return 'Informasi';
      case NotificationType.success:
        return 'Berhasil';
      case NotificationType.warning:
        return 'Peringatan';
      case NotificationType.reminder:
        return 'Pengingat';
      case NotificationType.harvest:
        return 'Panen';
      case NotificationType.seedBank:
        return 'Bank Bibit';
      case NotificationType.community:
        return 'Komunitas';
    }
  }

  String get defaultIcon {
    switch (this) {
      case NotificationType.info:
        return 'info';
      case NotificationType.success:
        return 'check_circle';
      case NotificationType.warning:
        return 'warning';
      case NotificationType.reminder:
        return 'alarm';
      case NotificationType.harvest:
        return 'agriculture';
      case NotificationType.seedBank:
        return 'eco';
      case NotificationType.community:
        return 'groups';
    }
  }

  static NotificationType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'info':
      case 'informasi':
        return NotificationType.info;
      case 'success':
      case 'berhasil':
        return NotificationType.success;
      case 'warning':
      case 'peringatan':
        return NotificationType.warning;
      case 'reminder':
      case 'pengingat':
        return NotificationType.reminder;
      case 'harvest':
      case 'panen':
        return NotificationType.harvest;
      case 'seedbank':
      case 'seed_bank':
      case 'bank bibit':
        return NotificationType.seedBank;
      case 'community':
      case 'komunitas':
        return NotificationType.community;
      default:
        return NotificationType.info;
    }
  }
}

/// App notification model
/// Named AppNotification to avoid conflict with Flutter's Notification class
class AppNotification {
  final int id;
  final String type;
  final String title;
  final String message;
  final String date;
  final bool read;
  final String icon;
  final String? actionUrl;
  final Map<String, dynamic>? data;

  const AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.date,
    required this.read,
    required this.icon,
    this.actionUrl,
    this.data,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as int,
      type: json['type'] as String? ?? 'info',
      title: json['title'] as String,
      message: json['message'] as String,
      date: json['date'] as String? ?? '',
      read: json['read'] as bool? ?? false,
      icon: json['icon'] as String? ?? 'info',
      actionUrl: json['actionUrl'] as String?,
      data: json['data'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'message': message,
      'date': date,
      'read': read,
      'icon': icon,
      'actionUrl': actionUrl,
      'data': data,
    };
  }

  AppNotification copyWith({
    int? id,
    String? type,
    String? title,
    String? message,
    String? date,
    bool? read,
    String? icon,
    String? actionUrl,
    Map<String, dynamic>? data,
  }) {
    return AppNotification(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      message: message ?? this.message,
      date: date ?? this.date,
      read: read ?? this.read,
      icon: icon ?? this.icon,
      actionUrl: actionUrl ?? this.actionUrl,
      data: data ?? this.data,
    );
  }

  /// Get type as enum
  NotificationType get notificationType =>
      NotificationTypeExtension.fromString(type);

  /// Check if notification is unread
  bool get isUnread => !read;

  /// Mark as read
  AppNotification markAsRead() {
    return copyWith(read: true);
  }

  /// Get relative time from date
  /// Example: "2 jam yang lalu", "Kemarin", etc.
  String get relativeTime {
    // Parse date - assumes ISO format or similar
    // For now, return the date as-is
    // Can be enhanced with timeago package
    return date;
  }

  /// Get short message (truncated)
  String get shortMessage {
    const maxLength = 100;
    if (message.length <= maxLength) return message;
    return '${message.substring(0, maxLength)}...';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppNotification && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'AppNotification(id: $id, type: $type, title: $title, read: $read)';
  }
}

/// Notification list helper
class NotificationList {
  final List<AppNotification> notifications;

  const NotificationList(this.notifications);

  /// Get unread notifications
  List<AppNotification> get unread =>
      notifications.where((n) => n.isUnread).toList();

  /// Get unread count
  int get unreadCount => unread.length;

  /// Get notifications by type
  List<AppNotification> byType(NotificationType type) =>
      notifications.where((n) => n.notificationType == type).toList();

  /// Mark all as read
  NotificationList markAllAsRead() {
    return NotificationList(
      notifications.map((n) => n.markAsRead()).toList(),
    );
  }

  /// Get recent notifications (last n)
  List<AppNotification> recent([int count = 5]) {
    return notifications.take(count).toList();
  }
}
