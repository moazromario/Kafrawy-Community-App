import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Hospital, 
  Pill, 
  Microscope, 
  BookOpen, 
  Droplets, 
  ArrowRight, 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  Calendar,
  HeartPulse,
  Activity,
  Truck,
  Home,
  Plus,
  Camera,
  CheckCircle2,
  Award,
  Briefcase,
  GraduationCap as GradCap,
  ChevronLeft,
  X,
  Info,
  Upload,
  User,
  ShieldCheck
} from 'lucide-react';

// --- Mock Data ---
const DOCTORS = [
  { 
    id: 1, 
    name: 'د. أحمد محمود', 
    specialty: 'طبيب قلب وأوعية دموية', 
    rating: 4.9, 
    reviews: 128, 
    price: 300, 
    location: 'شارع الجمهورية، بجوار البنك الأهلي', 
    image: 'https://picsum.photos/seed/doc1/200/200',
    bio: 'استشاري أمراض القلب والأوعية الدموية، خبرة أكثر من 15 عاماً في علاج حالات ضغط الدم وقصور الشرايين التاجية.',
    education: 'دكتوراه أمراض القلب - جامعة القاهرة',
    experience: '15 سنة',
    languages: ['العربية', 'الإنجليزية'],
    gallery: ['https://picsum.photos/seed/clinic1/400/300', 'https://picsum.photos/seed/clinic2/400/300'],
    schedule: [
      { day: 'السبت', time: '10:00 ص - 04:00 م' },
      { day: 'الاثنين', time: '10:00 ص - 04:00 م' },
      { day: 'الأربعاء', time: '10:00 ص - 04:00 م' }
    ]
  },
  { 
    id: 2, 
    name: 'د. سارة كمال', 
    specialty: 'طبيبة أطفال وحديثي الولادة', 
    rating: 4.8, 
    reviews: 95, 
    price: 250, 
    location: 'ميدان المحطة، عمارة الأطباء', 
    image: 'https://picsum.photos/seed/doc2/200/200',
    bio: 'متخصصة في متابعة نمو الأطفال وعلاج أمراض الصدر والحساسية لدى الأطفال وحديثي الولادة.',
    education: 'ماجستير طب الأطفال - جامعة الإسكندرية',
    experience: '10 سنوات',
    languages: ['العربية', 'الإنجليزية'],
    gallery: ['https://picsum.photos/seed/clinic3/400/300'],
    schedule: [
      { day: 'الأحد', time: '12:00 م - 06:00 م' },
      { day: 'الثلاثاء', time: '12:00 م - 06:00 م' },
      { day: 'الخميس', time: '12:00 م - 06:00 م' }
    ]
  },
  { 
    id: 3, 
    name: 'د. محمد طارق', 
    specialty: 'طبيب أسنان وجراحة فكين', 
    rating: 4.7, 
    reviews: 210, 
    price: 200, 
    location: 'شارع البحر، أعلى صيدلية الشفاء', 
    image: 'https://picsum.photos/seed/doc3/200/200',
    bio: 'خبير في تجميل الأسنان وزراعة الأسنان وجراحات الفم والفكين بأحدث التقنيات العالمية.',
    education: 'بكالوريوس طب وجراحة الفم والأسنان - جامعة طنطا',
    experience: '8 سنوات',
    languages: ['العربية'],
    gallery: ['https://picsum.photos/seed/clinic4/400/300'],
    schedule: [
      { day: 'يومياً', time: '04:00 م - 10:00 م' }
    ]
  },
  { 
    id: 4, 
    name: 'د. هدى عبد الرحمن', 
    specialty: 'طبيبة جلدية وتجميل', 
    rating: 4.9, 
    reviews: 340, 
    price: 400, 
    location: 'برج الأطباء، الدور الثالث', 
    image: 'https://picsum.photos/seed/doc4/200/200',
    bio: 'استشارية الأمراض الجلدية والتجميل والليزر، متخصصة في علاج مشاكل البشرة والشعر وحقن الفيلر والبوتوكس.',
    education: 'دبلوم التجميل والليزر - الأكاديمية الأمريكية',
    experience: '12 سنة',
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    gallery: ['https://picsum.photos/seed/clinic5/400/300'],
    schedule: [
      { day: 'السبت', time: '01:00 م - 08:00 م' },
      { day: 'الأربعاء', time: '01:00 م - 08:00 م' }
    ]
  },
];

