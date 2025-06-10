import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, ChevronDown, ChevronUp, Lock, Star, CheckCircle, Building, Calculator, Copy, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getCpvName } from '../../utils/cpvLookup';
import Confetti from '../../components/Confetti';

interface ExpandableInfoProps {
  title: string;
  level: string;
  description: string | React.ReactNode;
  expandedInfo: string | React.ReactNode;
}

// Paywall overlay component
const PaywallOverlay: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => (
  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-sm rounded-md flex flex-col justify-center items-center p-6 z-10">
    <div className="text-center space-y-4 max-w-sm">
      <div className="flex justify-center">
        <div className="p-3 bg-blue-100 rounded-full">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Ontgrendel volledige informatie
      </h3>
      <p className="text-sm text-gray-600">
        Krijg toegang tot gedetailleerde uitleg, praktische voorbeelden en compliance-checklists.
      </p>
      <button
        onClick={onUpgrade}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Start je proefperiode
      </button>
      <p className="text-xs text-gray-500">
        Vanaf €29/maand • 14 dagen gratis proberen
      </p>
    </div>
  </div>
);

const ExpandableInfo: React.FC<ExpandableInfoProps> = ({ title, level, description, expandedInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const getLevelBadge = (level: string) => {
    const styles = {
      basis: 'bg-green-100 text-green-800',
      gemiddeld: 'bg-yellow-100 text-yellow-800', 
      streng: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded text-xs font-medium ${styles[level as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleUpgrade = () => {
    navigate('/prijzen');
  };

  const handleCopy = async () => {
    if (contentRef.current) {
      try {
        const text = contentRef.current.innerText;
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className={getLevelBadge(level)}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-2">
          {description}
        </CardDescription>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 transition-colors">
              {isOpen ? 'Verberg voorbeeld' : 'Toon voorbeeld'}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="relative text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors group"
                title={isCopied ? "Gekopieerd!" : "Kopieer naar klembord"}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
              <div ref={contentRef} className="pr-8">
                {expandedInfo}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

const Results: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState('alle-niveaus');
  const [cpvName, setCpvName] = useState('Laden...');
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // Extract URL parameters
  const organizationType = searchParams.get('org') || '';
  const estimationAnswer = searchParams.get('estimation') || '';

  // Mock data - replace with real data from your Google Sheet
  const criteriaCount = 48;

  // Add fade-in animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        opacity: 0;
        animation: fade-in forwards;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Auto-open first tab after animations complete
  useEffect(() => {
    // Wait for all animations to complete (700ms + 1200ms + 500ms buffer)
    const timer = setTimeout(() => {
      setOpenAccordions(['bepaling-scope']);
    }, 2400);
    
    return () => clearTimeout(timer);
  }, []);

  // Store current path in sessionStorage before navigating to results
  useEffect(() => {
    const lastPath = sessionStorage.getItem('lastPath');
    if (!lastPath) {
      // If no last path exists, try to determine it from the current URL
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/results/')) {
        // If we came from sectorale-verplichtingencheck
        sessionStorage.setItem('lastPath', `/tools/sectorale-verplichtingencheck?code=${code}&org=${organizationType}&step=3`);
      } else if (currentPath.startsWith('/tools/results/')) {
        // If we came from aanbestedingsplicht-check
        sessionStorage.setItem('lastPath', `/tools/aanbestedingsplicht-check?code=${code}&org=${organizationType}&step=3`);
      } else {
        // Fallback to start page
        sessionStorage.setItem('lastPath', '/start');
      }
    }
  }, [code, organizationType]);

  // Helper functions
  const getOrganizationName = (type: string) => {
    const names: Record<string, string> = {
      'rijksoverheid': 'Rijksoverheid',
      'decentraal': 'Decentraal',
      'publiekrechterlijk': 'Publiekrechterlijk'
    };
    return names[type] || type;
  };

  const getEstimationText = (answer: string) => {
    const texts: Record<string, string> = {
      'yes': 'Ja, boven drempelwaarde',
      'no': 'Nee, onder drempelwaarde',
      'help': 'Hulp nodig met raming'
    };
    return texts[answer] || answer;
  };

  const getThresholdAmount = (orgType: string, typeAanbesteding: string): string => {
    const thresholds: Record<string, Record<string, string>> = {
      'rijksoverheid': {
        'Werken': '€5.538.000',
        'Leveringen': '€143.000', 
        'Diensten': '€143.000',
        'Concessie': '€5.538.000'
      },
      'decentraal': {
        'Werken': '€5.538.000',
        'Leveringen': '€221.000',
        'Diensten': '€221.000', 
        'Concessie': '€5.538.000'
      },
      'publiekrechterlijk': {
        'Werken': '€5.538.000',
        'Leveringen': '€221.000',
        'Diensten': '€221.000',
        'Concessie': '€5.538.000'
      }
    };
    
    return thresholds[orgType]?.[typeAanbesteding] || '€221.000';
  };

  // Fetch CPV name when component mounts
  useEffect(() => {
    if (code) {
      getCpvName(code).then(setCpvName);
    }
  }, [code]);

  const handleUpgrade = () => {
    navigate('/prijzen');
  };

  const handleBackNavigation = () => {
    const lastPath = sessionStorage.getItem('lastPath');
    if (lastPath) {
      navigate(lastPath);
    } else {
      // If no last path exists, try to determine it from the current URL
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/results/')) {
        navigate(`/tools/sectorale-verplichtingencheck?code=${code}&org=${organizationType}&step=3`);
      } else if (currentPath.startsWith('/tools/results/')) {
        navigate(`/tools/aanbestedingsplicht-check?code=${code}&org=${organizationType}&step=3`);
      } else {
        navigate('/start');
      }
    }
  };

  // Sample data for all 5 tabs
  const sampleBepalingScope = [
    {
      title: "Hanteer een energieprestatiecontract",
      level: "basis",
      description: (
        <>
          Een energieprestatiecontract (EPC) is een contract waarin een opdrachtnemer energiebesparing en comfort garandeert, vaak met prestatieverplichting en monitoring.
          <br />
          <a 
            href="https://infographics.rvo.nl/epc/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            RVO Stappenplan
          </a>
        </>
      ),
      expandedInfo: "Een heldere opdrachtsomschrijving is essentieel voor het succes van je aanbesteding. Hierin beschrijf je wat je precies wilt bereiken, welke resultaten je verwacht en binnen welke kaders de opdracht moet worden uitgevoerd."
    },
    {
      title: "Energieklasse producten",
      level: "gemiddeld",
      description: "Prioriteit geven aan gebouwen/installaties met slechte energieprestatie (bijv. label D, E, F, G). Maatregelen koppelen aan objecten waar de meeste winst te behalen val. Dus gebruiken energielabels (A t/m G) om maatregelen te prioriteren en eisen of gunningscriteria te onderbouwen (doel: verduurzamingsinspanningen richten waar het meeste effect zit).",
      expandedInfo: "Het correct inschatten en vaststellen van je budget is cruciaal. Dit omvat niet alleen de directe kosten van de opdracht, maar ook indirecte kosten, risico's en eventuele toekomstige uitbreidingen."
    }
  ];

  const sampleGunningscriteria = [
    {
      title: "♻️ Circulariteit",
      level: "basis",
      description: "De inschrijver kan extra punten verkrijgen bij gebruik van gerecyclede of herbruikbare materialen. Let op: volgens art. 2.114 lid 2 sub a Aw moet je goed uitleggen hoe je circulariteit meet en beoordeelt. Noem dus altijd het gebruikte label, certificaat of de meetmethode.",
      expandedInfo: (
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Gunningscriterium – Circulariteit (maximaal [X] punten)</h4>
          
          <p className="mb-4">
            De inschrijver kan extra punten verkrijgen indien wordt aangetoond dat bij de levering, uitvoering of productie zoveel mogelijk gebruik wordt gemaakt van circulaire principes, waaronder hergebruik van materialen, modulaire opbouw, losmaakbaarheid en/of toepassing van gerecyclede of biobased grondstoffen.
          </p>

          <p className="mb-2 font-medium">De inschrijver dient dit aan te tonen door:</p>
          <ul className="list-disc list-inside mb-4 ml-2 space-y-1">
            <li>een omschrijving van de toegepaste circulaire ontwerpprincipes of strategieën,</li>
            <li>onderbouwende gegevens zoals materiaalpaspoorten, certificaten (bijv. Cradle to Cradle, Madaster-registratie), LCA-data of beschrijvingen van hergebruikscenario's,</li>
            <li>en een overzicht van de herkomst en bestemming van de gebruikte materialen.</li>
          </ul>

          <p className="mb-4 text-sm">
            Gelijkwaardige werkwijzen of certificeringen worden geaccepteerd mits onderbouwd, conform artikel 2.114, tweede lid, onderdeel a, van de Aanbestedingswet 2012.
          </p>

          <p className="mb-2 font-medium">Beoordeling:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Geen toepassing van circulaire principes of onvoldoende onderbouwing: 0 punten</li>
            <li>Beperkte toepassing van circulaire principes (bijv. deels gerecycled materiaal): [X] punten</li>
            <li>Aantoonbare, integrale toepassing van circulair ontwerp en materiaalgebruik: [X + Y] punten</li>
          </ul>
        </div>
      )
    },
    {
      title: "🌍 CO₂-impact",
      level: "basis",
      description: "De inschrijver kan extra punten verkrijgen bij aanbod met aantoonbaar lagere CO₂-uitstoot tijdens productie, gebruik of uitvoering. Let op: volgens art. 2.114 lid 2 sub a Aw moet je goed uitleggen hoe je CO₂-reductie meet en beoordeelt. Noem dus altijd de gehanteerde rekenmethode (bijv. MPG, CO₂-prestatieladder) of een gelijkwaardig instrument.",
      expandedInfo: (
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Gunningscriterium – CO₂-impact (maximaal [X] punten)</h4>
          
          <p className="mb-4">
            De inschrijver kan extra punten verkrijgen indien wordt aangetoond dat de aangeboden oplossing leidt tot een aantoonbaar lagere CO₂-uitstoot tijdens de productie, uitvoering of gebruiksfase, ten opzichte van een gangbare referentieoplossing.
          </p>

          <p className="mb-2 font-medium">De inschrijver dient dit aan te tonen door:</p>
          <ul className="list-disc list-inside mb-4 ml-2 space-y-1">
            <li>een berekening van de verwachte CO₂-uitstoot met behulp van een erkende meetmethode (zoals MPG, CO₂-prestatieladder, DuboCalc of vergelijkbaar),</li>
            <li>onderbouwende documenten zoals productspecificaties, certificaten of LCA-rapportages,</li>
            <li>en een toelichting op de gehanteerde uitgangspunten en systeemgrenzen bij de berekening.</li>
          </ul>

          <p className="mb-4 text-sm">
            Gelijkwaardige methoden of instrumenten worden geaccepteerd mits onderbouwd, conform artikel 2.114, tweede lid, onderdeel a, van de Aanbestedingswet 2012.
          </p>

          <p className="mb-2 font-medium">Beoordeling:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Geen aantoonbare CO₂-reductie of onvoldoende onderbouwing: 0 punten</li>
            <li>Aangetoonde CO₂-reductie van minimaal [X]% t.o.v. de referentie: [X] punten</li>
            <li>Aangetoonde CO₂-reductie van ≥[Y]% t.o.v. de referentie, met volledige en controleerbare onderbouwing: [X + Y] punten</li>
          </ul>
        </div>
      )
    },
    {
      title: "⏳ Levensduur",
      level: "basis",
      description: "De inschrijver kan extra punten verkrijgen bij producten of oplossingen met een aantoonbaar langere technische of functionele levensduur. Let op: volgens art. 2.114 lid 2 sub a Aw moet je duidelijk maken hoe je de levensduur bepaalt en toetst. Vermeld dus welke vorm van garantie, documentatie of bewijs je accepteert.",
      expandedInfo: (
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Gunningscriterium – Levensduur (maximaal [X] punten)</h4>
          
          <p className="mb-4">
            De inschrijver kan extra punten verkrijgen indien wordt aangetoond dat de aangeboden producten, systemen of oplossingen een aantoonbaar langere technische of functionele levensduur hebben dan gangbare of wettelijk vereiste standaarden.
          </p>

          <p className="mb-2 font-medium">De inschrijver dient dit aan te tonen door:</p>
          <ul className="list-disc list-inside mb-4 ml-2 space-y-1">
            <li>een verklaring van de fabrikant of leverancier waarin de verwachte of gegarandeerde levensduur is opgenomen,</li>
            <li>onderbouwende documentatie zoals garantievoorwaarden, onderhoudsprotocollen of prestatiespecificaties,</li>
            <li>en (indien van toepassing) gegevens over repareerbaarheid, beschikbaarheid van onderdelen of modulair ontwerp.</li>
          </ul>

          <p className="mb-4 text-sm">
            Gelijkwaardige vormen van bewijs worden geaccepteerd mits onderbouwd, conform artikel 2.114, tweede lid, onderdeel a, van de Aanbestedingswet 2012.
          </p>

          <p className="mb-2 font-medium">Beoordeling:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Levensduur ≤ [X] jaar of onvoldoende onderbouwing: 0 punten</li>
            <li>Levensduur {`>`} [X] jaar en ≤ [Y] jaar, onderbouwd: [X] punten</li>
            <li>Levensduur {`>`} [Y] jaar, aantoonbaar en controleerbaar onderbouwd: [X + Y] punten</li>
          </ul>
        </div>
      )
    }
  ];

  const sampleTechnischeSpecificaties = [
    {
      title: "Energieverbruik",
      level: "streng",
      description: "Maximaal energieverbruik van 50W per apparaat",
      expandedInfo: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate."
    },
    {
      title: "Compatibiliteit en integratie",
      level: "gemiddeld",
      description: "Apparatuur moet compatibel zijn met bestaande systemen",
      expandedInfo: "De technische specificaties moeten ervoor zorgen dat nieuwe apparatuur naadloos integreert met de huidige IT-infrastructuur en bestaande systemen van de organisatie."
    }
  ];

  const filterItems = (items: any[]) => {
    if (levelFilter === 'alle-niveaus') return items;
    return items.filter(item => item.level === levelFilter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0ms', animationDuration: '700ms' }}>
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Vorige stap
          </button>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 animate-fade-in" style={{ animationDelay: '200ms', animationDuration: '1000ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {estimationAnswer === 'no' ? 'Geen sectorale verplichtingen' : (
                  <>
                    <svg className="w-6 h-6 text-orange-500" viewBox="0 0 93.32 84.41" fill="currentColor">
                      <path d="M92.21,71.78L54.02,4.28c-1.52-2.69-4.27-4.28-7.36-4.28s-5.84,1.59-7.36,4.28L1.11,71.78c-1.5,2.66-1.48,5.8.05,8.44,1.53,2.62,4.27,4.19,7.31,4.19h76.37c3.05,0,5.78-1.56,7.31-4.19,1.53-2.64,1.55-5.78.05-8.44h0ZM41.97,65.88c0-2.58,2.11-4.69,4.69-4.69s4.69,2.11,4.69,4.69-2.11,4.69-4.69,4.69-4.69-2.11-4.69-4.69ZM51.51,51.91c-.12,2.58-2.27,4.59-4.84,4.59s-4.72-2.02-4.84-4.59l-1.16-21.89c-.09-1.67.5-3.25,1.64-4.45s2.69-1.88,4.36-1.88,3.22.67,4.36,1.88,1.73,2.78,1.64,4.45l-1.16,21.89Z"/>
                    </svg>
                    Let op: Sectorale verplichtingen
                  </>
                )}
              </h1>
            </div>
            {estimationAnswer !== 'no' && (
              <div className="flex items-center gap-4 ml-4 relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Ambitieniveau</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Ambitieniveau uitleg</h4>
                      <p className="text-sm text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p className="text-sm text-gray-600">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" side="bottom" sideOffset={5}>
                      <SelectItem value="alle-niveaus">Alle niveaus</SelectItem>
                      <SelectItem value="basis">Basis</SelectItem>
                      <SelectItem value="gemiddeld">Gemiddeld</SelectItem>
                      <SelectItem value="streng">Streng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* User Input Summary - integrated */}
          {(organizationType || estimationAnswer) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Jouw selecties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CPV Selection */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Aanbesteding</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{code}</p>
                  <p className="text-xs text-gray-600">{cpvName}</p>
                </div>

                {/* Organization Type */}
                {organizationType && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Organisatie</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{getOrganizationName(organizationType)}</p>
                    <p className="text-xs text-gray-600">Type aanbestedende dienst</p>
                  </div>
                )}

                {/* Estimation Answer */}
                {estimationAnswer && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Drempelwaarde</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{getEstimationText(estimationAnswer)}</p>
                    {organizationType && estimationAnswer !== 'help' && (
                      <p className="text-xs text-gray-600">Drempel: {getThresholdAmount(organizationType, 'Diensten')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Banner - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ontgrendel alle sectorale verplichtingen</h3>
                  <p className="text-blue-100">Krijg toegang tot gedetailleerde compliance-informatie en praktische voorbeelden</p>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium whitespace-nowrap"
              >
                Start je proefperiode
              </button>
            </div>
          </div>
        )}

        {/* Below threshold explanation */}
        {estimationAnswer === 'no' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Goed nieuws!</h3>
                <p className="text-green-700 mt-2">
                  Je raming blijft onder de drempelwaarde van {organizationType && getThresholdAmount(organizationType, 'Diensten')}. 
                  Dit betekent dat er geen specifieke sectorale verplichtingen van toepassing zijn op je aanbesteding.
                </p>
                <p className="text-green-600 text-sm mt-3">
                  Je kunt aanbesteden volgens de nationale aanbestedingsregels zonder aanvullende sectorale wetgeving.
                </p>
              </div>
            </div>
            <Confetti />
          </div>
        )}

        {/* EED Section - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '600ms', animationDuration: '1000ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Let op: EED van toepassing</h2>
            <p className="text-gray-700 mb-6">
              Op jouw aanbesteding is de EED van toepassing. Hieronder kies je op welke manieren je aan deze EU verplichting wilt voldoen.
            </p>
          </div>
        )}

        {/* Expandable Sections - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '700ms', animationDuration: '1200ms' }}>
            <Accordion 
              type="multiple" 
              className="space-y-4"
              value={openAccordions}
              onValueChange={setOpenAccordions}
            >
              {/* Bepaling scope opdracht */}
              <AccordionItem value="bepaling-scope" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-lg font-semibold">Bepaling scope opdracht</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Kies één van deze opties om via bepaling scope opdracht aan je EED verplichtingen te voldoen.</p>
                      <p className="mb-3">Dit omvat de hele fase vóór het publiceren van de aanbesteding:</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Het bepalen of er wordt aanbesteed</li>
                        <li>Wat het doel is van de opdracht</li>
                        <li>Hoe het programma van eisen eruitziet</li>
                        <li>Welke strategie wordt gevolgd (EMVI, laagste prijs, functioneel specificeren etc.)</li>
                        <li>Of duurzaamheid meeweegt, en zo ja: hoe</li>
                      </ul>
                      <p><strong>Dus:</strong> het gaat over hoe je tot je PvE en aanbestedingsstukken komt — de voorbereidende keuzes.</p>
                    </div>
                    {filterItems(sampleBepalingScope).map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Gunningscriteria */}
              <AccordionItem value="gunningscriteria" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-lg font-semibold">Gunningscriteria</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Met gunningscriteria kun je aan de EED voldoen door energie-efficiënte keuzes te belonen tijdens je aanbesteding. Hier vind je veelgebruikte criteria met een korte toelichting en een tekst die je kunt overnemen in je eigen aanbesteding.</p>
                    </div>
                    {filterItems(sampleGunningscriteria).map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Technische specificaties */}
              <AccordionItem value="technische-specificaties" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-lg font-semibold">Technische specificaties</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Technische specificaties beschrijven in detail wat er geleverd moet worden. Formuleer deze functioneel in plaats van technisch specifiek om innovatie en concurrentie te stimuleren.</p>
                      <p>Vermijd het voorschrijven van specifieke merken of producten, maar beschrijf de gewenste prestaties, eigenschappen en resultaten. Verwijs waar mogelijk naar erkende normen en standaarden.</p>
                    </div>
                    {filterItems(sampleTechnischeSpecificaties).map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
