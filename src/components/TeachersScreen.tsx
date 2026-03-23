import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight,
  ChevronLeft,
  User,
  CheckCircle2,
  GraduationCap,
  DollarSign,
  Award
} from 'lucide-react';
import DynamicDetails from './DynamicDetails';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  image: string;
  isVerified: boolean;
  experience: string;
  description: string;
  schedule: { day: string; time: string }[];
}

const SUBJECTS = ['الكل', 'رياضيات', 'لغة عربية', 'لغة إنجليزية', 'فيزياء', 'كيمياء', 'أحياء'];

const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'أ/ محمد إبراهيم',
    subject: 'رياضيات',
    rating: 4.9,
    reviews: 156,
    pricePerHour: 100,
    image: 'https://picsum.photos/seed/t1/200/200',
    isVerified: true,
    experience: '10 سنوات خبرة',
    description: 'مدرس أول رياضيات للمرحلة الثانوية، متخصص في تبسيط المسائل المعقدة وتدريب الطلاب على أنظمة الامتحانات الحديثة.',
    schedule: [
      { day: 'السبت', time: '04:00 م - 06:00 م' },
      { day: 'الاثنين', time: '06:00 م - 08:00 م' },
      { day: 'الأربعاء', time: '04:00 م - 06:00 م' },
    ]
  },
  {
    id: '2',
    name: 'أ/ سارة أحمد',
    subject: 'لغة إنجليزية',
    rating: 4.8,
    reviews: 92,
    pricePerHour: 120,
    image: 'https://picsum.photos/seed/t2/200/200',
    isVerified: true,
    experience: '7 سنوات خبرة',
    description: 'خبيرة في تدريس اللغة الإنجليزية، تركز على مهارات التحدث والكتابة والتحضير لشهادات الآيلتس والتويفل.',
    schedule: [
      { day: 'الأحد', time: '05:00 م - 07:00 م' },
      { day: 'الثلاثاء', time: '05:00 م - 07:00 م' },
      { day: 'الخميس', time: '07:00 م - 09:00 م' },
    ]
  },
  {
    id: '3',
    name: 'أ/ محمود علي',
    subject: 'فيزياء',
    rating: 4.7,
    reviews: 64,
    pricePerHour: 150,
    image: 'https://picsum.photos/seed/t3/200/200',
    isVerified: false,
    experience: '5 سنوات خبرة',
    description: 'مدرس فيزياء متميز، يعتمد على التجارب العملية والوسائل التوضيحية لتقريب المفاهيم الفيزيائية لأذهان الطلاب.',
    schedule: [
      { day: 'السبت', time: '08:00 م - 10:00 م' },
      { day: 'الأربعاء', time: '08:00 م - 10:00 م' },
    ]
  },
];

export default function TeachersScreen({ onBack }: { onBack: () => void }) {
  const [activeSubject, setActiveSubject] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTeachers = activeSubject === 'الكل' 
    ? MOCK_TEACHERS 
    : MOCK_TEACHERS.filter(t => t.subject === activeSubject);

  if (selectedTeacher) {
    return (
      <DynamicDetails 
        title={selectedTeacher.name}
        subtitle={selectedTeacher.subject}
        image={selectedTeacher.image}
        rating={selectedTeacher.rating}
        reviews={selectedTeacher.reviews}
        price={`${selectedTeacher.pricePerHour} ج.م / ساعة`}
        description={selectedTeacher.description}
        mainActionLabel="احجز حصتك الآن"
        onMainAction={() => alert('تم حجز موعدك بنجاح!')}
        onBack={() => setSelectedTeacher(null)}
        category="منصة المدرسين"
        features={[
          { icon: <Award className="w-4 h-4" />, label: 'الخبرة', value: selectedTeacher.experience },
          { icon: <CheckCircle2 className="w-4 h-4" />, label: 'التوثيق', value: selectedTeacher.isVerified ? 'موثق' : 'غير موثق' },
          { icon: <Calendar className="w-4 h-4" />, label: 'المواعيد', value: `${selectedTeacher.schedule.length} أيام أسبوعياً` },
          { icon: <User className="w-4 h-4" />, label: 'الطلاب', value: 'أكثر من 500 طالب' },
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-royal-900 dark:text-royal-100">المدرسين</h1>
          <div className="mr-auto">
            <button className="p-2 bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 rounded-full">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {SUBJECTS.map(sub => (
            <button 
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubject === sub 
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4 max-w-md mx-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-1/2 h-4" />
                  <Skeleton className="w-1/3 h-3" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTeachers.map((teacher, index) => (
              <motion.div 
                key={teacher.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 items-center"
              >
                <div className="relative">
                  <img src={teacher.image} className="w-20 h-20 rounded-2xl object-cover" />
                  {teacher.isVerified && (
                    <div className="absolute -top-2 -right-2 bg-royal-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{teacher.name}</h3>
                  <p className="text-xs text-royal-600 dark:text-royal-400 font-medium mb-2">{teacher.subject}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" /> {teacher.rating}
                      <span className="text-slate-400 font-normal">({teacher.reviews})</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {teacher.pricePerHour} ج.م <span className="text-[10px] text-slate-400 font-normal">/ساعة</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedTeacher(teacher)}
                  className="p-3 bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 rounded-2xl hover:bg-royal-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
);
