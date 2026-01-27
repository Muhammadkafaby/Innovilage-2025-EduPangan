import 'package:flutter/material.dart';

/// EduPangan Design System Colors
/// Extracted from styles/theme.js
class AppColors {
  AppColors._();

  // ============================================
  // PRIMARY COLORS - Hijau alami (Natural Green)
  // ============================================
  static const Color primary = Color(0xFF4CAF50);
  static const Color primaryLight = Color(0xFFC8E6C9);
  static const Color primaryDark = Color(0xFF2E7D32);

  static const Color primary50 = Color(0xFFE8F5E9);
  static const Color primary100 = Color(0xFFC8E6C9);
  static const Color primary200 = Color(0xFFA5D6A7);
  static const Color primary300 = Color(0xFF81C784);
  static const Color primary400 = Color(0xFF66BB6A);
  static const Color primary500 = Color(0xFF4CAF50);
  static const Color primary600 = Color(0xFF43A047);
  static const Color primary700 = Color(0xFF388E3C);
  static const Color primary800 = Color(0xFF2E7D32);
  static const Color primary900 = Color(0xFF1B5E20);

  // ============================================
  // SECONDARY COLORS - Oranye lembut (Soft Orange)
  // ============================================
  static const Color secondary = Color(0xFFFFB74D);
  static const Color secondaryLight = Color(0xFFFFE0B2);
  static const Color secondaryDark = Color(0xFFF57C00);

  static const Color secondary50 = Color(0xFFFFF3E0);
  static const Color secondary100 = Color(0xFFFFE0B2);
  static const Color secondary200 = Color(0xFFFFCC80);
  static const Color secondary300 = Color(0xFFFFB74D);
  static const Color secondary400 = Color(0xFFFFA726);
  static const Color secondary500 = Color(0xFFFF9800);
  static const Color secondary600 = Color(0xFFFB8C00);
  static const Color secondary700 = Color(0xFFF57C00);
  static const Color secondary800 = Color(0xFFEF6C00);
  static const Color secondary900 = Color(0xFFE65100);

  // ============================================
  // ACCENT COLORS - Kuning muda (Light Yellow)
  // ============================================
  static const Color accentYellow = Color(0xFFFFF9C4);
  static const Color accentYellowDark = Color(0xFFFFF59D);

  // ============================================
  // NEUTRAL COLORS
  // ============================================
  static const Color white = Color(0xFFFFFFFF);
  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color grey100 = Color(0xFFF5F5F5);
  static const Color grey200 = Color(0xFFEEEEEE);
  static const Color grey300 = Color(0xFFE0E0E0);
  static const Color grey400 = Color(0xFFBDBDBD);
  static const Color grey500 = Color(0xFF9E9E9E);
  static const Color grey600 = Color(0xFF757575);
  static const Color grey700 = Color(0xFF616161);
  static const Color grey800 = Color(0xFF424242);
  static const Color grey900 = Color(0xFF212121);
  static const Color black = Color(0xFF000000);

  // ============================================
  // STATUS COLORS
  // ============================================
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);

  // ============================================
  // BACKGROUND COLORS
  // ============================================
  static const Color backgroundPrimary = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFF5F5F5);
  static const Color backgroundAccent = Color(0xFFFFF9C4);
  static const Color backgroundCard = Color(0xFFFFFFFF);

  // ============================================
  // MATERIAL COLOR SWATCHES
  // ============================================
  static const MaterialColor primarySwatch = MaterialColor(
    0xFF4CAF50,
    <int, Color>{
      50: primary50,
      100: primary100,
      200: primary200,
      300: primary300,
      400: primary400,
      500: primary500,
      600: primary600,
      700: primary700,
      800: primary800,
      900: primary900,
    },
  );

  static const MaterialColor secondarySwatch = MaterialColor(
    0xFFFF9800,
    <int, Color>{
      50: secondary50,
      100: secondary100,
      200: secondary200,
      300: secondary300,
      400: secondary400,
      500: secondary500,
      600: secondary600,
      700: secondary700,
      800: secondary800,
      900: secondary900,
    },
  );
}
