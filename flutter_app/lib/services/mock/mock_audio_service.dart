import 'dart:async';
import '../interfaces/i_audio_service.dart';

class MockAudioService implements IAudioService {
  bool _speaking = false;
  Timer? _speakingTimer;

  @override
  bool get isSpeaking => _speaking;

  @override
  Future<String> startListening({String language = 'en-IN'}) async {
    // Simulated speech recognition with realistic phrasing
    await Future.delayed(const Duration(milliseconds: 1600));
    if (language.startsWith('hi')) {
      return 'मुझे पिछले चार दिनों से शाम को बुखार और घुटनों में तेज दर्द हो रहा है। भूख भी बहुत कम लग रही है।';
    } else {
      return 'I have had intermittent evening fever and joint stiffness in both knees for the past 4 days. Reduced appetite noted.';
    }
  }

  @override
  Future<void> stopListening() async {
    // Stop recording simulation
  }

  @override
  Future<void> speakText(String text, {String language = 'en-IN'}) async {
    _speaking = true;
    _speakingTimer?.cancel();
    // Simulate speaking duration based on length
    final durationSec = (text.length / 25).clamp(2, 8).toInt();
    _speakingTimer = Timer(Duration(seconds: durationSec), () {
      _speaking = false;
    });
  }

  @override
  Future<void> stopSpeaking() async {
    _speakingTimer?.cancel();
    _speaking = false;
  }
}
