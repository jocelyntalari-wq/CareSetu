class DoctorSummary {
  final String id;
  final String patientName;
  final String patientMeta;
  final String nonDiagnosticDisclaimer;
  final String chiefComplaintsSummary;
  final String historyPresentIllness;
  final String preExistingConditions;
  final List<String> currentMedications;
  final String allergiesAlert;
  final String? ayurvedicSummary;
  final List<String> attachedDocsFindings;
  final List<String> questionsForDoctor;
  final String generatedAt;
  final String provider;

  DoctorSummary({
    required this.id,
    required this.patientName,
    required this.patientMeta,
    required this.nonDiagnosticDisclaimer,
    required this.chiefComplaintsSummary,
    required this.historyPresentIllness,
    required this.preExistingConditions,
    required this.currentMedications,
    required this.allergiesAlert,
    this.ayurvedicSummary,
    required this.attachedDocsFindings,
    required this.questionsForDoctor,
    required this.generatedAt,
    this.provider = 'Gemini AI Live / Synthesizer',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'patient_name': patientName,
    'patient_meta': patientMeta,
    'non_diagnostic_disclaimer': nonDiagnosticDisclaimer,
    'chief_complaints_summary': chiefComplaintsSummary,
    'history_present_illness': historyPresentIllness,
    'pre_existing_conditions': preExistingConditions,
    'current_medications': currentMedications,
    'allergies_alert': allergiesAlert,
    'ayurvedic_summary': ayurvedicSummary,
    'attached_docs_findings': attachedDocsFindings,
    'questions_for_doctor': questionsForDoctor,
    'generated_at': generatedAt,
    'provider': provider,
  };
}
