import 'package:flutter/material.dart';

/// CareSetu Design System Color Palette
/// Strict visual metaphor: Bridge from "My Health Story" -> "My Doctor"
class AppColors {
  // Primary: Deep Teal
  static const Color primary = Color(0xFF0F5E5C);
  static const Color primaryDark = Color(0xFF093E3D);
  static const Color primaryLight = Color(0xFF18817E);
  static const Color primarySubtle = Color(0xFFE6F3F2);

  // General Medicine Track: Blue
  static const Color genMedBlue = Color(0xFF2563EB);
  static const Color genMedDark = Color(0xFF1D4ED8);
  static const Color genMedLight = Color(0xFFEFF6FF);
  static const Color genMedBorder = Color(0xFFBFDBFE);

  // Ayurveda Track: Soft Green
  static const Color ayurGreen = Color(0xFF2E7D32);
  static const Color ayurDark = Color(0xFF1B5E20);
  static const Color ayurLight = Color(0xFFE8F5E9);
  static const Color ayurBorder = Color(0xFFC8E6C9);

  // Cream Background & Warm Surfaces
  static const Color bgCream = Color(0xFFFAF7F2);
  static const Color bgCard = Colors.white;
  static const Color bgCardWarm = Color(0xFFFFFDF9);
  static const Color borderCard = Color(0xFFE8E2D8);

  // Typography Neutrals
  static const Color textPrimary = Color(0xFF1C2726);
  static const Color textSecondary = Color(0xFF4A5B59);
  static const Color textMuted = Color(0xFF788A88);

  // Alerts & Safety
  static const Color warningOrange = Color(0xFFEA580C); // Warnings & Non-diagnostic notices
  static const Color warningBg = Color(0xFFFFF7ED);
  static const Color emergencyRed = Color(0xFFDC2626);   // STRICTLY for true emergencies only
  static const Color emergencyBg = Color(0xFFFEF2F2);
  static const Color successGreen = Color(0xFF16A34A);
  static const Color successBg = Color(0xFFF0FDF4);
}
