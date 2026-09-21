import '../interfaces/i_api_service.dart';
import '../../models/patient.dart';
import '../../models/health_story.dart';
import '../../models/doctor_summary.dart';

class MockApiService implements IApiService {
  final String baseUrl;

  MockApiService({this.baseUrl = 'http://localhost:8000'});

  @override
  Future<bool> checkHealth() async {
    // Graceful health probe
    await Future.delayed(const Duration(milliseconds: 400));
    return true;
  }

  @override
  Future<bool> syncIntake({
    required Patient patient,
    required HealthStory healthStory,
    required DoctorSummary summary,
  }) async {
    // Simulates syncing intake with backend
    await Future.delayed(const Duration(milliseconds: 600));
    return true;
  }
}
