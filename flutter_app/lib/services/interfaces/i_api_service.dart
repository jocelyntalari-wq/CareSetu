import '../../models/patient.dart';
import '../../models/health_story.dart';
import '../../models/doctor_summary.dart';

abstract class IApiService {
  /// Check backend server status
  Future<bool> checkHealth();

  /// Synchronize patient health story intake with backend
  Future<bool> syncIntake({
    required Patient patient,
    required HealthStory healthStory,
    required DoctorSummary summary,
  });
}
