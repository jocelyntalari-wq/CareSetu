class RecordedMedicine {
  final String name;
  final String dosage;
  final String note;

  RecordedMedicine({
    required this.name,
    required this.dosage,
    this.note = 'Patient-reported',
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'dosage': dosage,
    'note': note,
  };

  factory RecordedMedicine.fromJson(Map<String, dynamic> json) => RecordedMedicine(
    name: json['name'] ?? '',
    dosage: json['dosage'] ?? '',
    note: json['note'] ?? 'Patient-reported',
  );
}

class HealthStory {
  final List<String> chiefComplaints;
  final String severity; // Mild, Moderate, Severe
  final String durationValue;
  final String durationUnit; // Days, Weeks, Months
  final String freeNotes;
  final List<RecordedMedicine> recordedMedicines;
  final String updatedAt;

  HealthStory({
    this.chiefComplaints = const [],
    this.severity = 'Moderate',
    this.durationValue = '4',
    this.durationUnit = 'Days',
    this.freeNotes = '',
    this.recordedMedicines = const [],
    this.updatedAt = 'Just now',
  });

  HealthStory copyWith({
    List<String>? chiefComplaints,
    String? severity,
    String? durationValue,
    String? durationUnit,
    String? freeNotes,
    List<RecordedMedicine>? recordedMedicines,
    String? updatedAt,
  }) {
    return HealthStory(
      chiefComplaints: chiefComplaints ?? this.chiefComplaints,
      severity: severity ?? this.severity,
      durationValue: durationValue ?? this.durationValue,
      durationUnit: durationUnit ?? this.durationUnit,
      freeNotes: freeNotes ?? this.freeNotes,
      recordedMedicines: recordedMedicines ?? this.recordedMedicines,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'chief_complaints': chiefComplaints,
    'severity': severity,
    'duration_value': durationValue,
    'duration_unit': durationUnit,
    'free_notes': freeNotes,
    'recorded_medicines': recordedMedicines.map((m) => m.toJson()).toList(),
    'updated_at': updatedAt,
  };

  factory HealthStory.fromJson(Map<String, dynamic> json) => HealthStory(
    chiefComplaints: List<String>.from(json['chief_complaints'] ?? []),
    severity: json['severity'] ?? 'Moderate',
    durationValue: json['duration_value'] ?? '4',
    durationUnit: json['duration_unit'] ?? 'Days',
    freeNotes: json['free_notes'] ?? '',
    recordedMedicines: (json['recorded_medicines'] as List? ?? [])
        .map((m) => RecordedMedicine.fromJson(m))
        .toList(),
    updatedAt: json['updated_at'] ?? 'Just now',
  );
}
