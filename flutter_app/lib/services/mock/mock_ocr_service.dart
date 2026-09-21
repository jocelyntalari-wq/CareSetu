import '../interfaces/i_ocr_service.dart';
import '../../models/medical_document.dart';

class MockOcrService implements IOcrService {
  @override
  Future<MedicalDocument> processDocument({
    required String filePath,
    required String fileName,
    String? categoryHint,
  }) async {
    // Simulate OCR processing latency
    await Future.delayed(const Duration(milliseconds: 1000));

    final lower = fileName.toLowerCase();
    final isRx = lower.contains('rx') ||
        lower.contains('presc') ||
        (categoryHint == 'Prescription');
    final isScan = lower.contains('xray') ||
        lower.contains('scan') ||
        (categoryHint == 'Scan / Imaging');

    String category = 'Lab Report';
    String categoryCode = 'lab';
    String icon = '🩸';
    String findings = 'Extracted clinical findings: Glucose Fasting 124 mg/dL • Serum Creatinine 0.9 mg/dL';

    if (isRx) {
      category = 'Prescription';
      categoryCode = 'rx';
      icon = '💊';
      findings = 'Prescribed regimen recorded: Metformin 500mg BD • Advised hydration and salt reduction';
    } else if (isScan) {
      category = 'Scan / Imaging';
      categoryCode = 'scan';
      icon = '🩻';
      findings = 'Radiology Impression: No acute bone injury, mild degenerative osteophyte changes';
    }

    return MedicalDocument(
      id: 'doc-${DateTime.now().millisecondsSinceEpoch}',
      title: fileName.replaceAll(RegExp(r'\.[^/.]+$'), ''),
      date: 'Today (Scanned)',
      category: category,
      categoryCode: categoryCode,
      extractedFindings: findings,
      icon: icon,
      fileName: fileName,
      localFilePath: filePath,
    );
  }
}
