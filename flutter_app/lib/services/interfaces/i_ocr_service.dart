import '../../models/medical_document.dart';

abstract class IOcrService {
  /// Scans an uploaded prescription or lab report image/PDF
  /// and extracts key findings, parameters, and metadata.
  Future<MedicalDocument> processDocument({
    required String filePath,
    required String fileName,
    String? categoryHint,
  });
}
