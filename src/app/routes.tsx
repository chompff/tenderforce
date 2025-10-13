import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useStealthMode } from "@/lib/utils";

// Helper component for redirecting with params
const RedirectToEedResults = () => {
  const { code } = useParams();
  return <Navigate to={`/eed-results/${code}`} replace />;
};

// Layout Components
import Layout from "@/components/layout/Layout";
import StealthLayout from "@/components/layout/StealthLayout";

// Tool Pages (Procurement Tools)
import IndexPage from "@/pages/tools/index";
import StappenslagPage from "@/pages/tools/stappenslang";
import SectoraleVerplichtingencheckPage from "@/pages/tools/sectorale-verplichtingencheck";
import GunningsbriefbouwerPage from "@/pages/tools/gunningsbriefbouwer";
import WezenlijkeWijzigingscheckPage from "@/pages/tools/wezenlijke-wijzigingscheck";
import OpdrachtamerPage from "@/pages/tools/opdrachtramer";
import GemengdeOpdrachtKwalificatiePage from "@/pages/tools/gemengde-opdracht-kwalificatie";
import AanbestedingsplichtCheckPage from "@/pages/tools/aanbestedingsplicht-check";
import AanbestedingsplichtCheckResultPage from "@/pages/tools/aanbestedingsplicht-check-result";
import ResultsPage from "@/pages/tools/results";

// Auth Pages (will be added later)
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Dashboard from "@/features/auth/Dashboard";
import EmailVerification from "@/components/auth/EmailVerification";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Tender Dashboard
import TenderDashboardPage from "@/pages/TenderDashboardPage";

// Static Pages
import AboutEEDTool from "@/pages/AboutEEDTool";
import PrijzenPage from "@/features/static/Prijzen";
import Privacybeleid from "@/pages/Privacybeleid";
import AlgemeneVoorwaarden from "@/pages/AlgemeneVoorwaarden";
import Disclaimer from "@/pages/Disclaimer";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  const { isStealthMode } = useStealthMode();

  // In stealth mode, use StealthLayout and restrict routes
  if (isStealthMode) {
    return (
      <Routes>
        {/* Redirect home to EED check */}
        <Route path="/" element={<Navigate to="/eed-check" replace />} />
        
        {/* EED Check routes */}
        <Route path="/eed-check" element={<StealthLayout><SectoraleVerplichtingencheckPage /></StealthLayout>} />
        <Route path="/eed-results/:code" element={<StealthLayout><ResultsPage /></StealthLayout>} />
        
        {/* Legacy compatibility - redirect old URLs to EED versions */}
        <Route path="/tools/sectorale-verplichtingencheck" element={<Navigate to="/eed-check" replace />} />
        <Route path="/tools/results/:code" element={<RedirectToEedResults />} />
        <Route path="/results/:code" element={<RedirectToEedResults />} />
        
        {/* Catch-all redirect to EED check */}
        <Route path="*" element={<Navigate to="/eed-check" replace />} />
      </Routes>
    );
  }

  // Normal mode - full routing
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/tools/sectorale-verplichtingencheck" replace />} />
      
      {/* Procurement Tools */}
      <Route path="/tools/stappenslang" element={<Layout><StappenslagPage /></Layout>} />
      <Route path="/tools/sectorale-verplichtingencheck" element={<Layout><SectoraleVerplichtingencheckPage /></Layout>} />
      <Route path="/tools/gunningsbriefbouwer" element={<Layout><GunningsbriefbouwerPage /></Layout>} />
      <Route path="/tools/wezenlijke-wijzigingscheck" element={<Layout><WezenlijkeWijzigingscheckPage /></Layout>} />
      <Route path="/tools/opdrachtramer" element={<Layout><OpdrachtamerPage /></Layout>} />
      <Route path="/tools/gemengde-opdracht-kwalificatie" element={<Layout><GemengdeOpdrachtKwalificatiePage /></Layout>} />
      <Route path="/tools/aanbestedingsplicht-check" element={<Layout><AanbestedingsplichtCheckPage /></Layout>} />
      <Route path="/tools/aanbestedingsplicht-check/result" element={<Layout><AanbestedingsplichtCheckResultPage /></Layout>} />
      <Route path="/tools/results/:code" element={<Layout><ResultsPage /></Layout>} />
      
      {/* Legacy Routes - Redirects for backward compatibility */}
      <Route path="/results/:code" element={<Layout><ResultsPage /></Layout>} />
      
      {/* EED Check routes (for stealth mode compatibility) */}
      <Route path="/eed-check" element={<Layout><SectoraleVerplichtingencheckPage /></Layout>} />
      <Route path="/eed-results/:code" element={<Layout><ResultsPage /></Layout>} />
      
      {/* Tender Dashboard - Protected Route */}
      <Route path="/tender-dashboard" element={<Layout><ProtectedRoute><TenderDashboardPage /></ProtectedRoute></Layout>} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<EmailVerification />} />
      <Route path="/auth/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      
      {/* Static Pages */}
              <Route path="/about-eed-tool" element={<Layout><AboutEEDTool /></Layout>} />
      <Route path="/prijzen" element={<Layout><PrijzenPage /></Layout>} />
      <Route path="/privacybeleid" element={<Layout><Privacybeleid /></Layout>} />
      <Route path="/algemene-voorwaarden" element={<Layout><AlgemeneVoorwaarden /></Layout>} />
      <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
      <Route path="/support" element={<Layout><Support /></Layout>} />
      
      {/* Blog Routes (Future Implementation) */}
      <Route path="/blog" element={<Layout>Blog Coming Soon</Layout>} />
      <Route path="/blog/:slug" element={<Layout>Blog Post</Layout>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

export default AppRoutes; 