const HOSPITALS = [
  { id: 1, name: 'مستشفى كفر الشيخ العام', type: 'حكومي', location: 'شارع المستشفى', emergency: true, image: 'https://picsum.photos/seed/hosp1/400/300' },
  { id: 2, name: 'مستشفى الزهراء التخصصي', type: 'خاص', location: 'شارع النبوي المهندس', emergency: true, image: 'https://picsum.photos/seed/hosp2/400/300' },
  { id: 3, name: 'مركز الكلى والمسالك', type: 'متخصص', location: 'خلف المحافظة', emergency: false, image: 'https://picsum.photos/seed/hosp3/400/300' },
];

const PHARMACIES = [
  { id: 1, name: 'صيدلية العزبي', location: 'شارع الخليفة المأمون', delivery: true, openNow: true, rating: 4.8, image: 'https://picsum.photos/seed/pharm1/400/300' },
  { id: 2, name: 'صيدلية الطرشوبي', location: 'ميدان النصر', delivery: true, openNow: true, rating: 4.6, image: 'https://picsum.photos/seed/pharm2/400/300' },
  { id: 3, name: 'صيدلية الشفاء', location: 'شارع المصنع', delivery: false, openNow: false, rating: 4.2, image: 'https://picsum.photos/seed/pharm3/400/300' },
];

const LABS = [
  { id: 1, name: 'معامل المختبر', location: 'برج الأطباء، الدور الثاني', homeVisit: true, rating: 4.9, image: 'https://picsum.photos/seed/lab1/400/300' },
  { id: 2, name: 'معامل البرج', location: 'شارع النبوي المهندس', homeVisit: true, rating: 4.8, image: 'https://picsum.photos/seed/lab2/400/300' },
  { id: 3, name: 'معمل ألفا', location: 'ميدان المحطة', homeVisit: false, rating: 4.5, image: 'https://picsum.photos/seed/lab3/400/300' },
];

const MEDICAL_ARTICLES = [
  { id: 1, title: 'كيف تقوي مناعتك في فصل الشتاء؟', author: 'د. أحمد محمود', readTime: '5 دقائق', category: 'صحة عامة', image: 'https://picsum.photos/seed/medart1/400/300' },
  { id: 2, title: 'أهمية الفحص الدوري لمرضى السكري', author: 'د. هدى عبد الرحمن', readTime: '8 دقائق', category: 'أمراض مزمنة', image: 'https://picsum.photos/seed/medart2/400/300' },
  { id: 3, title: 'نصائح لتغذية سليمة للأطفال', author: 'د. سارة كمال', readTime: '6 دقائق', category: 'طب أطفال', image: 'https://picsum.photos/seed/medart3/400/300' },
];

const BLOOD_REQUESTS = [
  { id: 1, type: 'O-', hospital: 'مستشفى الزهراء', urgency: 'عاجل جداً', contact: '01012345678', time: 'منذ ساعتين' },
  { id: 2, type: 'A+', hospital: 'مستشفى كفر الشيخ العام', urgency: 'عاجل', contact: '01123456789', time: 'منذ 5 ساعات' },
  { id: 3, type: 'B-', hospital: 'بنك الدم الإقليمي', urgency: 'عادي', contact: '01234567890', time: 'منذ يوم' },
];

const SPECIALTIES = [
  'الكل', 'قلب', 'أطفال', 'أسنان', 'جلدية', 'باطنة', 'عظام', 'عيون', 'نساء وتوليد'
];

// --- Sub-screens ---

const DoctorsScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('الكل');

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">الأطباء</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن طبيب أو تخصص..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>

        {/* Specialties Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
          {SPECIALTIES.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedSpecialty === spec 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {DOCTORS.filter(doc => 
            (selectedSpecialty === 'الكل' || doc.specialty.includes(selectedSpecialty)) &&
            (doc.name.includes(search) || doc.specialty.includes(search))
          ).map(doc => (
            <motion.div 
              key={doc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/medical/doctor/${doc.id}`)}
              className="bg-[var(--card)] p-4 rounded-3xl border border-[var(--border)] flex flex-col gap-4 soft-shadow cursor-pointer"
            >
              <div className="flex gap-4">
                <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg">{doc.name}</h3>
                      <p className="text-xs text-rose-500 font-bold mb-1">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-black">{doc.rating}</span>
                    <span className="text-[10px] text-[var(--muted)]">({doc.reviews} تقييم)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--muted)]">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{doc.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--muted)] font-bold">سعر الكشف</span>
                  <span className="text-sm font-black">{doc.price} ج.م</span>
                </div>
                <button className="bg-rose-500 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-rose-500/30">
                  احجز الآن
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HospitalsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">المستشفيات</h1>
      </header>

      <div className="p-5 space-y-4">
        {HOSPITALS.map(hosp => (
          <motion.div 
            key={hosp.id}
            whileTap={{ scale: 0.98 }}
            className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow"
          >
            <div className="relative h-40">
              <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
              {hosp.emergency && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Activity className="w-3 h-3" /> طوارئ 24 ساعة
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-rose-600 text-[10px] font-black px-2 py-1 rounded-lg">
                {hosp.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-black text-lg mb-2">{hosp.name}</h3>
              <div className="flex items-center gap-1 text-[var(--muted)] mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold">{hosp.location}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> اتصال
                </button>
                <button className="flex-1 bg-rose-500 text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
                  <MapPin className="w-4 h-4" /> الاتجاهات
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PharmaciesScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">الصيدليات</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن صيدلية أو دواء..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>

        <div className="space-y-4">
          {PHARMACIES.filter(p => p.name.includes(search)).map(pharm => (
            <motion.div 
              key={pharm.id}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow"
            >
              <div className="relative h-32">
                <img src={pharm.image} alt={pharm.name} className="w-full h-full object-cover" />
                {pharm.openNow ? (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    مفتوح الآن
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    مغلق
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg">{pharm.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-black">{pharm.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[var(--muted)] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold">{pharm.location}</span>
                </div>
                <div className="flex gap-2">
                  {pharm.delivery && (
                    <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1">
                      <Truck className="w-3 h-3" /> توصيل للمنازل
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> اتصال
                  </button>
                  <button className="flex-1 bg-rose-500 text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
                    <MapPin className="w-4 h-4" /> الاتجاهات
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LabsScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">معامل التحاليل</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن معمل أو تحليل..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-rose-500 transition-all"
          />
        </div>

        <div className="space-y-4">
          {LABS.filter(l => l.name.includes(search)).map(lab => (
            <motion.div 
              key={lab.id}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow"
            >
              <div className="relative h-32">
                <img src={lab.image} alt={lab.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg">{lab.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-black">{lab.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[var(--muted)] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold">{lab.location}</span>
                </div>
                <div className="flex gap-2">
                  {lab.homeVisit && (
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1">
                      <Home className="w-3 h-3" /> زيارة منزلية
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> اتصال
                  </button>
                  <button className="flex-1 bg-rose-500 text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
                    <Calendar className="w-4 h-4" /> حجز موعد
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MedicalArticlesScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">مقالات طبية</h1>
      </header>

      <div className="p-5 space-y-4">
        {MEDICAL_ARTICLES.map(article => (
          <motion.div 
            key={article.id}
            whileTap={{ scale: 0.98 }}
            className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow cursor-pointer"
          >
            <div className="relative h-40">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rose-600 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                {article.category}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-black text-lg mb-3 leading-tight">{article.title}</h3>
              <div className="flex justify-between items-center text-xs text-[var(--muted)] font-bold">
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BloodBankScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-rose-600">بنك الدم</h1>
      </header>

      <div className="p-5">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-[32px] p-6 text-white mb-6 shadow-xl shadow-rose-500/30 relative overflow-hidden">
          <Droplets className="absolute -left-4 -bottom-4 w-32 h-32 text-white opacity-10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">قطرة دم تنقذ حياة</h2>
            <p className="text-sm opacity-90 mb-4 font-bold">ساهم في إنقاذ حياة مريض، تبرعك بالدم يصنع الفارق.</p>
            <button className="bg-white text-rose-600 px-6 py-2.5 rounded-xl text-sm font-black">
              تسجيل كمتبرع
            </button>
          </div>
        </div>

        <h3 className="font-black text-lg mb-4">حالات عاجلة</h3>
        <div className="space-y-3">
          {BLOOD_REQUESTS.map(req => (
            <div key={req.id} className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-center gap-4 soft-shadow">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-black text-xl border-2 border-rose-200">
                {req.type}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-sm">{req.hospital}</h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    req.urgency === 'عاجل جداً' ? 'bg-red-100 text-red-600' : 
                    req.urgency === 'عاجل' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {req.urgency}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] font-bold mb-2">{req.time}</p>
                <button className="w-full bg-rose-50 text-rose-600 py-1.5 rounded-lg text-xs font-black flex items-center justify-center gap-2">
                  <Phone className="w-3 h-3" /> تواصل للتبرع
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MedicalDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-rose-600">دليل الصحة</h1>
        </div>
        <button 
          onClick={() => navigate('/medical/onboarding')}
          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-rose-500/20 flex items-center gap-2"
        >
          <Plus className="w-3 h-3" /> انضم كطبيب
        </button>
      </header>

      {/* Main Search */}
      <div className="p-5 pb-2">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن دكتور، تخصص، أو مستشفى..." 
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-rose-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="p-5 grid grid-cols-3 gap-4">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/doctors')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Stethoscope className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">الأطباء</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/hospitals')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Hospital className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">المستشفيات</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/pharmacies')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Pill className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">الصيدليات</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/labs')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Microscope className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">المعامل</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/blood')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Droplets className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">فصائل الدم</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/medical/articles')}
          className="bg-[var(--card)] p-4 rounded-[24px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-1"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <span className="font-black text-xs">مقالات</span>
        </motion.div>
      </div>

      {/* Top Doctors Preview */}
      <div className="px-5 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black tracking-tight">أطباء متميزون</h2>
          <button onClick={() => navigate('/medical/doctors')} className="text-rose-600 text-xs font-black">عرض الكل</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {DOCTORS.slice(0, 3).map(doc => (
            <div key={doc.id} className="min-w-[160px] bg-[var(--card)] rounded-3xl border border-[var(--border)] p-3 soft-shadow flex flex-col items-center text-center">
              <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-rose-100" />
              <h4 className="text-sm font-black mb-1">{doc.name}</h4>
              <p className="text-[10px] text-rose-500 font-bold mb-2">{doc.specialty}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs font-black">{doc.rating}</span>
              </div>
              <button className="w-full bg-rose-50 text-rose-600 py-1.5 rounded-xl text-xs font-black">
                حجز
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DoctorOnboardingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    education: '',
    location: '',
    price: '',
    bio: '',
    phone: '',
    image: null as string | null,
    gallery: [] as string[],
    schedule: [] as { day: string, from: string, to: string }[]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => step > 1 ? prevStep() : navigate(-1)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-black">انضم كطبيب</h1>
            <p className="text-[10px] text-slate-400 font-bold">خطوة {step} من 4</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${i <= step ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          ))}
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-[40px] bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center group">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-2 rounded-2xl shadow-lg">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-xl font-black">المعلومات الأساسية</h2>
              <p className="text-xs text-slate-400 font-bold">أضف صورتك الشخصية واسمك المهني</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">الاسم بالكامل (دكتور/...)</label>
                <input 
                  type="text" 
                  placeholder="مثال: د. أحمد محمد علي"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">التخصص الرئيسي</label>
                <select 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:border-rose-500 outline-none transition-all appearance-none"
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                >
                  <option value="">اختر التخصص</option>
                  {SPECIALTIES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">رقم الهاتف للتواصل</label>
                <input 
                  type="tel" 
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black">الخبرة والمؤهلات</h2>
              <p className="text-xs text-slate-400 font-bold">أخبر المرضى عن مسيرتك العلمية والعملية</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">سنوات الخبرة</label>
                <div className="relative">
                  <Briefcase className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="مثال: 15 سنة خبرة"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">المؤهل الدراسي</label>
                <div className="relative">
                  <GradCap className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="مثال: ماجستير جراحة القلب - جامعة عين شمس"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                    value={formData.education}
                    onChange={e => setFormData({...formData, education: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">نبذة تعريفية (Bio)</label>
                <textarea 
                  placeholder="اكتب نبذة مختصرة عنك وعن الخدمات التي تقدمها..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:border-rose-500 outline-none transition-all h-32 resize-none"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black">بيانات العيادة</h2>
              <p className="text-xs text-slate-400 font-bold">أين يمكن للمرضى زيارتك؟</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">عنوان العيادة بالتفصيل</label>
                <div className="relative">
                  <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="مثال: شارع الجمهورية، برج السلام، الدور الثاني"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2">سعر الكشف (ج.م)</label>
                <div className="relative">
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">ج.م</span>
                  <input 
                    type="number" 
                    placeholder="000"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-16 pl-6 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-black">الجدول ومعرض الصور</h2>
              <p className="text-xs text-slate-400 font-bold">حدد مواعيدك وأضف صوراً لعيادتك أو شهاداتك</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" /> مواعيد العمل
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {days.map(day => (
                    <button 
                      key={day}
                      onClick={() => {
                        const exists = formData.schedule.find(s => s.day === day);
                        if (exists) {
                          setFormData({...formData, schedule: formData.schedule.filter(s => s.day !== day)});
                        } else {
                          setFormData({...formData, schedule: [...formData.schedule, { day, from: '09:00', to: '17:00' }]});
                        }
                      }}
                      className={`py-3 rounded-xl text-[10px] font-black border transition-all ${
                        formData.schedule.find(s => s.day === day)
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black flex items-center justify-between">
                  <span className="flex items-center gap-2"><Upload className="w-4 h-4 text-rose-500" /> معرض الصور</span>
                  <span className="text-[10px] text-slate-400">{formData.gallery.length} صور</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {formData.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})}
                        className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                    <Plus className="w-6 h-6 text-slate-300" />
                    <span className="text-[8px] font-black text-slate-400">أضف صورة</span>
                    <input type="file" className="hidden" multiple onChange={handleGalleryUpload} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-12 space-y-4">
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !formData.name}
              className="w-full bg-rose-500 text-white py-4 rounded-[24px] font-black shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              المتابعة <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <button 
              onClick={() => {
                // Here you would typically save the data
                alert('تم إرسال طلب الانضمام بنجاح! سيتم مراجعة ملفك وتفعيله قريباً.');
                navigate('/medical');
              }}
              className="w-full bg-emerald-500 text-white py-4 rounded-[24px] font-black shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              إرسال طلب الانضمام <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="w-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-4 rounded-[24px] font-black"
            >
              الرجوع للخلف
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

const DoctorProfileScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctor = DOCTORS.find(d => d.id === Number(id));

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <div className="relative h-64">
        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-md text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-6 right-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-500 text-[10px] font-black px-2 py-0.5 rounded-full">متحقق منه</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-xs font-black">{doctor.rating}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1">{doctor.name}</h1>
          <p className="text-sm opacity-90 font-bold">{doctor.specialty}</p>
        </div>
      </div>

      <div className="p-6 -mt-4 bg-[var(--background)] rounded-t-[32px] relative z-10 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] text-center">
            <p className="text-[10px] text-[var(--muted)] font-bold mb-1">الخبرة</p>
            <p className="text-sm font-black">{doctor.experience}</p>
          </div>
          <div className="bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] text-center">
            <p className="text-[10px] text-[var(--muted)] font-bold mb-1">التقييمات</p>
            <p className="text-sm font-black">{doctor.reviews}</p>
          </div>
          <div className="bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] text-center">
            <p className="text-[10px] text-[var(--muted)] font-bold mb-1">السعر</p>
            <p className="text-sm font-black">{doctor.price} ج.م</p>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Info className="w-5 h-5 text-rose-500" /> عن الدكتور
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-bold">
            {doctor.bio}
          </p>
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-lg font-black flex items-center gap-2">
            <GradCap className="w-5 h-5 text-rose-500" /> التعليم والمؤهلات
          </h3>
          <div className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold leading-relaxed">{doctor.education}</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" /> مواعيد العمل
          </h3>
          <div className="space-y-2">
            {doctor.schedule.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-[var(--card)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-sm font-black">{s.day}</span>
                <span className="text-xs text-[var(--muted)] font-bold">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-500" /> صور العيادة
          </h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {doctor.gallery.map((img, i) => (
              <img key={i} src={img} className="w-48 h-32 rounded-2xl object-cover shrink-0 border border-[var(--border)]" />
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-lg font-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" /> الموقع
          </h3>
          <div className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] space-y-3">
            <p className="text-sm font-bold">{doctor.location}</p>
            <button className="w-full bg-rose-50 text-rose-600 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> عرض على الخريطة
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-[var(--border)] z-50 flex gap-3">
        <button className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" /> احجز موعد الآن
        </button>
        <button className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const MedicalModule = () => {
  return (
    <Routes>
      <Route path="/" element={<MedicalDashboard />} />
      <Route path="/doctors" element={<DoctorsScreen />} />
      <Route path="/doctor/:id" element={<DoctorProfileScreen />} />
      <Route path="/hospitals" element={<HospitalsScreen />} />
      <Route path="/pharmacies" element={<PharmaciesScreen />} />
      <Route path="/labs" element={<LabsScreen />} />
      <Route path="/blood" element={<BloodBankScreen />} />
      <Route path="/articles" element={<MedicalArticlesScreen />} />
      <Route path="/onboarding" element={<DoctorOnboardingScreen />} />
    </Routes>
  );
};

export default MedicalModule;
