/**
 * MediCare - Doctor and Specialities Dataset
 * Realistic medical specialist profiles with schedules and fees
 */

const SPECIALITIES_DATA = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'fa-solid fa-heart-pulse',
    description: 'Comprehensive heart care, cardiovascular diagnostics, and hypertension management.',
    doctorCount: 4,
    color: '#ef4444'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: 'fa-solid fa-hand-dots',
    description: 'Advanced skin treatments, acne therapies, eczema care, and cosmetic dermatology.',
    doctorCount: 3,
    color: '#06b6d4'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: 'fa-solid fa-baby',
    description: 'Specialized healthcare, immunization, growth tracking, and wellness for infants and children.',
    doctorCount: 5,
    color: '#f59e0b'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: 'fa-solid fa-brain',
    description: 'Expert care for neurological disorders, migraines, stroke rehabilitation, and spine health.',
    doctorCount: 3,
    color: '#8b5cf6'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: 'fa-solid fa-bone',
    description: 'Joint replacement, fracture recovery, sports injury treatment, and spine surgery.',
    doctorCount: 4,
    color: '#10b981'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: 'fa-solid fa-stethoscope',
    description: 'Primary medical care, preventive screenings, infectious diseases, and chronic illness management.',
    doctorCount: 6,
    color: '#2563eb'
  }
];

