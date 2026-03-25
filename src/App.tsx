import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Lazy load modules
const HomeFeed = lazy(() => import('./modules/community/HomeFeed'));
const ServicesModule = lazy(() => import('./components/ServicesModule'));
const MarketplaceModule = lazy(() => import('./modules/marketplace/MarketplaceModule'));
const IslamicModule = lazy(() => import('./modules/islamic/IslamicModule'));
const MedicalModule = lazy(() => import('./modules/medical/MedicalModule'));
const KafrawyGoModule = lazy(() => import('./modules/transport/KafrawyGoModule'));
const CommunityModule = lazy(() => import('./modules/community/CommunityModule'));
const JobsModule = lazy(() => import('./modules/jobs/JobsModule'));

// Placeholder components for other modules
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
          <Route path="/medical/*" element={<MedicalModule />} />
          <Route path="/islamic/*" element={<IslamicModule />} />
          <Route path="/go/*" element={<KafrawyGoModule />} />
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
