import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Phone, 
  Mail, 
  IdCard, 
  Car, 
  FileText, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowRight,
  Upload,
  ShieldCheck,
  Info
} from 'lucide-react';

type Step = 'personal' | 'vehicle' | 'documents' | 'success';

export default function DriverRegistration({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('personal');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nationalId: '',
    carMake: '',
    carModel: '',
    carYear: '',
    plateNumber: '',
    licenseNumber: '',
  });

  const steps: { id: Step; label: string }[] = [
    { id: 'personal', label: 'البيانات الشخصية' },
    { id: 'vehicle', label: 'بيانات المركبة' },
    { id: 'documents', label: 'رفع المستندات' },
  ];

  const handleNext = () => {
    if (step === 'personal') setStep('vehicle');
    else if (step === 'vehicle') setStep('documents');
    else if (step === 'documents') setStep('success');
  };

  const handleBack = () => {
    if (step === 'vehicle') setStep('personal');
    else if (step === 'documents') setStep('vehicle');
    else onBack();
  };

  const renderProgress = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              step === s.id 
              ? 'bg-royal-600 border-royal-600 text-white shadow-lg shadow-royal-600/20' 
              : steps.findIndex(x => x.id === step) > i 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {steps.findIndex(x => x.id === step) > i ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{i + 1}</span>}
            </div>
            <span className={`text-[10px] font-bold whitespace-nowrap ${step === s.id ? 'text-royal-900' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-all duration-500 ${
              steps.findIndex(x => x.id === step) > i ? 'bg-emerald-500' : 'bg-slate-100'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-royal-900" />
          </button>
          <div className="flex items-center gap-2 bg-royal-50 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-royal-600" />
            <span className="text-[10px] font-black text-royal-600 uppercase tracking-wider">تسجيل آمن</span>
          </div>
        </div>

        {step !== 'success' && (
          <>
            <h1 className="text-3xl font-black text-royal-900 mb-2">انضم ككابتن</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">ابدأ رحلتك معنا وحقق أرباحاً إضافية في كفر الشيخ</p>
            {renderProgress()}
          </>
        )}
      </header>

      {/* Form Content */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait">
          {step === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="أدخل اسمك كما في البطاقة"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="01x xxxx xxxx"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">الرقم القومي</label>
                <div className="relative">
                  <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    placeholder="14 رقم"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'vehicle' && (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">ماركة السيارة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: هيونداي"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 px-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">الموديل</label>
                  <input 
                    type="text" 
                    placeholder="مثال: إلنترا"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 px-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">سنة الصنع</label>
                <input 
                  type="number" 
                  placeholder="2024"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 px-4 text-sm font-bold transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">رقم اللوحة</label>
                <div className="relative">
                  <Car className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="أ ب ج 1 2 3"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-royal-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  يرجى التأكد من أن الصور واضحة وجميع البيانات مقروءة لتسريع عملية المراجعة.
                </p>
              </div>

              {[
                { label: 'صورة رخصة القيادة', icon: <FileText /> },
                { label: 'صورة رخصة السيارة', icon: <Car /> },
                { label: 'صورة البطاقة (وجه)', icon: <IdCard /> },
                { label: 'الفيش الجنائي', icon: <ShieldCheck /> },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-royal-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-royal-500 transition-colors shadow-sm">
                      {doc.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.label}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">اضغط للرفع</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-royal-500 transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="relative mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
                />
              </div>
              <h2 className="text-3xl font-black text-royal-900 mb-4">تم استلام طلبك!</h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-12">
                شكراً لانضمامك إلينا. سيقوم فريق المراجعة بفحص مستنداتك والتواصل معك خلال 24 ساعة.
              </p>
              <button 
                onClick={onBack}
                className="w-full bg-royal-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-royal-900/20 hover:bg-royal-800 transition-all"
              >
                العودة للرئيسية
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {step !== 'success' && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
          <button 
            onClick={handleNext}
            className="w-full bg-royal-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-royal-900/20 flex items-center justify-center gap-3 hover:bg-royal-800 transition-all active:scale-[0.98]"
          >
            {step === 'documents' ? 'إرسال الطلب' : 'المتابعة'}
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

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
