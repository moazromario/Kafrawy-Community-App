import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CommunityModule from './modules/community/CommunityModule';

// Lazy load modules
const HomeFeed = lazy(() => import('./modules/community/HomeFeed'));
const ServicesModule = lazy(() => import('./components/ServicesModule'));
const KafrawyMarket = lazy(() => import('./components/KafrawyMarket'));
const IslamicModule = lazy(() => import('./modules/islamic/IslamicModule'));
const MedicalModule = lazy(() => import('./modules/medical/MedicalModule'));
const KafrawyGoModule = lazy(() => import('./modules/transport/KafrawyGoModule'));
const JobsModule = lazy(() => import('./modules/jobs/JobsModule'));

// Placeholder components for other modules
const LoadingScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <HomeFeedWrapper />
          } />
          <Route path="/community" element={<CommunityModule />} />
          <Route path="/marketplace/*" element={<KafrawyMarket onBack={() => navigate('/')} />} />
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
