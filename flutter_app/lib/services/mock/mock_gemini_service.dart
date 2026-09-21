import '../interfaces/i_gemini_service.dart';
import '../../models/patient.dart';
import '../../models/health_story.dart';
import '../../models/ayurveda_profile.dart';
import '../../models/medical_document.dart';
import '../../models/doctor_summary.dart';

class MockGeminiService implements IGeminiService {
  @override
  Future<DoctorSummary> generateDraftSummary({
    required Patient patient,
    required HealthStory healthStory,
    AyurvedaProfile? ayurvedaProfile,
    List<MedicalDocument>? documents,
    List<String>? questionsForDoctor,
  }) async {
    // Realistic simulation delay (1.2 seconds) to reflect AI processing
    await Future.delayed(const Duration(milliseconds: 1200));

    final complaints = healthStory.chiefComplaints.isNotEmpty
        ? healthStory.chiefComplaints.join(', ')
        : 'General health history consultation';

    final hpi = 'Patient reports progressive onset of symptoms ($complaints) '
        'over approximately ${healthStory.durationValue} ${healthStory.durationUnit}. '
        'Severity is characterized by patient as ${healthStory.severity}. '
        '${healthStory.freeNotes.isNotEmpty ? "Patient noted: \"${healthStory.freeNotes}\"." : ""}';

    final meds = healthStory.recordedMedicines.isNotEmpty
        ? healthStory.recordedMedicines
            .map((m) => '${m.name} (${m.dosage}) - ${m.note}')
            .toList()
        : ['No regular daily prescription medicines reported'];

    final conditions = patient.chronicConditions.isNotEmpty
        ? patient.chronicConditions.join(', ')
        : 'None reported';

    final docFindings = (documents != null && documents.isNotEmpty)
        ? documents
            .map((d) => '${d.title} (${d.date}): ${d.extractedFindings}')
            .toList()
        : ['No previous medical documents attached'];

    String? ayurSummary;
    if (patient.selectedTrack == 'Ayurveda' && ayurvedaProfile != null) {
      ayurSummary = 'Agni (Digestion): ${ayurvedaProfile.agni} | '
          'Koshtha (Bowel Habit): ${ayurvedaProfile.koshtha} | '
          'Sleep: ${ayurvedaProfile.sleep} | '
          'Reported Prakriti Traits: ${ayurvedaProfile.dominantDoshaTraits.join("; ")}';
    }

    final questions = (questionsForDoctor != null && questionsForDoctor.isNotEmpty)
        ? questionsForDoctor
        : [
            'Should I repeat my routine blood test before starting any new treatment?',
            'Are my current medications still suitable for my lifestyle?',
            'What dietary adjustments are recommended for my condition?'
          ];

    return DoctorSummary(
      id: 'SUM-${DateTime.now().millisecondsSinceEpoch % 100000}',
      patientName: patient.name,
      patientMeta: '${patient.age} yrs • ${patient.gender} • Blood: ${patient.bloodGroup} • ID: ${patient.id}',
      nonDiagnosticDisclaimer:
          'NOTICE FOR EXAMINING PHYSICIAN: This is an AI-organized draft of patient-reported history. '
          'CareSetu does NOT provide medical diagnosis, prescriptions, or treatment advice. '
          'All clinical decisions rest entirely with the attending medical practitioner.',
      chiefComplaintsSummary: complaints,
      historyPresentIllness: hpi,
      preExistingConditions: conditions,
      currentMedications: meds,
      allergiesAlert: patient.allergies.isNotEmpty
          ? patient.allergies
          : 'No known drug allergies reported',
      ayurvedicSummary: ayurSummary,
      attachedDocsFindings: docFindings,
      questionsForDoctor: questions,
      generatedAt: 'Today, Ready for Doctor',
      provider: 'Gemini 1.5 Flash (Synthesizer Ready)',
    );
  }
}
