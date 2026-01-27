import 'package:flutter/material.dart';

/// EduPangan Design System Typography
/// Extracted from styles/theme.js
class AppTypography {
  AppTypography._();

  // ============================================
  // FONT FAMILY
  // ============================================
  static const String fontFamily = 'Inter';
  static const String fontFamilyFallback = 'Nunito Sans';

  static const List<String> fontFamilyFallbacks = [
    'Nunito Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ];

  // ============================================
  // FONT SIZES
  // ============================================
  static const double fontSizeXs = 12.0;
  static const double fontSizeSm = 14.0;
  static const double fontSizeBase = 16.0;
  static const double fontSizeLg = 18.0;
  static const double fontSizeXl = 20.0;
  static const double fontSize2xl = 24.0;
  static const double fontSize3xl = 30.0;
  static const double fontSize4xl = 36.0;
  static const double fontSize5xl = 48.0;

  // ============================================
  // FONT WEIGHTS
  // ============================================
  static const FontWeight fontWeightLight = FontWeight.w300;
  static const FontWeight fontWeightRegular = FontWeight.w400;
  static const FontWeight fontWeightMedium = FontWeight.w500;
  static const FontWeight fontWeightSemibold = FontWeight.w600;
  static const FontWeight fontWeightBold = FontWeight.w700;

  // ============================================
  // LINE HEIGHTS
  // ============================================
  static const double lineHeightTight = 1.2;
  static const double lineHeightNormal = 1.5;
  static const double lineHeightRelaxed = 1.75;

  // ============================================
  // TEXT STYLES - Headings
  // ============================================
  static const TextStyle heading1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSize5xl,
    fontWeight: fontWeightBold,
    height: lineHeightTight,
  );

  static const TextStyle heading2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSize4xl,
    fontWeight: fontWeightBold,
    height: lineHeightTight,
  );

  static const TextStyle heading3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSize3xl,
    fontWeight: fontWeightSemibold,
    height: lineHeightTight,
  );

  static const TextStyle heading4 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSize2xl,
    fontWeight: fontWeightSemibold,
    height: lineHeightNormal,
  );

  static const TextStyle heading5 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeXl,
    fontWeight: fontWeightSemibold,
    height: lineHeightNormal,
  );

  static const TextStyle heading6 = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeLg,
    fontWeight: fontWeightMedium,
    height: lineHeightNormal,
  );

  // ============================================
  // TEXT STYLES - Body
  // ============================================
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeLg,
    fontWeight: fontWeightRegular,
    height: lineHeightNormal,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeBase,
    fontWeight: fontWeightRegular,
    height: lineHeightNormal,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeSm,
    fontWeight: fontWeightRegular,
    height: lineHeightNormal,
  );

  // ============================================
  // TEXT STYLES - Labels
  // ============================================
  static const TextStyle labelLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeSm,
    fontWeight: fontWeightMedium,
    height: lineHeightNormal,
  );

  static const TextStyle labelMedium = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeXs,
    fontWeight: fontWeightMedium,
    height: lineHeightNormal,
  );

  static const TextStyle labelSmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeXs,
    fontWeight: fontWeightRegular,
    height: lineHeightNormal,
  );

  // ============================================
  // TEXT STYLES - Special
  // ============================================
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeXs,
    fontWeight: fontWeightRegular,
    height: lineHeightNormal,
  );

  static const TextStyle overline = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeXs,
    fontWeight: fontWeightMedium,
    height: lineHeightNormal,
    letterSpacing: 1.5,
  );

  static const TextStyle button = TextStyle(
    fontFamily: fontFamily,
    fontSize: fontSizeSm,
    fontWeight: fontWeightSemibold,
    height: lineHeightNormal,
  );
}
