import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';

/// Card padding options matching the React Card.jsx component
enum CardPadding {
  none,
  sm,
  md,
  lg,
}

/// Card shadow options matching the React Card.jsx component
enum CardShadow {
  none,
  sm,
  md,
  lg,
}

/// EduPangan Design System Card Widget
///
/// A customizable card component with title, subtitle, icon, and various
/// padding/shadow options. Follows the design patterns from the React Card.jsx component.
///
/// Example usage:
/// ```dart
/// AppCard(
///   title: 'My Card Title',
///   subtitle: 'Optional subtitle text',
///   icon: Icons.home,
///   padding: CardPadding.md,
///   shadow: CardShadow.md,
///   child: Text('Card content goes here'),
/// )
/// ```
class AppCard extends StatelessWidget {
  /// The title text displayed in the card header
  final String? title;

  /// The subtitle text displayed below the title
  final String? subtitle;

  /// Optional icon displayed before the title
  final IconData? icon;

  /// Optional emoji displayed before the title (alternative to icon)
  final String? emoji;

  /// Icon color (defaults to primary color)
  final Color? iconColor;

  /// Icon background color (defaults to primary50)
  final Color? iconBackgroundColor;

  /// The padding size of the card content
  final CardPadding padding;

  /// The shadow depth of the card
  final CardShadow shadow;

  /// The border radius of the card
  final double? borderRadius;

  /// The background color of the card
  final Color? backgroundColor;

  /// Optional border color
  final Color? borderColor;

  /// The content of the card
  final Widget? child;

  /// Optional trailing widget in the header
  final Widget? trailing;

  /// Callback when the card is tapped
  final VoidCallback? onTap;

  /// Whether to show the header section
  final bool showHeader;

  const AppCard({
    super.key,
    this.title,
    this.subtitle,
    this.icon,
    this.emoji,
    this.iconColor,
    this.iconBackgroundColor,
    this.padding = CardPadding.md,
    this.shadow = CardShadow.md,
    this.borderRadius,
    this.backgroundColor,
    this.borderColor,
    this.child,
    this.trailing,
    this.onTap,
    this.showHeader = true,
  });

  /// Get padding value based on CardPadding enum
  EdgeInsets _getPadding() {
    switch (padding) {
      case CardPadding.none:
        return EdgeInsets.zero;
      case CardPadding.sm:
        return const EdgeInsets.all(12);
      case CardPadding.md:
        return const EdgeInsets.all(16);
      case CardPadding.lg:
        return const EdgeInsets.all(24);
    }
  }

  /// Get box shadow based on CardShadow enum
  List<BoxShadow>? _getBoxShadow() {
    switch (shadow) {
      case CardShadow.none:
        return null;
      case CardShadow.sm:
        return [
          BoxShadow(
            color: AppColors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ];
      case CardShadow.md:
        return [
          BoxShadow(
            color: AppColors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ];
      case CardShadow.lg:
        return [
          BoxShadow(
            color: AppColors.black.withOpacity(0.1),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ];
    }
  }

  /// Get border radius value
  double _getBorderRadius() {
    return borderRadius ?? 16;
  }

  /// Build the icon/emoji widget
  Widget? _buildIconWidget() {
    if (icon == null && emoji == null) return null;

    final effectiveIconColor = iconColor ?? AppColors.primary;
    final effectiveIconBgColor = iconBackgroundColor ?? AppColors.primary50;

    if (emoji != null) {
      return Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: effectiveIconBgColor,
          borderRadius: BorderRadius.circular(12),
        ),
        alignment: Alignment.center,
        child: Text(
          emoji!,
          style: const TextStyle(fontSize: 20),
        ),
      );
    }

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: effectiveIconBgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      alignment: Alignment.center,
      child: Icon(
        icon,
        size: 22,
        color: effectiveIconColor,
      ),
    );
  }

  /// Build the header section with title, subtitle, and icon
  Widget? _buildHeader() {
    if (!showHeader || (title == null && subtitle == null && icon == null && emoji == null)) {
      return null;
    }

    final iconWidget = _buildIconWidget();
    final hasIcon = iconWidget != null;

    return Padding(
      padding: child != null
          ? EdgeInsets.only(bottom: padding == CardPadding.none ? 0 : 12)
          : EdgeInsets.zero,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hasIcon) ...[
            iconWidget,
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (title != null)
                  Text(
                    title!,
                    style: AppTypography.heading6.copyWith(
                      color: AppColors.grey800,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                if (subtitle != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    subtitle!,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.grey600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final contentPadding = _getPadding();
    final boxShadow = _getBoxShadow();
    final radius = _getBorderRadius();
    final header = _buildHeader();

    Widget cardContent = Container(
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.backgroundCard,
        borderRadius: BorderRadius.circular(radius),
        border: borderColor != null
            ? Border.all(color: borderColor!, width: 1)
            : null,
        boxShadow: boxShadow,
      ),
      child: Padding(
        padding: contentPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (header != null) header,
            if (child != null) child!,
          ],
        ),
      ),
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: cardContent,
      );
    }

    return cardContent;
  }
}

/// A simple card variant without header
/// Useful for wrapping content with consistent styling
class AppSimpleCard extends StatelessWidget {
  /// The content of the card
  final Widget child;

  /// The padding size of the card content
  final CardPadding padding;

  /// The shadow depth of the card
  final CardShadow shadow;

  /// The border radius of the card
  final double? borderRadius;

  /// The background color of the card
  final Color? backgroundColor;

  /// Optional border color
  final Color? borderColor;

  /// Callback when the card is tapped
  final VoidCallback? onTap;

  const AppSimpleCard({
    super.key,
    required this.child,
    this.padding = CardPadding.md,
    this.shadow = CardShadow.md,
    this.borderRadius,
    this.backgroundColor,
    this.borderColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: padding,
      shadow: shadow,
      borderRadius: borderRadius,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      onTap: onTap,
      showHeader: false,
      child: child,
    );
  }
}

/// A stat card variant for displaying statistics
/// Used in Dashboard for quick stats display
class AppStatCard extends StatelessWidget {
  /// The title/label of the stat
  final String title;

  /// The value to display
  final String value;

  /// Optional icon
  final IconData? icon;

  /// Optional emoji (alternative to icon)
  final String? emoji;

  /// The background color of the icon container
  final Color? iconBackgroundColor;

  /// The icon color
  final Color? iconColor;

  /// Callback when the card is tapped
  final VoidCallback? onTap;

  const AppStatCard({
    super.key,
    required this.title,
    required this.value,
    this.icon,
    this.emoji,
    this.iconBackgroundColor,
    this.iconColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: CardPadding.md,
      shadow: CardShadow.sm,
      onTap: onTap,
      showHeader: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null || emoji != null)
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: iconBackgroundColor ?? AppColors.primary50,
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: emoji != null
                  ? Text(emoji!, style: const TextStyle(fontSize: 18))
                  : Icon(
                      icon,
                      size: 18,
                      color: iconColor ?? AppColors.primary,
                    ),
            ),
          const SizedBox(height: 12),
          Text(
            value,
            style: AppTypography.heading4.copyWith(
              color: AppColors.grey800,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.grey600,
            ),
          ),
        ],
      ),
    );
  }
}
