class Patient {
  final String id;
  final String name;
  final int age;
  final String gender;
  final String bloodGroup;
  final String emergencyContact;
  final String allergies;
  final String selectedTrack; // 'General Medicine' or 'Ayurveda'
  final List<String> chronicConditions;

  Patient({
    required this.id,
    required this.name,
    required this.age,
    required this.gender,
    required this.bloodGroup,
    required this.emergencyContact,
    required this.allergies,
    this.selectedTrack = 'General Medicine',
    this.chronicConditions = const [],
  });

  Patient copyWith({
    String? id,
    String? name,
    int? age,
    String? gender,
    String? bloodGroup,
    String? emergencyContact,
    String? allergies,
    String? selectedTrack,
    List<String>? chronicConditions,
  }) {
    return Patient(
      id: id ?? this.id,
      name: name ?? this.name,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      allergies: allergies ?? this.allergies,
      selectedTrack: selectedTrack ?? this.selectedTrack,
      chronicConditions: chronicConditions ?? this.chronicConditions,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'age': age,
      'gender': gender,
      'blood_group': bloodGroup,
      'emergency_contact': emergencyContact,
      'allergies': allergies,
      'selected_track': selectedTrack,
      'chronic_conditions': chronicConditions,
    };
  }

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'] ?? 'CS-0000',
      name: json['name'] ?? '',
      age: json['age'] ?? 0,
      gender: json['gender'] ?? 'Other',
      bloodGroup: json['blood_group'] ?? 'Unknown',
      emergencyContact: json['emergency_contact'] ?? '',
      allergies: json['allergies'] ?? '',
      selectedTrack: json['selected_track'] ?? 'General Medicine',
      chronicConditions: List<String>.from(json['chronic_conditions'] ?? []),
    );
  }
}
