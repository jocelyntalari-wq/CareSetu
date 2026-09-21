import '../../models/medical_document.dart';

abstract class IStorageService {
  /// Uploads a private medical document to secure storage (Supabase or encrypted local)
  Future<String> uploadDocument({
    required String filePath,
    required String fileName,
    required String patientId,
  });

  /// Fetches the list of attached medical documents for the patient
  Future<List<MedicalDocument>> getDocuments(String patientId);

  /// Deletes or detaches a document
  Future<bool> deleteDocument(String documentId);
}
