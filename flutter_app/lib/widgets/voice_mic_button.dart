import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../services/service_locator.dart';

class VoiceMicButton extends StatefulWidget {
  final ValueChanged<String> onResult;
  final String language;

  const VoiceMicButton({
    super.key,
    required this.onResult,
    this.language = 'en-IN',
  });

  @override
  State<VoiceMicButton> createState() => _VoiceMicButtonState();
}

class _VoiceMicButtonState extends State<VoiceMicButton> with SingleTickerProviderStateMixin {
  bool _isListening = false;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _toggleListening() async {
    if (_isListening) {
      await services.audioService.stopListening();
      setState(() => _isListening = false);
    } else {
      setState(() => _isListening = true);
      final result = await services.audioService.startListening(language: widget.language);
      if (mounted) {
        setState(() => _isListening = false);
        if (result.isNotEmpty) {
          widget.onResult(result);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: _toggleListening,
          child: AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _isListening ? AppColors.emergencyRed : AppColors.primary,
                  border: Border.all(
                    color: _isListening
                        ? AppColors.emergencyRed.withValues(alpha: 0.3 + (_pulseController.value * 0.4))
                        : AppColors.primarySubtle,
                    width: _isListening ? 6 + (_pulseController.value * 6) : 4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (_isListening ? AppColors.emergencyRed : AppColors.primary).withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    _isListening ? '🛑' : '🎤',
                    style: const TextStyle(fontSize: 28),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Text(
          _isListening ? 'Listening... Speak in Hindi or English' : 'Tap to speak your symptoms',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: _isListening ? AppColors.emergencyRed : AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
