import '../../models/patient.dart';
import '../../models/health_story.dart';
import '../../models/ayurveda_profile.dart';
import '../../models/medical_document.dart';
import '../../models/doctor_summary.dart';

abstract class IGeminiService {
  /// Generates an AI-assisted, structured draft summary for the physician.
  /// Strictly non-diagnostic: formats patient timeline, medications, and attached records.
  Future<DoctorSummary> generateDraftSummary({
    required Patient patient,
    required HealthStory healthStory,
    AyurvedaProfile? ayurvedaProfile,
    List<MedicalDocument>? documents,
    List<String>? questionsForDoctor,
  });
}
