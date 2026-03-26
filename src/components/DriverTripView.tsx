import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageCircle, 
  MoreVertical, 
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Star,
  Clock,
  Car,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

interface DriverTripViewProps {
  trip: {
    id: string;
    pickup: string;
    destination: string;
    riderName: string;
    riderRating: number;
    price: string;
    distance: string;
  };
  status: 'going_to_pickup' | 'arrived' | 'on_trip' | 'completed' | 'idle';
  onStatusChange: (status: 'going_to_pickup' | 'arrived' | 'on_trip' | 'completed' | 'idle') => void;
  onCancel: () => void;
  socket: any;
}

export default function DriverTripView({ trip, status, onStatusChange, onCancel, socket }: DriverTripViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentFare, setCurrentFare] = useState(parseFloat(trip.price));
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (status === 'completed') {
      socket?.emit('trip_completed', { 
        requestId: trip.id, 
        fare: currentFare.toFixed(2) 
      });
    }
  }, [status, socket, trip.id, currentFare]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'on_trip' && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + 0.5, 100);
          // Update fare slightly as trip progresses
          setCurrentFare(f => f + 0.05);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [status, progress]);

  return (
    <div className="absolute inset-0 bg-slate-50 z-[110] flex flex-col">
      {/* Map Background (Simulated) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/driver-nav/1200/1600" 
          alt="Navigation Map" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        {/* Navigation Line Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M 100 600 L 200 400 L 300 500 L 350 300"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: status === 'on_trip' ? progress / 100 : 0.4 }}
            transition={{ duration: 1 }}
          />
          {/* Pickup Marker */}
          <circle cx="100" cy="600" r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
          {/* Destination Marker */}
          <circle cx="350" cy="300" r="8" fill="#1e293b" stroke="white" strokeWidth="3" />
        </svg>
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-10 p-6 pt-12">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">التوجه إلى</p>
              <p className="text-sm font-black text-slate-900 truncate max-w-[180px]">
                {status === 'going_to_pickup' ? trip.pickup : trip.destination}
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">المسافة</p>
            <p className="text-sm font-black text-emerald-600">
              {status === 'on_trip' ? `${(1.2 * (1 - progress/100)).toFixed(1)} كم` : '0.8 كم'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Trip Controls */}
      <div className="mt-auto relative z-10">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] p-6 pb-10"
        >
          {/* Handle for expanding */}
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-12 h-1.5 bg-slate-100 rounded-full"
            />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">طريقة الدفع</p>
                    <p className="text-sm font-black text-slate-900">نقداً</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الأجرة الحالية</p>
                    <p className="text-sm font-black text-emerald-600">{currentFare.toFixed(2)} ج.م</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rider Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-50 overflow-hidden">
                <img src={`https://picsum.photos/seed/${trip.riderName}/100/100`} alt="Rider" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{trip.riderName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-700">{trip.riderRating}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase">موثق</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (window.confirm('هل تريد إرسال نداء استغاثة للطوارئ؟')) {
                    alert('تم إرسال نداء الاستغاثة لفريق الطوارئ.');
                  }
                }}
                className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-200 transition-colors"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Specific Actions */}
          <div className="space-y-4">
            {status === 'going_to_pickup' && (
              <button 
                onClick={() => onStatusChange('arrived')}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
              >
                لقد وصلت لموقع الاستلام
              </button>
            )}

            {status === 'arrived' && (
              <button 
                onClick={() => onStatusChange('on_trip')}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                بدء الرحلة الآن
              </button>
            )}

            {status === 'on_trip' && (
              <div className="space-y-4">
                {/* Trip Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <button 
                  onClick={() => onStatusChange('completed')}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                >
                  إنهاء الرحلة وتحصيل الأجرة
                </button>
              </div>
            )}

            {status === 'completed' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">تم إنهاء الرحلة!</h3>
                  <p className="text-slate-500 font-bold mt-1">يرجى استلام {currentFare.toFixed(2)} ج.م نقداً</p>
                </div>
                <button 
                  onClick={onCancel}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg"
                >
                  العودة للوحة التحكم
                </button>
              </div>
            )}

            {status !== 'completed' && (
              <button 
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من إلغاء الرحلة؟ قد يؤثر ذلك على تقييمك.')) {
                    onCancel();
                  }
                }}
                className="w-full py-4 text-rose-500 font-bold text-sm flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                إلغاء الرحلة
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
