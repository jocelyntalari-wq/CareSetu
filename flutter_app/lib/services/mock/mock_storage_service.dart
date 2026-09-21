import '../interfaces/i_storage_service.dart';
import '../../models/medical_document.dart';

class MockStorageService implements IStorageService {
  final List<MedicalDocument> _documents = [
    MedicalDocument(
      id: 'doc-1',
      title: 'Previous Prescription - Dr. Anand Varma (MD)',
      date: '14 Feb 2024',
      category: 'Prescription',
      categoryCode: 'rx',
      extractedFindings: 'Metformin 500mg BD • Telmisartan 40mg OD • Low carbohydrate diet advised',
      icon: '💊',
      fileName: 'dr_varma_prescription_feb2024.pdf',
    ),
    MedicalDocument(
      id: 'doc-2',
      title: 'HbA1c & Fasting Lipid Profile - Metropolis Lab',
      date: '18 Jun 2024',
      category: 'Blood Test',
      categoryCode: 'lab',
      extractedFindings: 'HbA1c: 7.3% (Elevated) • Fasting Glucose: 138 mg/dL • Total Chol: 195 mg/dL',
      icon: '🩸',
      fileName: 'metropolis_hba1c_june2024.pdf',
    ),
    MedicalDocument(
      id: 'doc-3',
      title: 'Digital X-Ray Bilateral Knees (Standing AP/Lat)',
      date: '10 Nov 2023',
      category: 'Scan / Imaging',
      categoryCode: 'scan',
      extractedFindings: 'Mild medial joint space narrowing • No acute fracture • Degenerative changes',
      icon: '🩻',
      fileName: 'bilateral_knee_xray_nov2023.png',
    ),
  ];

  @override
  Future<String> uploadDocument({
    required String filePath,
    required String fileName,
    required String patientId,
  }) async {
    await Future.delayed(const Duration(milliseconds: 800));
    final docId = 'doc-${DateTime.now().millisecondsSinceEpoch}';
    return 'https://supabase.internal.storage/care_documents/$patientId/$docId-$fileName';
  }

  @override
  Future<List<MedicalDocument>> getDocuments(String patientId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.unmodifiable(_documents);
  }

  @override
  Future<bool> deleteDocument(String documentId) async {
    _documents.removeWhere((d) => d.id == documentId);
    return true;
  }

  void addDocument(MedicalDocument doc) {
    _documents.insert(0, doc);
  }
}