const DOCTORS_DATA = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    qualification: 'MD, FACC - Harvard Medical School',
    specialization: 'Cardiology',
    specialityId: 'cardiology',
    experienceYears: 14,
    consultationFee: 120,
    rating: 4.9,
    reviewCount: 148,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Central Heart Institute',
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
    availableToday: true,
    availableTomorrow: true,
    bio: 'Dr. Sarah Jenkins is an internationally acclaimed board-certified cardiologist specializing in preventive cardiology, heart failure management, and advanced cardiac imaging with 14+ years of patient-first practice.',
    education: 'MD Cardiology, Harvard Medical School; Fellowship in Interventional Cardiology, Johns Hopkins.',
    languages: ['English', 'Spanish']
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    qualification: 'MD, PhD, FAAN - Stanford University',
    specialization: 'Neurology',
    specialityId: 'neurology',
    experienceYears: 16,
    consultationFee: 150,
    rating: 4.95,
    reviewCount: 182,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Neurological Science Wing',
    availabilityDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
    availableToday: false,
    availableTomorrow: true,
    bio: 'Senior Neurologist with 16+ years of clinical excellence in treating neurodegenerative conditions, migraine management, epilepsy, and autonomic nervous disorders.',
    education: 'PhD & MD in Neurosciences, Stanford University; Neuro-Critical Care Fellowship, UCSF.',
    languages: ['English', 'German']
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Patel',
    qualification: 'MBBS, MD (Pediatrics), FAAP',
    specialization: 'Pediatrics',
    specialityId: 'pediatrics',
    experienceYears: 11,
    consultationFee: 85,
    rating: 4.88,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1594824813586-2a7852c0029c?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Children & Maternity Pavilion',
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    availableToday: true,
    availableTomorrow: true,
    bio: 'Compassionate pediatric specialist dedicated to gentle infant care, child developmental wellness, allergy diagnosis, and preventive childhood immunizations.',
    education: 'MD Pediatrics, Columbia University; Residency at Children’s Hospital of Philadelphia.',
    languages: ['English', 'Hindi', 'Gujarati']
  },
  {
    id: 'doc-4',
    name: 'Dr. David Chen',
    qualification: 'MD, FAAOS - Orthopedic Surgery',
    specialization: 'Orthopedics',
    specialityId: 'orthopedics',
    experienceYears: 15,
    consultationFee: 130,
    rating: 4.85,
    reviewCount: 164,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Joint & Spine Center',
    availabilityDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM'],
    availableToday: false,
    availableTomorrow: true,
    bio: 'Renowned orthopedic surgeon focused on robotic knee and hip reconstruction, sports arthroscopy, tendon repair, and non-surgical arthritis management.',
    education: 'MD Orthopedics, Yale School of Medicine; Fellowship in Sports Medicine, Mayo Clinic.',
    languages: ['English', 'Mandarin']
  },
  {
    id: 'doc-5',
    name: 'Dr. Elena Rostova',
    qualification: 'MD, FAAD - Clinical Dermatology',
    specialization: 'Dermatology',
    specialityId: 'dermatology',
    experienceYears: 9,
    consultationFee: 95,
    rating: 4.92,
    reviewCount: 139,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Aesthetics & Skin Health Clinic',
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM'],
    availableToday: true,
    availableTomorrow: true,
    bio: 'Expert dermatologist specializing in chronic skin conditions like psoriasis, rosacea, acne clearance, mole screening, and laser skin restoration.',
    education: 'MD Dermatology, Northwestern University Feinberg School of Medicine.',
    languages: ['English', 'Russian', 'French']
  },
  {
    id: 'doc-6',
    name: 'Dr. James Wilson',
    qualification: 'MD, FACP - Internal Medicine',
    specialization: 'General Medicine',
    specialityId: 'general-medicine',
    experienceYears: 18,
    consultationFee: 75,
    rating: 4.9,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Primary Care Center',
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:00 AM', '09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'],
    availableToday: true,
    availableTomorrow: true,
    bio: 'Trusted primary physician with 18+ years treating families, chronic conditions like diabetes and hypertension, acute viral infections, and annual health screenings.',
    education: 'MD Internal Medicine, University of Michigan Medical School.',
    languages: ['English']
  },
  {
    id: 'doc-7',
    name: 'Dr. Maya Lin',
    qualification: 'MD - Eye Surgeon & Ophthalmologist',
    specialization: 'General Medicine',
    specialityId: 'general-medicine',
    experienceYears: 12,
    consultationFee: 110,
    rating: 4.87,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Diagnostic & Wellness Outpost',
    availabilityDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    availableToday: false,
    availableTomorrow: true,
    bio: 'Dedicated family physician with extensive focus on preventive geriatrics, metabolic health, executive checkups, and nutritional medicine.',
    education: 'MD Internal Medicine, Johns Hopkins University School of Medicine.',
    languages: ['English', 'Cantonese']
  },
  {
    id: 'doc-8',
    name: 'Dr. Robert Hayes',
    qualification: 'MD, Diabetologist & Endocrinologist',
    specialization: 'Cardiology',
    specialityId: 'cardiology',
    experienceYears: 13,
    consultationFee: 115,
    rating: 4.89,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Cardio-Metabolic Center',
    availabilityDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:00 PM'],
    availableToday: true,
    availableTomorrow: false,
    bio: 'Cardiometabolic expert specializing in heart health preservation for diabetic patients, lipid disorder therapies, and hypertension control.',
    education: 'MD Endocrinology & Cardiology, Duke University School of Medicine.',
    languages: ['English']
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 'test-1',
    name: 'Emily Davis',
    role: 'Cardiac Patient',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    feedback: 'Booking with Dr. Sarah Jenkins on MediCare took less than 2 minutes. The online slot booking eliminated clinic waiting queues, and the care was world-class. Truly life-changing!',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 'test-2',
    name: 'Michael Zhang',
    role: 'Parent & Regular Patient',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    feedback: 'Dr. Priya Patel is extraordinary with kids! My 4-year-old felt completely relaxed during her checkup. The instant digital confirmation and appointment receipt made everything hassle-free.',
    date: '1 month ago',
    verified: true
  },
  {
    id: 'test-3',
    name: 'Sophia Taylor',
    role: 'Orthopedic Patient',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    feedback: 'After a severe sports injury, finding Dr. David Chen on MediCare was a blessing. The interactive booking showed real-time slots, and my post-surgery recovery is ahead of schedule!',
    date: '3 weeks ago',
    verified: true
  }
];

// Initial preloaded appointments for rich initial experience
const INITIAL_APPOINTMENTS = [
  {
    id: 'MED-72491',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpeciality: 'Cardiology',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Central Heart Institute',
    patientName: 'Gayathri Sharma',
    patientAge: 29,
    patientGender: 'Female',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'gayathri.sharma@example.com',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days in future
    timeSlot: '10:00 AM',
    reason: 'Annual preventive cardiovascular checkup and ECG consultation.',
    consultationFee: 120,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'MED-48102',
    doctorId: 'doc-6',
    doctorName: 'Dr. James Wilson',
    doctorSpeciality: 'General Medicine',
    doctorImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    hospital: 'MediCare Primary Care Center',
    patientName: 'Gayathri Sharma',
    patientAge: 29,
    patientGender: 'Female',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'gayathri.sharma@example.com',
    appointmentDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days in future
    timeSlot: '02:30 PM',
    reason: 'Routine metabolic blood panel review and wellness evaluation.',
    consultationFee: 75,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
