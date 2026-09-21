import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class EmergencySosSheet extends StatelessWidget {
  const EmergencySosSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const EmergencySosSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          const Text('🚨', style: TextStyle(fontSize: 40)),
          const SizedBox(height: 8),
          const Text(
            'Emergency Medical Helplines',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.emergencyRed,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'If you or the patient are experiencing severe chest pain, sudden numbness/paralysis, '
            'severe breathing difficulty, or uncontrolled bleeding, seek emergency medical care immediately.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Dialing Ambulance 108...')),
                );
              },
              icon: const Icon(Icons.phone, color: Colors.white),
              label: const Text('Call Ambulance: 108'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.emergencyRed,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Dialing National Emergency 112...')),
                );
              },
              icon: const Icon(Icons.emergency, color: Colors.white),
              label: const Text('Call National Emergency: 112'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF991B1B),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close', style: TextStyle(color: AppColors.textMuted)),
          ),
        ],
      ),
    );
  }
}
