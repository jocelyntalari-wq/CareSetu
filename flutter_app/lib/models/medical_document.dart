class MedicalDocument {
  final String id;
  final String title;
  final String date;
  final String category; // 'Prescription', 'Blood Test', 'Scan / Imaging'
  final String categoryCode; // 'rx', 'lab', 'scan'
  final String extractedFindings;
  final String icon;
  final String fileName;
  final String? localFilePath;
  final String? remoteStorageUrl;

  MedicalDocument({
    required this.id,
    required this.title,
    required this.date,
    required this.category,
    required this.categoryCode,
    required this.extractedFindings,
    required this.icon,
    required this.fileName,
    this.localFilePath,
    this.remoteStorageUrl,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'date': date,
    'category': category,
    'category_code': categoryCode,
    'extracted_findings': extractedFindings,
    'icon': icon,
    'file_name': fileName,
    'local_file_path': localFilePath,
    'remote_storage_url': remoteStorageUrl,
  };

  factory MedicalDocument.fromJson(Map<String, dynamic> json) => MedicalDocument(
    id: json['id'] ?? '',
    title: json['title'] ?? '',
    date: json['date'] ?? 'Recent',
    category: json['category'] ?? 'General',
    categoryCode: json['category_code'] ?? 'lab',
    extractedFindings: json['extracted_findings'] ?? '',
    icon: json['icon'] ?? '📄',
    fileName: json['file_name'] ?? '',
    localFilePath: json['local_file_path'],
    remoteStorageUrl: json['remote_storage_url'],
  );
}
