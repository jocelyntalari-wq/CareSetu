class AyurvedaProfile {
  final String agni; // Samagni, Mandagni, Tikshnagni, Vishamagni
  final String koshtha; // Regular, Hard / Constipated, Loose
  final String sleep; // Deep, Disturbed, Insomnia
  final String waterIntake;
  final List<String> dominantDoshaTraits;

  AyurvedaProfile({
    this.agni = 'Vishamagni (Irregular digestion, gas & bloating)',
    this.koshtha = 'Hard / Constipated (Straining)',
    this.sleep = 'Disturbed / Light (Waking up 2-3 times at night)',
    this.waterIntake = '1.5 to 2 Litres / day',
    this.dominantDoshaTraits = const [
      'Vata: Dry skin, joint stiffness, restless sleep',
      'Kapha: Morning lethargy & heaviness',
    ],
  });

  AyurvedaProfile copyWith({
    String? agni,
    String? koshtha,
    String? sleep,
    String? waterIntake,
    List<String>? dominantDoshaTraits,
  }) {
    return AyurvedaProfile(
      agni: agni ?? this.agni,
      koshtha: koshtha ?? this.koshtha,
      sleep: sleep ?? this.sleep,
      waterIntake: waterIntake ?? this.waterIntake,
      dominantDoshaTraits: dominantDoshaTraits ?? this.dominantDoshaTraits,
    );
  }

  Map<String, dynamic> toJson() => {
    'agni': agni,
    'koshtha': koshtha,
    'sleep': sleep,
    'water_intake': waterIntake,
    'dominant_dosha_traits': dominantDoshaTraits,
  };

  factory AyurvedaProfile.fromJson(Map<String, dynamic> json) => AyurvedaProfile(
    agni: json['agni'] ?? 'Vishamagni',
    koshtha: json['koshtha'] ?? 'Hard / Constipated',
    sleep: json['sleep'] ?? 'Disturbed',
    waterIntake: json['water_intake'] ?? '1.5 to 2 Litres / day',
    dominantDoshaTraits: List<String>.from(json['dominant_dosha_traits'] ?? []),
  );
}
