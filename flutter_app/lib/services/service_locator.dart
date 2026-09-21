import 'interfaces/i_gemini_service.dart';
import 'interfaces/i_ocr_service.dart';
import 'interfaces/i_audio_service.dart';
import 'interfaces/i_storage_service.dart';
import 'interfaces/i_api_service.dart';
import 'mock/mock_gemini_service.dart';
import 'mock/mock_ocr_service.dart';
import 'mock/mock_audio_service.dart';
import 'mock/mock_storage_service.dart';
import 'mock/mock_api_service.dart';

class ServiceLocator {
  static final ServiceLocator _instance = ServiceLocator._internal();
  factory ServiceLocator() => _instance;
  ServiceLocator._internal();

  bool useMock = true;

  late IGeminiService geminiService = MockGeminiService();
  late IOcrService ocrService = MockOcrService();
  late IAudioService audioService = MockAudioService();
  late IStorageService storageService = MockStorageService();
  late IApiService apiService = MockApiService();

  /// Configures services to use real APIs or mock simulators
  void setup({bool mock = true}) {
    useMock = mock;
    if (mock) {
      geminiService = MockGeminiService();
      ocrService = MockOcrService();
      audioService = MockAudioService();
      storageService = MockStorageService();
      apiService = MockApiService();
    } else {
      // Plug real HTTP / SDK implementations when keys are provided
      geminiService = MockGeminiService();
      ocrService = MockOcrService();
      audioService = MockAudioService();
      storageService = MockStorageService();
      apiService = MockApiService();
    }
  }
}

final services = ServiceLocator();
