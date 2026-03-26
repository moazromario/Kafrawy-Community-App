import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { io, Socket } from 'socket.io-client';
import DriverRequestOverlay from './DriverRequestOverlay';
import DriverTripView from './DriverTripView';
import { 
  MapPin, 
  ArrowRight, 
  Car, 
  ChevronLeft, 
  Search, 
  Bell,
  Navigation,
  CreditCard,
  Wallet,
  Banknote,
  Info,
  Clock,
  Zap,
  ChevronUp,
  Star,
  MessageCircle,
  Phone,
  Plus,
  CheckCircle2,
  Send,
  History,
  Share2,
  AlertTriangle,
  ShieldAlert,
  Camera,
  FileText,
  ShieldCheck,
  Smartphone,
  Check,
  Power,
  TrendingUp,
  Activity,
  MoreVertical
} from 'lucide-react';

type RideType = 'tuktuk' | 'car' | 'delivery';
type PaymentMethod = 'cash' | 'wallet' | 'card';
type BookingStatus = 'idle' | 'searching' | 'found' | 'tracking' | 'completed';

interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  distance: string;
  image: string;
  phone: string;
}

const MOCK_DRIVER: Driver = {
  id: 'd1',
  name: 'كابتن محمود علي',
  rating: 4.9,
  trips: 1240,
  car: 'تويوتا كورولا - فضي',
  plate: 'أ ب ج 1234',
  distance: '0.8 كم',
  image: 'https://picsum.photos/seed/driver1/200/200',
  phone: '+201234567890',
};

const RIDE_TYPES = [
  { id: 'tuktuk', name: 'توكتوك', icon: <Car className="w-6 h-6" />, eta: '2 دقيقة', price: '15' },
  { id: 'car', name: 'سيارة', icon: <Car className="w-6 h-6 text-blue-600" />, eta: '5 دقائق', price: '30' },
  { id: 'delivery', name: 'دليفري', icon: <Car className="w-7 h-7" />, eta: '10 دقائق', price: '20' },
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'نقداً', icon: <Banknote className="w-5 h-5" /> },
  { id: 'wallet', name: 'المحفظة', icon: <Wallet className="w-5 h-5" /> },
  { id: 'card', name: 'بطاقة بنكية', icon: <CreditCard className="w-5 h-5" /> },
];

