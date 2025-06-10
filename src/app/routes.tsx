import { Routes, Route } from "react-router-dom";

// Layout Components
import Layout from "@/components/layout/Layout";

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

// Static Pages
import OverTenderforce from "@/pages/OverTenderforce";
import PrijzenPage from "@/features/static/Prijzen";
import Privacybeleid from "@/pages/Privacybeleid";
import AlgemeneVoorwaarden from "@/pages/AlgemeneVoorwaarden";
import Disclaimer from "@/pages/Disclaimer";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><IndexPage /></Layout>} />
      
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
      
      {/* Auth Routes (Future Implementation) */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/dashboard" element={<Layout><Dashboard /></Layout>} />
      
      {/* Static Pages */}
      <Route path="/over-tenderforce" element={<Layout><OverTenderforce /></Layout>} />
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