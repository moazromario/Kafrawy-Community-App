import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Lazy load modules
const HomeFeed = lazy(() => import('./modules/community/HomeFeed'));
const ServicesModule = lazy(() => import('./components/ServicesModule'));
const MarketplaceModule = lazy(() => import('./modules/marketplace/MarketplaceModule'));

// Placeholder components for other modules
const CommunityModule = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-black mb-4">المجتمع</h2>
    <p className="text-[var(--muted)]">قريباً: تواصل مع جيرانك في الكفراوي</p>
  </div>
);

const JobsModule = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-black mb-4">وظائف الكفراوي</h2>
    <p className="text-[var(--muted)]">قريباً: ابحث عن وظيفتك القادمة</p>
  </div>
);

const MedicalModule = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-black mb-4">المركز الطبي</h2>
    <p className="text-[var(--muted)]">قريباً: احجز موعدك مع أفضل الأطباء</p>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <HomeFeedWrapper />
          } />
          <Route path="/community" element={<CommunityModule />} />
            <Route path="/marketplace/*" element={<MarketplaceModule />} />
          <Route path="/jobs" element={<JobsModule />} />
          <Route path="/services/*" element={<ServicesModule />} />
          <Route path="/medical" element={<MedicalModule />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

// Wrapper to use useNavigate hook
const HomeFeedWrapper = () => {
  return <HomeFeed />;
};

export default App;
