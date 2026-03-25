import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building, 
  Filter, 
  Plus, 
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';

// --- Mock Data ---
const CATEGORIES = ['الكل', 'هندسة ومقاولات', 'طبي وصيدلة', 'تعليم وتدريس', 'مبيعات وتجارة', 'حرفيين وفنيين'];

const MOCK_JOBS = [
  { 
    id: 1, 
    title: 'مهندس مدني (موقع)', 
    company: 'شركة المعمار للمقاولات', 
    location: 'المجاورة الأولى', 
    type: 'دوام كامل', 
    salary: '8000 - 12000 ج.م', 
    postedAt: 'منذ ساعتين', 
    category: 'هندسة ومقاولات',
    logo: 'https://picsum.photos/seed/job1/100/100',
    description: 'مطلوب مهندس مدني خبرة 3-5 سنوات للإشراف على مواقع الشركة في مدينة الكفراوي. يشترط إجادة برامج الأوتوكاد وإدارة المشروعات.'
  },
  { 
    id: 2, 
    title: 'صيدلي شيفت مسائي', 
    company: 'صيدليات الشفاء', 
    location: 'المجاورة الثالثة', 
    type: 'دوام جزئي', 
    salary: 'يحدد في المقابلة', 
    postedAt: 'منذ 5 ساعات', 
    category: 'طبي وصيدلة',
    logo: 'https://picsum.photos/seed/job2/100/100',
    description: 'مطلوب صيدلي للعمل بشيفت مسائي (من 4 عصراً إلى 12 منتصف الليل). يشترط حسن المظهر ولباقة التعامل مع الجمهور.'
  },
  { 
    id: 3, 
    title: 'مدرس لغة إنجليزية', 
    company: 'مدرسة الكفراوي للغات', 
    location: 'المجاورة الخامسة', 
    type: 'دوام كامل', 
    salary: '6000 ج.م', 
    postedAt: 'أمس', 
    category: 'تعليم وتدريس',
    logo: 'https://picsum.photos/seed/job3/100/100',
    description: 'تعلن المدرسة عن حاجتها لمدرس لغة إنجليزية للمرحلة الإعدادية. يشترط خبرة لا تقل عن سنتين وإجادة تامة للغة.'
  },
  { 
    id: 4, 
    title: 'كاشير', 
    company: 'سوبر ماركت الحمد', 
    location: 'المجاورة الثانية', 
    type: 'دوام كامل', 
    salary: '4000 ج.م', 
    postedAt: 'منذ يومين', 
    category: 'مبيعات وتجارة',
    logo: 'https://picsum.photos/seed/job4/100/100',
    description: 'مطلوب كاشير للعمل بسوبر ماركت كبير. يشترط الأمانة والالتزام بالمواعيد. لا يشترط الخبرة السابقة.'
  },
  { 
    id: 5, 
    title: 'فني صيانة تكييفات', 
    company: 'المركز الهندسي للتبريد', 
    location: 'المنطقة الصناعية', 
    type: 'عمل حر / بالقطعة', 
    salary: 'حسب الإنجاز', 
    postedAt: 'منذ 3 أيام', 
    category: 'حرفيين وفنيين',
    logo: 'https://picsum.photos/seed/job5/100/100',
    description: 'مطلوب فني صيانة تكييفات خبرة في التكييف الاسبليت والمركزي. يفضل من لديه رخصة قيادة.'
  },
];

const JobsModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.includes(searchTerm) || job.company.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = () => {
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-slate-900">وظائف الكفراوي</h1>
          <button className="bg-blue-600 text-white p-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-bold hidden sm:inline">أضف وظيفة</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن المسمى الوظيفي أو الشركة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto mt-4 pb-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedCategory === category 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Job Listings */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-800">أحدث الوظائف ({filteredJobs.length})</h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">لا توجد وظائف مطابقة</h3>
            <p className="text-slate-500 text-sm">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedJob(job)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-xl object-cover border border-slate-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{job.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.type}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{job.postedAt}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <button 
                onClick={() => setSelectedJob(null)} 
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-slate-900">تفاصيل الوظيفة</h2>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              <div className="flex flex-col items-center text-center mb-6">
                <img src={selectedJob.logo} alt={selectedJob.company} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-sm mb-4" />
                <h1 className="text-2xl font-black text-slate-900 mb-1">{selectedJob.title}</h1>
                <p className="text-slate-500 font-medium flex items-center justify-center gap-1">
                  <Building className="w-4 h-4" />
                  {selectedJob.company}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold">الموقع</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{selectedJob.location}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-bold">نوع العمل</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{selectedJob.type}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-bold">الراتب</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{selectedJob.salary}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">تاريخ النشر</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{selectedJob.postedAt}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-slate-900 text-lg mb-3">وصف الوظيفة</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            {/* Apply Button Fixed at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                التقدم للوظيفة الآن
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Confirmation Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              {isApplied ? (
                <div className="text-center py-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">تم التقديم بنجاح!</h3>
                  <p className="text-slate-500 text-sm">تم إرسال بياناتك إلى صاحب العمل. نتمنى لك التوفيق.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">تأكيد التقديم</h3>
                    <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    سيتم إرسال سيرتك الذاتية وبيانات التواصل الخاصة بك المسجلة في التطبيق إلى <span className="font-bold text-slate-900">{selectedJob?.company}</span>.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsApplyModalOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={handleApply}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      تأكيد وإرسال
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default JobsModule;
