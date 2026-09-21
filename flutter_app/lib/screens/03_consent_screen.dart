import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../state/app_state.dart';
import '../widgets/audio_listen_button.dart';
import '04_home_screen.dart';

class ConsentScreen extends StatefulWidget {
  final AppState? appState;

  const ConsentScreen({super.key, this.appState});

  @override
  State<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends State<ConsentScreen> {
  bool _agreed = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Patient Consent'),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: AudioListenButton(
              label: 'Listen',
              textToRead:
                  'Important medical safety and privacy consent. CareSetu is a patient history organizer. '
                  'The app does not provide diagnosis, prescriptions, treatment advice, or medical decisions. '
                  'Your data is stored privately and is only used to prepare a summary for your doctor.',
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Consent & Safety Agreement',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Please review how CareSetu protects your health records and supports your doctor consultation.',
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 20),

              // Prominent Non-Diagnostic Safety Card (Orange warning)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.warningBg,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.warningOrange, width: 1.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Text('⚠️', style: TextStyle(fontSize: 20)),
                        SizedBox(width: 8),
                        Text(
                          'Strict Non-Diagnostic Scope',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF9A3412),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '• CareSetu is exclusively a patient health history recording tool.\n'
                      '• This application does NOT provide medical diagnosis.\n'
                      '• It does NOT prescribe or suggest medications.\n'
                      '• It does NOT provide clinical treatment plans.\n'
                      '• The draft summary is prepared solely for you to show your licensed doctor.',
                      style: TextStyle(
                        fontSize: 13,
                        color: Color(0xFF7C2D12),
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Privacy & Data Rights Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.borderCard, width: 1.2),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Text('🔒', style: TextStyle(fontSize: 18)),
                        SizedBox(width: 8),
                        Text(
                          'Privacy & Document Security',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryDark,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Your uploaded prescriptions, lab reports, and voice notes are stored securely. '
                      'No hospital queue, nurse triage, or third-party marketing has access to your records.',
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Checkbox Agreement
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Checkbox(
                    value: _agreed,
                    activeColor: AppColors.primary,
                    onChanged: (val) {
                      setState(() => _agreed = val ?? false);
                    },
                  ),
                  const Expanded(
                    child: Text(
                      'I understand and agree to record my personal health history for doctor consultation.',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 14),

              // Action Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _agreed
                      ? () {
                          widget.appState?.setConsent(true);
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => HomeScreen(appState: widget.appState),
                            ),
                          );
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'I Agree & Open Health Passport ➔',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
