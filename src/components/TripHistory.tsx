import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Banknote, 
  ChevronLeft, 
  Download, 
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface Trip {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  price: string;
  duration: string;
  status: 'completed' | 'cancelled';
}

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    date: '23 مارس 2026 • 10:30 ص',
    pickup: 'شارع الجمهورية، كفر الشيخ',
    destination: 'جامعة كفر الشيخ',
    price: '45.00 ج.م',
    duration: '12 دقيقة',
    status: 'completed',
  },
  {
    id: 't2',
    date: '22 مارس 2026 • 08:15 م',
    pickup: 'مستشفى كفر الشيخ العام',
    destination: 'سيدي مبارك',
    price: '35.00 ج.م',
    duration: '8 دقيقة',
    status: 'completed',
  },
  {
    id: 't3',
    date: '21 مارس 2026 • 02:45 م',
    pickup: 'محطة القطار',
    destination: 'حي القنطرة',
    price: '0.00 ج.م',
    duration: '0 دقيقة',
    status: 'cancelled',
  },
  {
    id: 't4',
    date: '20 مارس 2026 • 11:00 ص',
    pickup: 'دوران الـ 47',
    destination: 'شارع المصنع',
    price: '55.00 ج.م',
    duration: '15 دقيقة',
    status: 'completed',
  },
  {
    id: 't5',
    date: '19 مارس 2026 • 09:20 م',
    pickup: 'شارع النبوي المهندس',
    destination: 'ميدان الزهور',
    price: '40.00 ج.م',
    duration: '10 دقيقة',
    status: 'completed',
  },
];

export default function TripHistory({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = MOCK_TRIPS.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch = trip.pickup.includes(searchQuery) || trip.destination.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-royal-900" />
          </button>
          <h1 className="text-2xl font-black text-royal-900">سجل الرحلات</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث عن طريق الموقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-medium focus:ring-2 focus:ring-royal-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'completed', label: 'المكتملة' },
            { id: 'cancelled', label: 'الملغاة' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === btn.id 
                ? 'bg-royal-900 text-white shadow-lg shadow-royal-900/20' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </header>

      {/* Trip List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4"
              >
                {/* Date & Status */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-bold">{trip.date}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    trip.status === 'completed' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                  }`}>
                    {trip.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        مكتملة
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        ملغاة
                      </>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="relative pl-4">
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-slate-100"></div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                      <p className="text-sm font-bold text-slate-600 line-clamp-1">{trip.pickup}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-sm bg-royal-900 mt-1.5 shrink-0"></div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{trip.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">السعر</p>
                      <p className="text-xs font-black text-royal-900">{trip.price}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">المدة</p>
                      <p className="text-xs font-black text-royal-900">{trip.duration}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-royal-50 text-royal-600 rounded-xl font-bold text-xs hover:bg-royal-100 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      إعادة حجز
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">لا توجد رحلات</h3>
              <p className="text-sm text-slate-500 mt-2">لم نجد أي رحلات تطابق بحثك الحالي</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
