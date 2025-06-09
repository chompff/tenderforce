import { Routes, Route } from "react-router-dom";

// Layout Components
import Layout from "@/components/layout/Layout";

// Tool Pages (Procurement Tools)
import Index from "@/features/tools/Index";
import Stappenslang from "@/features/tools/Stappenslang";
import SectoraleVerplichtingencheck from "@/features/tools/SectoraleVerplichtingencheck";
import Gunningsbriefbouwer from "@/features/tools/Gunningsbriefbouwer";
import WezenlijkeWijzigingscheck from "@/features/tools/WezenlijkeWijzigingscheck";
import Opdrachtramer from "@/features/tools/Opdrachtramer";
import GemengdeOpdrachtKwalificatie from "@/features/tools/GemengdeOpdrachtKwalificatie";
import AanbestedingsplichtCheck from "@/features/tools/AanbestedingsplichtCheck";
import AanbestedingsplichtCheckResult from "@/features/tools/AanbestedingsplichtCheckResult";
import Results from "@/features/tools/Results";

// Auth Pages (will be added later)
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Dashboard from "@/features/auth/Dashboard";

// Static Pages
import OverTenderforce from "@/pages/OverTenderforce";
import Prijzen from "@/pages/Prijzen";
import Privacybeleid from "@/pages/Privacybeleid";
import AlgemeneVoorwaarden from "@/pages/AlgemeneVoorwaarden";
import Disclaimer from "@/pages/Disclaimer";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Index /></Layout>} />
      
      {/* Procurement Tools */}
      <Route path="/tools/stappenslang" element={<Layout><Stappenslang /></Layout>} />
      <Route path="/tools/sectorale-verplichtingencheck" element={<Layout><SectoraleVerplichtingencheck /></Layout>} />
      <Route path="/tools/gunningsbriefbouwer" element={<Layout><Gunningsbriefbouwer /></Layout>} />
      <Route path="/tools/wezenlijke-wijzigingscheck" element={<Layout><WezenlijkeWijzigingscheck /></Layout>} />
      <Route path="/tools/opdrachtramer" element={<Layout><Opdrachtramer /></Layout>} />
      <Route path="/tools/gemengde-opdracht-kwalificatie" element={<Layout><GemengdeOpdrachtKwalificatie /></Layout>} />
      <Route path="/tools/aanbestedingsplicht-check" element={<Layout><AanbestedingsplichtCheck /></Layout>} />
      <Route path="/tools/aanbestedingsplicht-check/result" element={<Layout><AanbestedingsplichtCheckResult /></Layout>} />
      <Route path="/tools/results/:code" element={<Layout><Results /></Layout>} />
      
      {/* Legacy Routes - Redirects for backward compatibility */}
      <Route path="/results/:code" element={<Layout><Results /></Layout>} />
      
      {/* Auth Routes (Future Implementation) */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/dashboard" element={<Layout><Dashboard /></Layout>} />
      
      {/* Static Pages */}
      <Route path="/over-tenderforce" element={<Layout><OverTenderforce /></Layout>} />
      <Route path="/prijzen" element={<Layout><Prijzen /></Layout>} />
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