import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Star, 
  Share2, 
  Heart, 
  MessageCircle, 
  Info,
  ChevronLeft
} from 'lucide-react';

interface DetailFeature {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

interface DynamicDetailsProps {
  title: string;
  subtitle?: string;
  image: string;
  rating?: number;
  reviews?: number;
  price?: string;
  description: string;
  features?: DetailFeature[];
  mainActionLabel: string;
  onMainAction: () => void;
  onBack: () => void;
  category?: string;
}

export default function DynamicDetails({
  title,
  subtitle,
  image,
  rating,
  reviews,
  price,
  description,
  features,
  mainActionLabel,
  onMainAction,
  onBack,
  category
}: DynamicDetailsProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">
      {/* Top Image & Header Overlay */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-slate-950" />
        
        <header className="absolute top-0 inset-x-0 p-4 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </header>

        {category && (
          <div className="absolute bottom-6 right-6">
            <span className="px-3 py-1 bg-royal-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="px-6 -mt-4 relative z-10 space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-royal-600 dark:text-royal-400 font-medium">{subtitle}</p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-bold text-amber-700 dark:text-amber-400">{rating}</span>
                </div>
                {reviews !== undefined && (
                  <span className="text-xs text-slate-400">({reviews} تقييم)</span>
                )}
              </div>
            )}
            {price && (
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {price}
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-royal-600 dark:text-royal-400">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{feature.label}</p>
                  {feature.value && <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{feature.value}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-royal-600" /> التفاصيل
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Reviews Preview (Optional) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">آراء المستخدمين</h3>
            <button className="text-xs text-royal-600 font-bold">رؤية الكل</button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl italic text-xs text-slate-500">
            "تجربة ممتازة جداً، التعامل راقي والخدمة سريعة. أنصح الجميع بالتعامل معه."
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400">
            <MessageCircle className="w-6 h-6" />
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMainAction}
            className="flex-1 bg-royal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-royal-600/20 hover:bg-royal-700 transition-colors"
          >
            {mainActionLabel}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
