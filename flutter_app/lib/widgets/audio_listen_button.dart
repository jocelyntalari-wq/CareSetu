import 'package:flutter/material.dart';
import '../services/service_locator.dart';

class AudioListenButton extends StatefulWidget {
  final String textToRead;
  final String label;

  const AudioListenButton({
    super.key,
    required this.textToRead,
    this.label = 'Listen',
  });

  @override
  State<AudioListenButton> createState() => _AudioListenButtonState();
}

class _AudioListenButtonState extends State<AudioListenButton> {
  bool _isPlaying = false;

  void _togglePlay() async {
    if (_isPlaying) {
      await services.audioService.stopSpeaking();
      setState(() => _isPlaying = false);
    } else {
      setState(() => _isPlaying = true);
      await services.audioService.speakText(widget.textToRead);
      if (mounted) {
        setState(() => _isPlaying = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: _togglePlay,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: _isPlaying ? const Color(0xFFF59E0B) : const Color(0xFFFEF3C7),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF59E0B), width: 1.2),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              _isPlaying ? '⏹️' : '🔊',
              style: const TextStyle(fontSize: 12),
            ),
            const SizedBox(width: 4),
            Text(
              _isPlaying ? 'Stop' : widget.label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: _isPlaying ? Colors.white : const Color(0xFF92400E),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
