import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../state/app_state.dart';
import '../widgets/bridge_header.dart';
import '../widgets/passport_card.dart';
import '../widgets/emergency_sos_sheet.dart';
import '05_profile_screen.dart';
import '06_track_selection_screen.dart';
import '08_upload_reports_screen.dart';
import '09_draft_summary_screen.dart';

class HomeScreen extends StatefulWidget {
  final AppState? appState;

  const HomeScreen({super.key, this.appState});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final state = widget.appState ?? AppState();

    return ListenableBuilder(
      listenable: state,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: AppColors.bgCream,
          appBar: AppBar(
            automaticallyImplyLeading: false,
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.primarySubtle,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text('🌉', style: TextStyle(fontSize: 18)),
                ),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      state.t('brand'),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.primaryDark,
                      ),
                    ),
                    Text(
                      state.t('tagline'),
                      style: const TextStyle(fontSize: 10, color: AppColors.primaryLight, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              // Language Switcher Button
              TextButton(
                onPressed: () => state.toggleLanguage(),
                child: Text(
                  state.language == 'en' ? '🌐 हिंदी' : '🌐 EN',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary),
                ),
              ),

              // Emergency SOS Trigger
              Padding(
                padding: const EdgeInsets.only(right: 12),
                child: ElevatedButton.icon(
                  onPressed: () => EmergencySosSheet.show(context),
                  icon: const Text('🚨', style: TextStyle(fontSize: 12)),
                  label: const Text('SOS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.emergencyRed,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    minimumSize: Size.zero,
                  ),
                ),
              ),
            ],
          ),
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Animated Bridge Header
                  const BridgeHeader(),

                  // Digital Health Passport Card
                  PassportCard(
                    patient: state.patient,
                    onEdit: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProfileScreen(appState: state),
                        ),
                      );
                    },
                  ),

                  // Quick Health Actions Header
                  const SizedBox(height: 8),
                  const Text(
                    '⚡ Quick Health Actions',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Grid of 4 Action Cards
                  Row(
                    children: [
                      // Action 1: General Medicine
                      Expanded(
                        child: _buildActionCard(
                          icon: '🩺',
                          title: 'General Medicine Check-in',
                          subtitle: 'Fever, cough, body pain, sugar & BP',
                          color: AppColors.genMedLight,
                          borderColor: AppColors.genMedBorder,
                          onTap: () {
                            state.setTrack('General Medicine');
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => TrackSelectionScreen(appState: state),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Action 2: Ayurveda
                      Expanded(
                        child: _buildActionCard(
                          icon: '🌿',
                          title: 'Ayurveda & Lifestyle Profile',
                          subtitle: 'Digestion (Agni), sleep & doshas',
                          color: AppColors.ayurLight,
                          borderColor: AppColors.ayurBorder,
                          onTap: () {
                            state.setTrack('Ayurveda');
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => TrackSelectionScreen(appState: state),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  Row(
                    children: [
                      // Action 3: Document Locker
                      Expanded(
                        child: _buildActionCard(
                          icon: '📁',
                          title: 'Medical Document Locker',
                          subtitle: 'Old prescriptions, lab tests & scans',
                          color: const Color(0xFFF8FAFC),
                          borderColor: const Color(0xFFCBD5E1),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => UploadReportsScreen(appState: state),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Action 4: Patient Profile
                      Expanded(
                        child: _buildActionCard(
                          icon: '👤',
                          title: 'My Profile & Details',
                          subtitle: 'Allergies, blood group & contact',
                          color: Colors.white,
                          borderColor: AppColors.borderCard,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ProfileScreen(appState: state),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Prominent Banner: Generate Doctor Summary
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => DraftSummaryScreen(appState: state),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.primaryDark, AppColors.primary],
                        ),
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.25),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text('📋', style: TextStyle(fontSize: 24)),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  'Generate Doctor Summary',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  'Create 1-page health bridge card for physician review',
                                  style: TextStyle(fontSize: 12, color: Color(0xFFCCFBF1)),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF5EEAD4), size: 18),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _currentIndex,
            selectedItemColor: AppColors.primary,
            unselectedItemColor: AppColors.textMuted,
            type: BottomNavigationBarType.fixed,
            backgroundColor: Colors.white,
            onTap: (index) {
              setState(() => _currentIndex = index);
              if (index == 1) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => TrackSelectionScreen(appState: state),
                  ),
                );
              } else if (index == 2) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => UploadReportsScreen(appState: state),
                  ),
                );
              } else if (index == 3) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DraftSummaryScreen(appState: state),
                  ),
                );
              }
            },
            items: const [
              BottomNavigationBarItem(icon: Text('🛡️', style: TextStyle(fontSize: 18)), label: 'Passport'),
              BottomNavigationBarItem(icon: Text('📖', style: TextStyle(fontSize: 18)), label: 'Story'),
              BottomNavigationBarItem(icon: Text('📁', style: TextStyle(fontSize: 18)), label: 'Documents'),
              BottomNavigationBarItem(icon: Text('📋', style: TextStyle(fontSize: 18)), label: 'Summary'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildActionCard({
    required String icon,
    required String title,
    required String subtitle,
    required Color color,
    required Color borderColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 140,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: 1.2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
