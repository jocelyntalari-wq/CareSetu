abstract class IAudioService {
  /// Converts speech/voice dictation to text
  Future<String> startListening({String language = 'en-IN'});

  /// Stops voice listening
  Future<void> stopListening();

  /// Converts text to speech for elderly/low-literacy read-aloud
  Future<void> speakText(String text, {String language = 'en-IN'});

  /// Stops ongoing speech
  Future<void> stopSpeaking();

  /// Indicates if TTS is currently active
  bool get isSpeaking;
}