export default function RideBooking({ onBack, onShowHistory }: { onBack: () => void, onShowHistory: () => void }) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [driverRegStatus, setDriverRegStatus] = useState<'unregistered' | 'registering' | 'pending' | 'approved'>('unregistered');
  const [driverRegStep, setDriverRegStep] = useState(1);
  const [driverRegData, setDriverRegData] = useState({
    photo: null as string | null,
    license: null as string | null,
    vehicleReg: null as string | null,
    phone: '',
    otp: ''
  });
  const [isWorking, setIsWorking] = useState(false);
  const isWorkingRef = useRef(isWorking);
  useEffect(() => { isWorkingRef.current = isWorking; }, [isWorking]);

  const [dailyRides, setDailyRides] = useState(12);
  const [dailyEarnings, setDailyEarnings] = useState(450.00);
  const [weeklyEarnings, setWeeklyEarnings] = useState(2840.00);
  const [activeDriverTrip, setActiveDriverTrip] = useState<any | null>(null);
  const [driverTripStatus, setDriverTripStatus] = useState<'idle' | 'going_to_pickup' | 'arrived' | 'on_trip' | 'completed'>('idle');
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideType>('tuktuk');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isDriverCardExpanded, setIsDriverCardExpanded] = useState(false);
  const [pickup, setPickup] = useState('موقعي الحالي - شارع الجمهورية');
  const [destination, setDestination] = useState('');
  const [acceptTimer, setAcceptTimer] = useState(5);
  const [tripProgress, setTripProgress] = useState(0);
  const [tripTime, setTripTime] = useState(0);
  const [tripCost, setTripCost] = useState(15.00);
  const [isEcoMode, setIsEcoMode] = useState(true);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [rideHistory, setRideHistory] = useState<any[]>([]);

  const FEEDBACK_TAGS = [
    { id: 'clean', label: 'سيارة نظيفة' },
    { id: 'polite', label: 'سائق مهذب' },
    { id: 'fast', label: 'وصول سريع' },
    { id: 'safe', label: 'قيادة آمنة' },
  ];

  const handleRatingSelect = (val: number) => {
    setRating(val);
    if (val === 5) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1e3a8a', '#fbbf24', '#ffffff']
      });
    }
  };

  const handleSubmitRating = () => {
    // Save to history
    const newRide = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG'),
      pickup,
      destination,
      cost: tripCost,
      time: tripTime,
      distance: ((100 - tripProgress) * 0.05).toFixed(1),
      driver: MOCK_DRIVER.name,
      rating,
      comment
    };
    setRideHistory(prev => [newRide, ...prev]);
    setIsRatingSubmitted(true);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  useEffect(() => {
    // Initialize Socket Connection
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    // Rider Events
    socketRef.current.on('ride_searching', () => {
      setBookingStatus('searching');
    });

    socketRef.current.on('driver_found', () => {
      setBookingStatus('found');
      setAcceptTimer(5);
    });

    // Driver Events
    socketRef.current.on('new_ride_available', (ride: any) => {
      if (isWorkingRef.current) {
        setAvailableRides(prev => [...prev, ride]);
        // Visual/Haptic feedback simulation
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    });

    socketRef.current.on('ride_cancelled_for_others', (data: { requestId: string }) => {
      setAvailableRides(prev => prev.filter(r => r.id !== data.requestId));
    });

    socketRef.current.on('ride_confirmed', (data: { requestId: string, role: string, ride?: any }) => {
      if (data.role === 'driver') {
        // Find the ride in availableRides or use the one from data
        const ride = availableRides.find(r => r.id === data.requestId) || data.ride;
        setActiveDriverTrip(ride);
        setDriverTripStatus('going_to_pickup');
        setAvailableRides([]);
      }
    });

    socketRef.current.on('ride_already_taken', (data: { requestId: string }) => {
      alert('عذراً، قام سائق آخر بقبول هذه الرحلة.');
      setAvailableRides(prev => prev.filter(r => r.id !== data.requestId));
    });

    socketRef.current.on('driver_banned', (data: { message: string }) => {
      alert(data.message);
      setIsWorking(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDriverMode && isWorking && driverRegStatus === 'approved') {
      timeout = setTimeout(() => {
        if (availableRides.length === 0) {
          const demoRide = {
            id: 'demo-' + Date.now(),
            pickup: 'شارع الجمهورية - أمام البنك الأهلي',
            destination: 'ميدان التحرير - كفر الشيخ',
            riderName: 'أحمد محمد',
            riderRating: 4.9,
            price: '45.00',
            distance: '1.2 كم'
          };
          setAvailableRides([demoRide]);
        }
      }, 5000); // 5 seconds after going online
    }
    return () => clearTimeout(timeout);
  }, [isDriverMode, isWorking, driverRegStatus, availableRides.length]);

  useEffect(() => {
    if (isDriverMode) {
      socketRef.current?.emit('join', 'driver');
    } else {
      socketRef.current?.emit('join', 'rider');
    }
  }, [isDriverMode]);

  useEffect(() => {
    // Simulated GPS Spoofing Detection
    const checkGps = setInterval(() => {
      const isSpoofing = Math.random() < 0.0001; 
      if (isSpoofing) {
        alert('تنبيه أمني: تم اكتشاف محاولة تلاعب بموقع GPS. سيتم إغلاق التطبيق لأسباب أمنية.');
        window.location.reload();
      }
    }, 60000);
    return () => clearInterval(checkGps);
  }, []);

  const handleEmergency = () => {
    if (window.confirm('هل تريد إرسال نداء استغاثة للطوارئ؟ سيتم إرسال موقعك الحالي فوراً.')) {
      socketRef.current?.emit('emergency_alert', {
        role: isDriverMode ? 'driver' : 'rider',
        location: pickup, // In a real app, use navigator.geolocation
        timestamp: new Date()
      });
      alert('تم إرسال نداء الاستغاثة. فريق الطوارئ في طريقه إليك.');
    }
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  const handleConfirmBooking = () => {
    if (!destination) {
      alert('يرجى تحديد الوجهة أولاً');
      return;
    }
    
    socketRef.current?.emit('ride_request', {
      pickup,
      destination,
      rideType: selectedRide
    });
  };

  const handleDriverAccept = (requestId: string) => {
    const ride = availableRides.find(r => r.id === requestId);
    if (ride) {
      setActiveDriverTrip(ride);
      setDriverTripStatus('going_to_pickup');
      setAvailableRides([]);
    }
    socketRef.current?.emit('accept_ride', { requestId });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bookingStatus === 'found' && acceptTimer > 0) {
      interval = setInterval(() => {
        setAcceptTimer(prev => prev - 1);
      }, 1000);
    } else if (bookingStatus === 'found' && acceptTimer === 0) {
      setBookingStatus('tracking');
    }
    return () => clearInterval(interval);
  }, [bookingStatus, acceptTimer]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;

    if (bookingStatus === 'tracking' && tripProgress < 100) {
      // Eco mode: update map less frequently to save battery
      const updateRate = isEcoMode ? 1000 : 200;
      const progressStep = isEcoMode ? 2.5 : 0.5;

      progressInterval = setInterval(() => {
        setTripProgress(prev => Math.min(prev + progressStep, 100));
      }, updateRate);

      timeInterval = setInterval(() => {
        setTripTime(prev => prev + 1);
        setTripCost(prev => prev + 0.35); // Add 0.35 EGP per second for simulation
      }, 1000);
    } else if (tripProgress >= 100 && bookingStatus === 'tracking') {
      setBookingStatus('completed');
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [bookingStatus, tripProgress, isEcoMode]);

  const handleCancel = () => {
    setBookingStatus('idle');
    setAcceptTimer(5);
    setTripProgress(0);
    setTripTime(0);
    setTripCost(15.00);
    setRating(0);
    setSelectedTags([]);
    setComment('');
    setIsRatingSubmitted(false);
    setAvailableRides([]);
  };

  return (
    <div className="h-screen flex flex-col bg-white text-slate-900 font-sans overflow-hidden">
      {/* Driver Simulation Toggle */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex bg-slate-100 p-1 rounded-full shadow-lg border border-white">
        <button 
          onClick={() => { setIsDriverMode(false); handleCancel(); }}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${!isDriverMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}
        >
          راكب
        </button>
        <button 
          onClick={() => { setIsDriverMode(true); handleCancel(); }}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${isDriverMode ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'}`}
        >
          سائق
        </button>
      </div>

      {/* Driver Simulation View */}
      <AnimatePresence>
        {isDriverMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-50 z-[90] flex flex-col p-6 pt-24"
          >
            {activeDriverTrip && (
              <DriverTripView 
                trip={activeDriverTrip}
                status={driverTripStatus}
                socket={socketRef.current}
                onStatusChange={(status) => {
                  setDriverTripStatus(status);
                  if (status === 'completed') {
                    setDailyRides(prev => prev + 1);
                    setDailyEarnings(prev => prev + parseFloat(activeDriverTrip.price));
                    setWeeklyEarnings(prev => prev + parseFloat(activeDriverTrip.price));
                  }
                }}
                onCancel={() => {
                  setActiveDriverTrip(null);
                  setDriverTripStatus('idle');
                }}
              />
            )}

            {driverRegStatus === 'approved' ? (
              <div className="flex-1 flex flex-col">
                {/* New Request Overlay (Uber Driver Style) */}
                <AnimatePresence>
                  {isWorking && availableRides.length > 0 && (
                    <DriverRequestOverlay 
                      key={availableRides[0].id}
                      ride={{
                        ...availableRides[0],
                        price: '45.00', // Demo price
                        distance: '1.2 كم', // Demo distance
                        riderName: 'أحمد محمد',
                        riderRating: 4.9
                      }}
                      onAccept={handleDriverAccept}
                      onDecline={(id) => setAvailableRides(prev => prev.filter(r => r.id !== id))}
                    />
                  )}
                </AnimatePresence>

                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">لوحة تحكم الكابتن</h2>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isWorking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className="text-[10px] font-bold text-slate-500">{isWorking ? 'متصل الآن' : 'غير متصل'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleEmergency}
                      className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-200 transition-colors"
                    >
                      <ShieldAlert className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setIsWorking(!isWorking)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                        isWorking 
                        ? 'bg-rose-500 text-white shadow-rose-500/20' 
                        : 'bg-emerald-500 text-white shadow-emerald-500/20'
                      }`}
                    >
                      <Power className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <Activity className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">طلبات اليوم</p>
                    <p className="text-lg font-black text-slate-900">{dailyRides}</p>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">أرباح اليوم</p>
                    <p className="text-lg font-black text-slate-900">{dailyEarnings.toFixed(0)} <span className="text-[10px]">ج.م</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">أرباح الأسبوع</p>
                    <p className="text-lg font-black text-slate-900">{weeklyEarnings.toFixed(0)} <span className="text-[10px]">ج.م</span></p>
                  </div>
                </div>

                {/* Main View Area */}
                <div className="flex-1 flex flex-col">
                  {!isWorking ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <Power className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900">أنت غير متصل</h3>
                        <p className="text-xs text-slate-500 font-bold max-w-[200px]">اضغط على زر التشغيل بالأعلى لبدء استقبال الطلبات</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-4 overflow-y-auto">
                      {availableRides.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                          <div className="relative mb-6">
                            <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Navigation className="w-8 h-8 text-emerald-500 animate-pulse" />
                            </div>
                          </div>
                          <p className="font-black text-slate-900">جاري البحث عن ركاب...</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">تأكد من بقائك في منطقة نشطة لزيادة الطلبات</p>
                        </div>
                      ) : (
                        availableRides.map((ride) => (
                          <motion.div 
                            key={ride.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-[32px] shadow-xl border border-emerald-100 space-y-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">طلب جديد</span>
                                <h3 className="text-lg font-black text-slate-900">رحلة إلى {ride.destination}</h3>
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] text-slate-400 font-bold">المسافة</p>
                                <p className="text-sm font-black text-emerald-600">1.2 كم</p>
                              </div>
                            </div>

                            <div className="space-y-3 py-2">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <p className="text-xs font-bold text-slate-600">{ride.pickup}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-slate-900 rounded-full" />
                                <p className="text-xs font-bold text-slate-900">{ride.destination}</p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDriverAccept(ride.id)}
                              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                            >
                              قبول الرحلة الآن
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : driverRegStatus === 'pending' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center animate-pulse">
                  <Clock className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">طلبك قيد المراجعة</h3>
                  <p className="text-slate-500 text-sm max-w-[280px] mx-auto">
                    شكراً لانضمامك إلينا! يقوم فريق الإدارة حالياً بمراجعة مستنداتك. سيتم تفعيل حسابك خلال 24 ساعة.
                  </p>
                </div>
                <button 
                  onClick={() => setIsDriverMode(false)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm"
                >
                  العودة للرئيسية
                </button>
                <button 
                  onClick={() => setDriverRegStatus('approved')}
                  className="text-[10px] text-slate-300 font-bold hover:text-emerald-500 transition-colors"
                >
                  (تجريبي: موافقة فورية)
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Registration Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">انضم ككابتن</h2>
                    <p className="text-xs text-slate-500 font-bold">أكمل الخطوات لتفعيل حسابك</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(s => (
                      <div 
                        key={s} 
                        className={`w-8 h-1.5 rounded-full transition-all ${driverRegStep >= s ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  {driverRegStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <div className="w-32 h-32 bg-slate-100 rounded-[40px] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            {driverRegData.photo ? (
                              <img src={driverRegData.photo} className="w-full h-full object-cover" />
                            ) : (
                              <Camera className="w-12 h-12 text-slate-300" />
                            )}
                          </div>
                          <button 
                            onClick={() => setDriverRegData(prev => ({ ...prev, photo: 'https://picsum.photos/seed/driver_selfie/400/400' }))}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-slate-900">ارفع صورتك الشخصية</p>
                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">يجب أن تكون الصورة واضحة وبدون نظارات شمسية</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-bold">رقم الهاتف</p>
                            <input 
                              type="tel" 
                              placeholder="01xxxxxxxxx"
                              value={driverRegData.phone}
                              onChange={(e) => setDriverRegData(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full text-sm font-bold bg-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {driverRegStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-900">المستندات المطلوبة</p>
                        
                        <button 
                          onClick={() => setDriverRegData(prev => ({ ...prev, license: 'uploaded' }))}
                          className={`w-full p-6 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
                            driverRegData.license ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {driverRegData.license ? <CheckCircle2 className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                          <div className="text-center">
                            <p className="text-sm font-bold">رخصة القيادة</p>
                            <p className="text-[10px] opacity-60">صورة واضحة للوجهين</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => setDriverRegData(prev => ({ ...prev, vehicleReg: 'uploaded' }))}
                          className={`w-full p-6 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${
                            driverRegData.vehicleReg ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {driverRegData.vehicleReg ? <CheckCircle2 className="w-8 h-8" /> : <Car className="w-8 h-8" />}
                          <div className="text-center">
                            <p className="text-sm font-bold">استمارة المركبة</p>
                            <p className="text-[10px] opacity-60">رخصة تسيير المركبة سارية</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {driverRegStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8 text-center"
                    >
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900">التحقق من الرقم</h3>
                        <p className="text-xs text-slate-500">أدخل الرمز المكون من 4 أرقام المرسل إلى {driverRegData.phone}</p>
                      </div>
                      
                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-14 h-16 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center text-xl font-black text-slate-900 shadow-sm">
                            {driverRegData.otp[i-1] || ''}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setDriverRegData(prev => ({ ...prev, otp: '1234' }))}
                        className="text-emerald-600 text-xs font-bold underline"
                      >
                        إرسال الرمز مرة أخرى
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-6 space-y-3">
                  <button 
                    onClick={() => {
                      if (driverRegStep === 1) {
                        if (!driverRegData.photo || !driverRegData.phone) return alert('يرجى إكمال البيانات');
                        setDriverRegStep(2);
                      } else if (driverRegStep === 2) {
                        if (!driverRegData.license || !driverRegData.vehicleReg) return alert('يرجى رفع المستندات');
                        setDriverRegStep(3);
                      } else if (driverRegStep === 3) {
                        if (driverRegData.otp.length < 4) return setDriverRegData(prev => ({ ...prev, otp: '1234' }));
                        setDriverRegStatus('pending');
                      }
                    }}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
                  >
                    {driverRegStep === 3 ? 'تأكيد وتفعيل' : 'المتابعة'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  {driverRegStep > 1 && (
                    <button 
                      onClick={() => setDriverRegStep(prev => prev - 1)}
                      className="w-full py-4 text-slate-400 font-bold text-sm"
                    >
                      الرجوع للخلف
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AppBar (Hidden during tracking) */}
      <AnimatePresence>
        {bookingStatus !== 'tracking' && (
          <motion.header 
            initial={{ y: 0 }}
            exit={{ y: -100 }}
            className="px-6 pt-12 pb-4 flex justify-between items-center bg-white z-50"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={bookingStatus === 'idle' ? onBack : handleCancel}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-slate-900" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">
                {bookingStatus === 'searching' ? 'جاري البحث...' : 'كفراوي جو'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleEmergency}
                className="p-2 bg-rose-50 rounded-full text-rose-600"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
              <button 
                onClick={onShowHistory}
                className="p-2 bg-slate-50 rounded-full text-slate-600"
              >
                <History className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-50 rounded-full text-slate-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/user123/100/100" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Live Map Section */}
      <div className={`relative bg-slate-100 overflow-hidden transition-all duration-700 ${
        bookingStatus === 'idle' ? 'h-[40%] rounded-t-[32px]' : 'h-full'
      }`}>
        {/* Minimal Map Background */}
        <div className="absolute inset-0 bg-[#f8f9fa]">
          {/* Grid pattern for minimal map feel */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          {/* Simulated roads */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 150 Q 200 100 400 250 T 800 150" fill="none" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            <path d="M200 0 L 250 800" fill="none" stroke="#94a3b8" strokeWidth="8" />
            <path d="M0 400 Q 300 450 500 300 T 800 500" fill="none" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
          </svg>
        </div>
        
        {/* Route Line (Simulated with SVG) */}
        {bookingStatus === 'tracking' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path
              d="M 100 600 Q 200 400 400 300 T 700 100"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="opacity-40"
            />
            <motion.path
              d="M 100 600 Q 200 400 400 300 T 700 100"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: tripProgress / 100 }}
              transition={{ duration: 0.5 }}
            />
            {/* Moving Car on Path */}
            <motion.g
              offset="0"
              style={{
                offsetPath: "path('M 100 600 Q 200 400 400 300 T 700 100')",
                offsetDistance: `${tripProgress}%`,
                offsetRotate: "auto"
              }}
              className="drop-shadow-lg"
            >
              <circle cx="16" cy="16" r="24" className="fill-blue-500/20 animate-ping" />
              <Car className="w-8 h-8 text-slate-900 fill-white relative z-10" />
            </motion.g>
          </svg>
        )}

        {/* User Location Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10 relative"></div>
            <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -inset-4 w-12 h-12 bg-blue-500/20 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Searching Animation Overlay */}
        <AnimatePresence>
          {bookingStatus === 'searching' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
            >
              <div className="relative flex items-center justify-center">
                {/* Radar Rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 3, opacity: [0, 0.3, 0] }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      delay: ring * 0.8,
                      ease: "easeOut" 
                    }}
                    className="absolute w-40 h-40 border-[3px] border-slate-900 rounded-full"
                  />
                ))}

                {/* Floating Cars/Pins */}
                {[
                  { delay: 0, x: -80, y: -60, rotation: 15 },
                  { delay: 1, x: 90, y: -40, rotation: -20 },
                  { delay: 2, x: -40, y: 100, rotation: 45 },
                  { delay: 0.5, x: 80, y: 80, rotation: -10 }
                ].map((item, i) => (
                  <motion.div
                    key={`pin-${i}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0.5, 1, 0.5],
                      x: item.x,
                      y: item.y,
                      rotate: item.rotation
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: item.delay,
                      ease: "easeInOut"
                    }}
                    className="absolute z-0"
                  >
                    <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100">
                      <Car className="w-5 h-5 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
                
                {/* Center Pulse */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10 bg-slate-900 p-6 rounded-full shadow-[0_0_40px_rgba(15,23,42,0.4)]"
                >
                  <div className="relative">
                    <Search className="w-10 h-10 text-white" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 border-t-2 border-white/50 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-28 text-center space-y-3">
                <motion.h3 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-black text-slate-900"
                >
                  جارٍ البحث عن كابتن...
                </motion.h3>
                <p className="text-slate-500 text-sm font-bold bg-slate-100 px-4 py-2 rounded-full inline-block">
                  نحن نختار لك أفضل سائق قريب منك
                </p>
              </div>

              {/* Cancel Search Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onClick={handleCancel}
                className="absolute bottom-12 px-8 py-3 bg-white border border-slate-200 rounded-full text-rose-500 font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors"
              >
                إلغاء البحث
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracking Top Card */}
        <AnimatePresence>
          {bookingStatus === 'tracking' && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-12 inset-x-6 z-50"
            >
              <motion.div 
                layout
                onClick={() => setIsDriverCardExpanded(!isDriverCardExpanded)}
                className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-4 cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={MOCK_DRIVER.image} className="w-12 h-12 rounded-full border-2 border-slate-200" />
                    <div>
                      <h4 className="font-bold text-sm">{MOCK_DRIVER.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{MOCK_DRIVER.car} • {MOCK_DRIVER.plate}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold">الوصول المتوقع</p>
                    <p className="text-sm font-black text-blue-600">{Math.max(1, Math.round(12 * (1 - tripProgress / 100)))} دقيقة</p>
                  </div>
                </div>

                {/* Trip Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{pickup.split('-')[0]}</span>
                    <span>{Math.round(tripProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${tripProgress}%` }}
                      className="h-full bg-slate-900"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isDriverCardExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-3 gap-2"
                    >
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 font-bold">التقييم</p>
                        <p className="text-xs font-bold flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {MOCK_DRIVER.rating}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 font-bold">الرحلات</p>
                        <p className="text-xs font-bold">{MOCK_DRIVER.trips}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 font-bold">المسافة</p>
                        <p className="text-xs font-bold">{MOCK_DRIVER.distance}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={handleEmergency}
                          className="flex-1 py-3 bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          طوارئ
                        </button>
                        <button className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                          <Share2 className="w-4 h-4" />
                          مشاركة
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Overlay Controls */}
        <div className="absolute bottom-32 right-6 flex flex-col gap-2 z-40">
          <button className="p-3 bg-white rounded-2xl shadow-lg text-slate-900">
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Eco Mode Indicator */}
        <AnimatePresence>
          {bookingStatus === 'tracking' && isEcoMode && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-32 right-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 z-40"
            >
              <Zap className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600">توفير البطارية نشط</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency SOS Button */}
        <AnimatePresence>
          {bookingStatus === 'tracking' && (
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEmergency}
              className="absolute bottom-32 left-6 w-14 h-14 bg-rose-600 text-white rounded-full shadow-xl shadow-rose-600/30 flex items-center justify-center z-40 border-2 border-white"
            >
              <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-50"></div>
              <span className="font-black text-sm">SOS</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Interface / Action Sheet */}
      <motion.div 
        layout
        className={`bg-white px-6 pt-6 pb-8 overflow-y-auto rounded-t-[32px] -mt-8 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] ${
          bookingStatus === 'tracking' ? 'h-auto' : 'flex-1'
        }`}
      >
        <AnimatePresence mode="wait">
          {bookingStatus === 'idle' ? (
            <motion.div 
              key="idle-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Pickup & Destination Inputs */}
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="موقع الاستلام" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-10 pl-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold">
                    موقعي الحالي
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-slate-900"></div>
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="إلى أين؟" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-10 pl-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-slate-900"
                  />
                </div>
                
                {/* Smart Suggestions */}
                {!destination && (
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mt-2">
                    {['المجاورة الأولى', 'الموقف', 'نادي الكفراوي', 'السوق'].map((place) => (
                      <button 
                        key={place}
                        onClick={() => setDestination(place)}
                        className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {place}
                      </button>
                    ))}
                  </div>
                )}

                {destination && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-[10px] text-slate-400 font-bold px-2"
                  >
                    <Clock className="w-3 h-3" /> 12 دقيقة • 4.5 كم
                  </motion.div>
                )}
              </div>

              {/* Ride Type Selection */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">اختر نوع الرحلة</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {RIDE_TYPES.map((type) => (
                    <motion.button
                      key={type.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRide(type.id as RideType)}
                      className={`min-w-[110px] p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedRide === type.id 
                        ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-600/10' 
                        : 'border-slate-50 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <div className={`${selectedRide === type.id ? 'text-blue-600' : 'text-slate-400'}`}>
                        {type.icon}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-900">{type.name}</p>
                        <p className="text-[10px] font-medium opacity-60">{type.eta}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">{type.price} ج.م</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Summary & Details */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">السعر التقديري</span>
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Zap className="w-3 h-3 fill-current" /> طلب مرتفع
                    </div>
                  </div>
                  <span className="text-xl font-black text-slate-900">
                    {RIDE_TYPES.find(r => r.id === selectedRide)?.price} ج.م
                  </span>
                </div>
              </div>

              {/* Payment Selector */}
              <button 
                onClick={() => setIsPaymentSheetOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    {PAYMENT_METHODS.find(p => p.id === selectedPayment)?.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold">طريقة الدفع</p>
                    <p className="text-sm font-bold">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</p>
                  </div>
                </div>
                <ChevronUp className="w-5 h-5 text-slate-300" />
              </button>

              {/* CTA Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmBooking}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
              >
                طلب {RIDE_TYPES.find(r => r.id === selectedRide)?.name}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ) : bookingStatus === 'found' ? (
            <motion.div 
              key="driver-card"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-600">تم العثور على سائق</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">الوصول خلال</p>
                  <p className="text-sm font-black text-blue-600">2 دقيقة</p>
                </div>
              </div>

              {/* Driver Info Header */}
              <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={MOCK_DRIVER.image} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1 rounded-lg border-2 border-white shadow-sm">
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{MOCK_DRIVER.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-amber-600 font-black text-sm">{MOCK_DRIVER.rating}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-slate-500 text-xs font-bold">{MOCK_DRIVER.trips} رحلة</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <button className="flex items-center justify-center gap-2 p-3 bg-white text-slate-900 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-bold">
                    <Phone className="w-4 h-4" />
                    اتصال
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 bg-white text-slate-900 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-bold">
                    <MessageCircle className="w-4 h-4" />
                    مراسلة
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-2xl shadow-sm hover:bg-slate-800 transition-colors text-xs font-bold">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </div>

              {/* Car Details Card */}
              <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">السيارة</p>
                    <h4 className="text-lg font-black">{MOCK_DRIVER.car}</h4>
                    <div className="mt-2 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                      <span className="text-sm font-black tracking-widest">{MOCK_DRIVER.plate}</span>
                    </div>
                  </div>
                  <Car className="w-16 h-16 text-white/10 absolute -right-4 -bottom-4 rotate-12" />
                </div>
              </div>

              {/* Accept Timer / Status */}
              <div className="space-y-3 px-1">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <span>قبول تلقائي خلال {acceptTimer} ثوانٍ</span>
                  <span>{Math.round((acceptTimer / 5) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(acceptTimer / 5) * 100}%` }}
                    className="h-full bg-slate-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => setBookingStatus('tracking')}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  تأكيد السائق
                </button>
              </div>
            </motion.div>
          ) : bookingStatus === 'tracking' ? (
            <motion.div 
              key="tracking-sheet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">رحلتك جارية الآن</h3>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></div>
                  مباشر
                </div>
              </div>

              {/* Live Dashboard */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">زمن الرحلة</p>
                  <p className="text-lg font-black text-slate-900">
                    {Math.floor(tripTime / 60).toString().padStart(2, '0')}:{(tripTime % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">التكلفة الحالية</p>
                  <p className="text-lg font-black text-emerald-600">{tripCost.toFixed(2)} ج.م</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">المسافة المتبقية</p>
                  <p className="text-lg font-black text-slate-900">{((100 - tripProgress) * 0.05).toFixed(1)} كم</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm border border-slate-200 transition-colors hover:bg-slate-200">
                  <Phone className="w-5 h-5" />
                  اتصال
                </button>
                <button className="flex items-center justify-center gap-2 p-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm border border-slate-200 transition-colors hover:bg-slate-200">
                  <MessageCircle className="w-5 h-5" />
                  مراسلة
                </button>
                <button className="col-span-2 flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-bold text-sm transition-colors hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                  <Share2 className="w-5 h-5" />
                  مشاركة الرحلة مع العائلة
                </button>
              </div>
            </motion.div>
          ) : bookingStatus === 'completed' ? (
            <motion.div 
              key="completed-sheet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 pb-4"
            >
              {!isRatingSubmitted ? (
                <div className="space-y-6">
                  {/* Top: Thank you & Summary */}
                  <div className="text-center space-y-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-slate-900">شكراً لك!</h3>
                    <p className="text-slate-500 text-sm">نأمل أن تكون استمتعت برحلتك مع كفراوي جو</p>
                  </div>

                  {/* Trip Summary Card */}
                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">المسافة</p>
                      <p className="text-sm font-black text-slate-900">{((100 - tripProgress) * 0.05).toFixed(1)} كم</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الوقت</p>
                      <p className="text-sm font-black text-slate-900">{Math.floor(tripTime / 60)} دقيقة</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">التكلفة</p>
                      <p className="text-sm font-black text-slate-900">{tripCost.toFixed(2)} ج.م</p>
                    </div>
                  </div>

                  {/* Center: Star Rating */}
                  <div className="space-y-4">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">كيف كانت تجربتك؟</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRatingSelect(star)}
                          className="p-1"
                        >
                          <Star 
                            className={`w-10 h-10 transition-colors ${
                              rating >= star 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-slate-200'
                            }`} 
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Optional: Feedback Tags */}
                  <AnimatePresence>
                    {rating > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="flex flex-wrap justify-center gap-2">
                          {FEEDBACK_TAGS.map((tag) => (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(tag.id)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                selectedTags.includes(tag.id)
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                              }`}
                            >
                              {tag.label}
                            </button>
                          ))}
                        </div>

                        {/* Comment Area */}
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="أضف تعليقاً إضافياً (اختياري)..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all min-h-[100px] resize-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button & Report */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => alert('تم فتح نافذة البلاغ')}
                      className="p-5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors flex items-center justify-center"
                      title="الإبلاغ عن مشكلة"
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={rating === 0}
                      onClick={handleSubmitRating}
                      className={`flex-1 py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${
                        rating > 0 
                        ? 'bg-slate-900 text-white shadow-slate-900/20' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      إرسال التقييم
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">تم استلام تقييمك!</h3>
                    <p className="text-slate-500 mt-2">شكراً لمساعدتنا في تحسين خدماتنا</p>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => alert('تم حفظ الرحلة في سجلك بنجاح')}
                      className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                      <History className="w-5 h-5" />
                      عرض سجل الرحلات
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20"
                    >
                      العودة للرئيسية
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">جاري البحث عن سائق...</h3>
              <p className="text-sm text-slate-500 mt-2">يرجى الانتظار قليلاً، نحن نبحث عن أفضل خيار لك</p>
              <button 
                onClick={handleCancel}
                className="mt-8 text-rose-500 font-bold text-sm underline"
              >
                إلغاء البحث
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Payment Bottom Sheet */}
      <AnimatePresence>
        {isPaymentSheetOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentSheetOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] p-8 z-[70] shadow-2xl"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-bold mb-6">اختر طريقة الدفع</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id as PaymentMethod);
                      setIsPaymentSheetOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      selectedPayment === method.id 
                      ? 'border-slate-900 bg-slate-50' 
                      : 'border-slate-50 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${selectedPayment === method.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}>
                        {method.icon}
                      </div>
                      <span className="font-bold">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && (
                      <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
