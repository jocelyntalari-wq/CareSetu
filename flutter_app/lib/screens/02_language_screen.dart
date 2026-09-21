import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../state/app_state.dart';
import '../widgets/audio_listen_button.dart';
import '03_consent_screen.dart';

class LanguageScreen extends StatefulWidget {
  final AppState? appState;

  const LanguageScreen({super.key, this.appState});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  String _selectedLanguage = 'en';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('CareSetu'),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: AudioListenButton(
              label: 'Listen',
              textToRead:
                  'Please choose your preferred language. You can select English or Hindi. '
                  'The entire application, including symptoms and audio read-back, will adapt to your choice.',
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select Your Language',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'अपनी पसंदीदा भाषा चुनें',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 24),

              // Card 1: English
              _buildLanguageCard(
                langCode: 'en',
                title: 'English',
                subtitle: 'View entire app in English',
                flagIcon: '🌐',
              ),

              const SizedBox(height: 14),

              // Card 2: Hindi (हिंदी)
              _buildLanguageCard(
                langCode: 'hi',
                title: 'हिंदी (Hindi)',
                subtitle: 'पूरी ऐप और बोलकर विवरण हिंदी में देखें',
                flagIcon: '🇮🇳',
              ),

              const Spacer(),

              // Continue Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    widget.appState?.setLanguage(_selectedLanguage);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ConsentScreen(appState: widget.appState),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _selectedLanguage == 'hi' ? 'आगे बढ़ें ➔' : 'Continue ➔',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLanguageCard({
    required String langCode,
    required String title,
    required String subtitle,
    required String flagIcon,
  }) {
    final isSelected = _selectedLanguage == langCode;
    return InkWell(
      onTap: () {
        setState(() => _selectedLanguage = langCode);
      },
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySubtle : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.borderCard,
            width: isSelected ? 2.0 : 1.2,
          ),
          boxShadow: [
            if (isSelected)
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.12),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : AppColors.bgCream,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(flagIcon, style: const TextStyle(fontSize: 24)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_off,
              color: isSelected ? AppColors.primary : AppColors.textMuted,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }
}
