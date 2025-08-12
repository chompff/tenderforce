import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, ChevronDown, ChevronUp, Lock, Star, CheckCircle, Building, Calculator, Copy, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getCpvName } from '../../utils/cpvLookup';
import Confetti from '../../components/Confetti';
import { useStealthMode } from '@/lib/utils';

interface ExpandableInfoProps {
  title: string;
  level: string;
  description: string | React.ReactNode;
  expandedInfo: string | React.ReactNode;
  hideCopyButton?: boolean;
  hideLevelBadge?: boolean;
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

const ExpandableInfo: React.FC<ExpandableInfoProps> = ({ title, level, description, expandedInfo, hideCopyButton = false, hideLevelBadge = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const getLevelBadge = (level: string) => {
    const styles = {
      basis: 'bg-red-100 text-red-800',
      gemiddeld: 'bg-yellow-100 text-yellow-800', 
      streng: 'bg-green-100 text-green-800'
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
          {!hideLevelBadge && (
            <span className={getLevelBadge(level)}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-2">
          {description}
        </CardDescription>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 transition-colors">
              {isOpen ? 'Verberg voorbeelden' : 'Toon voorbeelden'}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="relative text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
              {!hideCopyButton && (
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
              )}
              <div ref={contentRef} className={hideCopyButton ? "" : "pr-8"}>
              {expandedInfo}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

// TenderNetExamples component with tabs and copy functionality
const TenderNetExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'toegepast' | 'niet-toegepast'>('toegepast');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = {
    'toegepast': "Bij de voorbereiding van deze aanbesteding is het energie-efficiëntie-eerst-beginsel toegepast. In de ontwerpfase zijn verschillende oplossingen onderzocht op energieprestaties, levenscycluskosten en milieueffecten. Op basis hiervan is gekozen voor een oplossing die voldoet aan de eisen uit bijlage IV van Richtlijn (EU) 2023/1791 en die bijdraagt aan een lager energieverbruik en CO₂-reductie gedurende de gebruiksfase. Deze afweging is vastgelegd in het inkoopdossier.",
    'niet-toegepast': "Bij de voorbereiding van deze aanbesteding is het energie-efficiëntie-eerst-beginsel beoordeeld, maar niet toegepast. Reden hiervoor is dat toepassing in dit geval technisch niet haalbaar en/of disproportioneel kostbaar was in verhouding tot het verwachte energievoordeel. Alternatieve energie-efficiënte oplossingen voldeden niet aan de functionele en prestatie-eisen van de opdracht. Deze afweging en motivering zijn vastgelegd in het inkoopdossier."
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(0);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('toegepast')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'toegepast' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ✅ Toegepast
          </button>
          <button 
            onClick={() => setActiveTab('niet-toegepast')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'niet-toegepast' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ❌ Niet toegepast
          </button>
        </div>
      </div>

      {/* Example content */}
      <div 
        onClick={() => handleCopy(examples[activeTab])}
        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group"
        title={copiedIndex === 0 ? "Gekopieerd!" : "Klik om te kopiëren"}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copiedIndex === 0 ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-3 border-l-blue-200 italic pr-8">
          "{examples[activeTab]}"
        </p>
      </div>
      
      {/* Legal Advisory Promotion */}
      <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              MV
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-900 mb-1">
              Het is erg belangrijk dat deze tekst juridisch correct is. Vraag het aan een aanbestedingsjurist.
            </p>
            <p className="text-xs text-indigo-700 font-medium">
              💼 <strong>Mr. Martine Vidal</strong> - Specialist Aanbestedingsrecht
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-xs">⚖️</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          {activeTab === 'toegepast' ? (
            <>
              💡 <strong>Tip:</strong> Gebruik deze voorbeeldtekst als basis voor uw rapportage wanneer het energie-efficiëntie-eerst-beginsel is toegepast.
            </>
          ) : (
            <>
              💡 <strong>Tip:</strong> Gebruik deze voorbeeldtekst als basis voor uw rapportage wanneer het energie-efficiëntie-eerst-beginsel niet is toegepast.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// TypeOpdrachtExamples component with tabs and copy functionality
const TypeOpdrachtExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basis' | 'ambitieus'>('basis');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = {
    basis: [
      {
        title: "🪑 Nieuw meubilair",
        text: "Deze opdracht betreft de levering van nieuw kantoormeubilair dat voldoet aan de basisvereisten van de Europese GPP-criteria. De focus ligt op meubels met een acceptabele levensduur, lage emissies van vluchtige organische stoffen, en het gebruik van hout uit duurzaam beheerde bossen (FSC/PEFC)."
      },
      {
        title: "🔄 Refurbished meubilair", 
        text: "Deze opdracht betreft de levering van refurbished kantoormeubilair dat technisch en esthetisch is opgeknapt en voldoet aan de gebruikerseisen. Basisinformatie over de herkomst en opgeknapte onderdelen wordt meegeleverd."
      },
      {
        title: "♻️ End-of-life verwerking",
        text: "Deze opdracht betreft het ophalen, sorteren en op milieuvriendelijke wijze verwerken van afgeschreven kantoormeubilair. Herbruikbare onderdelen worden apart gehouden en verantwoord afgevoerd."
      }
    ],
    ambitieus: [
      {
        title: "🪑 Nieuw meubilair",
        text: "Deze opdracht betreft de levering van nieuw, duurzaam en circulair kantoormeubilair met een lange levensduur, lage emissies, maximale demonteerbaarheid en een hoog percentage gerecycled materiaal. Leveranciers moeten materiaalpaspoorten aanleveren en hergebruik/vervangbaarheid van onderdelen aantonen. De gunning vindt plaats op basis van milieu-impact en circulariteit."
      },
      {
        title: "🔄 Refurbished meubilair", 
        text: "Deze opdracht betreft de levering van refurbished meubilair waarbij de opdrachtnemer garanties biedt op duurzaamheid, levensduurverlenging, traceerbaarheid van onderdelen en milieuprestaties. Er gelden eisen voor modulair ontwerp, vervangbaarheid van onderdelen en milieucertificering van gebruikte materialen. Een onderhoudsplan en een impactrapportage maken onderdeel uit van de opdracht."
      },
      {
        title: "♻️ End-of-life verwerking", 
        text: "Deze opdracht betreft een circulaire verwerkingsopdracht waarbij afgeschreven meubilair zoveel mogelijk wordt hergebruikt of hoogwaardig gerecycled. De opdrachtnemer moet aantonen hoeveel procent van het meubilair wordt hergebruikt, welke onderdelen worden teruggewonnen, en hoe reststromen worden verwerkt conform GPP-richtlijnen. Terugnameverplichtingen, transparante rapportages en een 'zero waste'-aanpak zijn onderdeel van de eisen."
      }
    ]
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('basis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'basis' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Basis
          </button>
          <button 
            onClick={() => setActiveTab('ambitieus')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'ambitieus' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎯 Ambitieus
          </button>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid gap-3">
        {examples[activeTab].map((example, index) => (
          <div key={`${activeTab}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">
                {example.title}
              </h5>
              <button 
                onClick={() => handleCopy(example.text, index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors group"
                title={copiedIndex === index ? "Gekopieerd!" : "Kopieer naar klembord"}
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-3 border-l-blue-200 italic">
              "{example.text}"
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          {activeTab === 'basis' ? (
            <>
              💡 <strong>Tip:</strong> De basiscriteria helpen je te voldoen aan de EED-verplichting. 
              Kies deze variant als je vooral wilt voldoen aan de Europese regelgeving zonder aanvullende ambities.
            </>
          ) : (
            <>
              💡 <strong>Tip:</strong> De ambitieuze criteria gaan verder dan de EED-verplichting en helpen je organisatie actief te sturen op circulariteit, CO₂-reductie en innovatie. 
              Kies deze variant als je duurzaamheid centraal wilt stellen.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// FunctioneleBehoefteExamples component with tabs and copy functionality
const FunctioneleBehoefteExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basis' | 'ambitieus'>('basis');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = {
    basis: [
      {
        title: "📋 Functionele eisen",
        text: "Deze opdracht betreft de levering van kantoormeubilair dat geschikt is voor dagelijks gebruik en eenvoudig te reinigen is. De meubels moeten voldoen aan de basisvereisten voor ergonomie en gebruikscomfort."
      }
    ],
    ambitieus: [
      {
        title: "📋 Functionele eisen",
        text: "Deze opdracht betreft de levering van modulair kantoormeubilair met een lange gebruiksduur, dat eenvoudig aanpasbaar is aan veranderende behoeften. De meubels moeten ergonomisch ontworpen zijn, eenvoudig te onderhouden en geschikt voor circulaire werkconcepten."
      }
    ]
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('basis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'basis' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Basis
          </button>
          <button 
            onClick={() => setActiveTab('ambitieus')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'ambitieus' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎯 Ambitieus
          </button>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid gap-3">
        {examples[activeTab].map((example, index) => (
          <div key={`${activeTab}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">
                {example.title}
              </h5>
              <button 
                onClick={() => handleCopy(example.text, index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors group"
                title={copiedIndex === index ? "Gekopieerd!" : "Kopieer naar klembord"}
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-3 border-l-blue-200 italic">
              "{example.text}"
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          {activeTab === 'basis' ? (
            <>
              💡 <strong>Tip:</strong> De basiscriteria helpen je te voldoen aan de EED-verplichting. 
              Kies deze variant als je vooral wilt voldoen aan de Europese regelgeving zonder aanvullende ambities.
            </>
          ) : (
            <>
              💡 <strong>Tip:</strong> De ambitieuze criteria gaan verder dan de EED-verplichting en helpen je organisatie actief te sturen op circulariteit, CO₂-reductie en innovatie. 
              Kies deze variant als je duurzaamheid centraal wilt stellen.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// LevenscyclusbenaderingExamples component with tabs and copy functionality
const LevenscyclusbenaderingExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basis' | 'ambitieus'>('basis');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = {
    minimaal: [
      {
        title: "🔄 Levenscyclus",
        text: "Bij de beoordeling wordt rekening gehouden met de verwachte levensduur van het meubilair en de mogelijkheid tot eenvoudig onderhoud. Er wordt gekozen voor producten met standaardonderdelen die eenvoudig vervangen en onderhouden kunnen worden."
      }
    ],
    streng: [
      {
        title: "🔄 Levenscyclus",
        text: "Het meubilair moet ontworpen zijn op basis van een volledige levenscyclusbenadering. Dit betekent: demontabel ontwerp, herbruikbare onderdelen, beschikbaarheid van reserveonderdelen gedurende minimaal 10 jaar en een onderbouwde inschatting van milieu-impact volgens de LCA-methode."
      }
    ]
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('minimaal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'minimaal' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Minimaal
          </button>
          <button 
            onClick={() => setActiveTab('streng')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'streng' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎯 Streng
          </button>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid gap-3">
        {examples[activeTab].map((example, index) => (
          <div key={`${activeTab}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">
                {example.title}
              </h5>
              <button 
                onClick={() => handleCopy(example.text, index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors group"
                title={copiedIndex === index ? "Gekopieerd!" : "Kopieer naar klembord"}
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-3 border-l-blue-200 italic">
              "{example.text}"
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          {activeTab === 'minimaal' ? (
            <>
              💡 <strong>Tip:</strong> De minimale criteria helpen je te voldoen aan de EED-verplichting. 
              Kies deze variant als je vooral wilt voldoen aan de Europese regelgeving zonder aanvullende ambities.
            </>
          ) : (
            <>
              💡 <strong>Tip:</strong> De strenge criteria gaan verder dan de EED-verplichting en helpen je organisatie actief te sturen op circulariteit, CO₂-reductie en innovatie. 
              Kies deze variant als je duurzaamheid centraal wilt stellen.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// TechnischeSpecificatiesTables component with tabs and copy functionality
const TechnischeSpecificatiesTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verplicht' | 'voorwaardelijk' | 'aanbevolen' | 'optioneel'>('verplicht');
  const [isCopied, setIsCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getTipContent = (tab: string) => {
    switch (tab) {
      case 'verplicht':
        return "Let op: deze minimale eisen vormen de ondergrens. Een inschrijving die hier niet aan voldoet, moet worden uitgesloten. Zorg dus dat deze eisen expliciet en toetsbaar in je bestek staan.";
      case 'voorwaardelijk':
        return "Gebruik deze eisen alleen als ze aantoonbaar relevant zijn voor het beoogde gebruik of beleid. Licht in je aanbestedingsstukken toe waarom de voorwaarde van toepassing is.";
      case 'aanbevolen':
        return "Aanbevolen specificaties kunnen bijdragen aan betere prestaties of duurzaamheid, maar zijn niet verplicht. Gebruik ze als richtinggevend kader of als basis voor gunningscriteria.";
      case 'optioneel':
        return "Vermijd overmatige technische detaillering buiten de GPP-structuur: dat beperkt markttoegang en remt innovatie. Gebruik de TS-codes als stabiele basis en versterk eventueel met functionele of circulaire eisen bij het Programma van Eisen.";
      default:
        return "Geen tip beschikbaar.";
    }
  };

  const getTooltipContent = (tab: string) => {
    switch (tab) {
      case 'verplicht':
        return {
          title: "🔴 Verplichte specificaties",
          content: (
            <div className="space-y-2">
              <p>De GPP-criteria zijn beleidsinstrumenten die verplichtende technische eisen formuleren op basis van bestaande EU-wetgeving en normen. De onderliggende bron van deze verplichte specificaties is juridisch bindend, zoals:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Europese verordeningen (bv. REACH, EUTR),</li>
                <li>Europese normen (bv. EN 1335, EN 717-1),</li>
                <li>Beleidsafspraken met rechtsgrond (bv. Ecodesign-richtlijn).</li>
              </ul>
              <p>Daarom vind je hier per specificatie een formele juridische of normatieve bron. Zo weet je zeker dat de eis niet vrijblijvend is, maar rechtstreeks voortkomt uit wet- en regelgeving.</p>
            </div>
          )
        };
      case 'voorwaardelijk':
        return {
          title: "🟡 Voorwaardelijk verplichte specificaties",
          content: (
            <div className="space-y-2">
              <p>Deze eisen gelden alleen als een bepaalde voorwaarde van toepassing is, zoals de aanwezigheid van mechanische onderdelen of een terugnameverplichting. De onderbouwing bestaat deels uit normatieve kaders (zoals ISO 14024), maar is meestal beleidsmatig.</p>
              <p>De bronvermelding verwijst hier naar internationale standaarden of GPP-analyses, die transparantie en controleerbaarheid ondersteunen — maar alleen verplicht zijn als de genoemde situatie zich voordoet.</p>
            </div>
          )
        };
      case 'aanbevolen':
        return {
          title: "🔵 Aanbevolen specificaties",
          content: (
            <div className="space-y-2">
              <p>Deze technische aanbevelingen zijn gebaseerd op de EU GPP-achtergrondrapporten. Ze zijn niet wettelijk verplicht, maar bevorderen circulaire economie, milieuvriendelijkheid of gezond binnenklimaat.</p>
              <p>De bronvermelding verwijst hier naar het GPP Technical Background Report, omdat er geen specifieke wetgeving of norm aan ten grondslag ligt. Je kunt ze wel opnemen als gunnings- of uitvoeringseis voor extra impact.</p>
            </div>
          )
        };
      case 'optioneel':
        return {
          title: "🟢 Optionele specificaties",
          content: (
            <div className="space-y-2">
              <p>Optionele specificaties zijn inspirerende suggesties uit het GPP-kader. Ze zijn bedoeld om innovatie te stimuleren en ambities op het gebied van duurzaamheid of circulariteit te versterken.</p>
              <p>Er is geen bronvermelding nodig, want ze hebben geen verplichtend karakter. Je kunt ze naar eigen inzicht opnemen, bijvoorbeeld in overleg met marktpartijen of als experimentele eis.</p>
            </div>
          )
        };
      default:
        return {
          title: "Bronvermelding",
          content: <div>Geen informatie beschikbaar.</div>
        };
    }
  };

  const tables = {
    verplicht: {
      title: "Verplichte specificaties",
      data: [
        { code: "TS1", specification: "Het toegepaste hout in het meubilair moet afkomstig zijn uit duurzaam beheerde bossen en voldoen aan de vereisten van de Europese Houtverordening (EUTR). Er dient aantoonbaar gebruikgemaakt te worden van legaal hout.", bronvermelding: "Verordening (EU) nr. 995/2010 (EUTR)" },
        { code: "TS2", specification: "Het meubilair moet voldoen aan de grenswaarden voor formaldehyde-emissie volgens de EN 717-1 norm of een gelijkwaardige Europese norm. Dit geldt voor alle toegepaste houtmaterialen, zoals spaanplaat, MDF en multiplex.", bronvermelding: "EN 717-1: Formaldehyde-emissie — testmethode" },
        { code: "TS3", specification: "Alle geleverde meubelproducten moeten voldoen aan de REACH-verordening. Het gebruik van stoffen die zijn opgenomen op de lijst van Zeer Zorgwekkende Stoffen (SVHC-lijst) is verboden.", bronvermelding: "Verordening (EG) nr. 1907/2006 (REACH); SVHC-lijst (ECHA)" },
        { code: "TS4", specification: "Voor bureaustoelen, werktafels en andere zit- en werkmeubelen moeten ergonomische eisen worden gevolgd zoals vastgelegd in de toepasselijke EN-normen, waaronder EN 1335, EN 527 en/of gelijkwaardige normen.", bronvermelding: "EN 1335 (bureaustoelen); EN 527 (werktafels)" },
        { code: "TS5", specification: "Het meubilair moet zijn getest op duurzaamheid en stabiliteit conform de relevante Europese normen, zoals EN 16139 voor zitmeubilair of EN 1728 voor structurele sterkte en veiligheid.", bronvermelding: "EN 16139, EN 1728: Mechanische sterkte en duurzaamheid van meubelen" },
        { code: "TS6", specification: "De verpakking van het meubilair dient minimaal en functioneel te zijn, waarbij zoveel mogelijk gebruik wordt gemaakt van recyclebare materialen. De verpakking moet duidelijk gemarkeerd zijn ten behoeve van gescheiden afvalinzameling.", bronvermelding: "Richtlijn 94/62/EG betreffende verpakking en verpakkingsafval" },
        { code: "TS7", specification: "Bij levering van het meubilair moeten duidelijke onderhouds- en reinigingsinstructies worden meegeleverd. Deze moeten afgestemd zijn op de gebruikte materialen en afwerkingen.", bronvermelding: "ISO 14021 (milieu-informatie); gangbare leveranciersdocumentatie" }
      ]
    },
    voorwaardelijk: {
      title: "Voorwaardelijk verplichte specificaties",
      data: [
        { code: "TS8", specification: (<><em>Indien in de productspecificaties een minimumpercentage gerecycled materiaal is opgenomen,</em> dient het meubilair aan dit percentage te voldoen. De herkomst en het percentage gerecycled materiaal moeten aantoonbaar zijn.</>) , bronvermelding: "Europese Green Deal-doelstellingen, Afvalrichtlijn (2008/98/EG)" },
        { code: "TS9", specification: (<><em>Indien het geleverde meubilair mechanische of verstelbare onderdelen bevat,</em> moeten deze onderdelen als afzonderlijke componenten vervangbaar zijn. In de documentatie dient te worden aangegeven welke onderdelen vervangbaar zijn en hoe ze kunnen worden besteld.</>) , bronvermelding: "EU GPP Criteria for Furniture, Technical Report 2021, pagina 15 (Product durability and reparability)" },
        { code: "TS10", specification: (<><em>Indien sprake is van modulair meubilair,</em> moet het ontwerp uitbreidbaar en aanpasbaar zijn met behoud van functionele en esthetische samenhang. Koppeling met bestaande modules dient zonder speciaal gereedschap mogelijk te zijn.</>) , bronvermelding: "EU GPP Criteria for Furniture, Technical Report 2021, pagina 15 (Product modularity and upgradability)" },
        { code: "TS11", specification: (<><em>Indien de inschrijver zich beroept op een milieukeurmerk of certificering van een derde partij</em> om aan te tonen dat wordt voldaan aan een technische of milieueis, moet dit keurmerk onafhankelijk, transparant en toetsbaar zijn, conform ISO 14024 of een gelijkwaardig systeem.</>) , bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, pagina 33 (Use of ecolabels – compliance with ISO 14024)" },
        { code: "TS12", specification: (<><em>Indien in de opdracht sprake is van een terugname- of recyclingsverplichting,</em> moet de inschrijver een sluitend systeem aanbieden voor het ophalen, hergebruiken en/of milieuvriendelijk verwerken van het afgedankte meubilair.</>) , bronvermelding: "EU GPP Criteria for Furniture, Technical Report 2021, pagina 16 (Take-back and recycling schemes)" }
      ]
    },
    aanbevolen: {
              title: "Aanbevolen specificaties",
      data: [
        { code: "TS13", specification: "Meubilair dient ontworpen te zijn met het oog op eenvoudige demontage, zodat verschillende materiaalsoorten (hout, metaal, kunststof) aan het einde van de levensduur makkelijk van elkaar gescheiden kunnen worden.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 15 (Design for disassembly)" },
        { code: "TS14", specification: "Het gebruik van hout dat FSC- of PEFC-gecertificeerd is, wordt sterk aanbevolen ter borging van duurzaam bosbeheer, bovenop de wettelijke verplichting tot legaal houtgebruik.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 13 (Legal and sustainable timber sourcing)" },
        { code: "TS15", specification: "Het is sterk aanbevolen dat de inschrijver garandeert dat reserveonderdelen voor de geleverde meubelen gedurende minimaal vijf jaar beschikbaar blijven, gerekend vanaf het moment van levering.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 15 (Product durability and reparability)" },
        { code: "TS16", specification: "Waar mogelijk wordt geadviseerd gebruik te maken van lijmen, lakken en verven met lage emissies van vluchtige organische stoffen (VOS), ten behoeve van een gezond binnenklimaat.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 19 (Indoor air quality – low emission materials)" }
      ]
    },
    optioneel: {
      title: "Optionele specificaties",
      data: [
        { code: "TS17", specification: "Het is toegestaan, aanvullend op de minimale eisen, meubels aan te bieden met biologisch afbreekbare coatings of oppervlaktebehandelingen die het milieuprofiel verder verbeteren.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 17 (Surface treatments – use of low-emission and biodegradable coatings)" },
        { code: "TS18", specification: "Indien beschikbaar kunnen opbergmeubelen geleverd worden met akoestische demping of geluidsreducerende panelen, mits dit niet ten koste gaat van functionaliteit of veiligheid.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 14 (Noise reduction – acoustic comfort)" },
        { code: "TS19", specification: "De inschrijver mag vrijwillig een Environmental Product Declaration (EPD) meesturen per product, mits opgesteld volgens ISO 14025 of een vergelijkbaar erkend systeem.", bronvermelding: "EU GPP Criteria for Furniture, Technical Background Report 2021, p. 33 (Product-level environmental information – use of EPDs conform ISO 14025)" },
        { code: "TS20", specification: "Het staat de inschrijver vrij om esthetische varianten aan te bieden in kleur, materiaal of afwerking, zolang deze voldoen aan de overige technische en functionele eisen van de opdracht.", bronvermelding: "Niet van toepassing – aanbestedingsrechtelijke ruimte voor varianten (interne toelichting of motivering volstaat)" }
      ]
    }
  };

  const handleCopy = async () => {
    try {
      const currentTable = tables[activeTab];
      let tableText = `${currentTable.title}\n\n`;
      tableText += "TS-code\tSpecificatie\tBronvermelding\n";
      currentTable.data.forEach(row => {
        tableText += `${row.code}\t${row.specification}\t${row.bronvermelding || ''}\n`;
      });
      
      await navigator.clipboard.writeText(tableText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('verplicht')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'verplicht' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Verplicht
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('voorwaardelijk')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'voorwaardelijk' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Voorwaardelijk verplicht
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('aanbevolen')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'aanbevolen' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Aanbevolen
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('optioneel')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'optioneel' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Optioneel
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
          <h5 className="font-medium text-gray-900">
            {tables[activeTab].title}
          </h5>
          <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded transition-colors group"
            title={isCopied ? "Gekopieerd!" : "Kopieer tabel naar klembord"}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">
                  TS-CODE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Specificatie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-80">
                  <div className="flex items-center gap-1">
                    <span>Bronvermelding</span>
                                        <div className="relative">
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" 
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          });
                          setShowTooltip(true);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables[activeTab].data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 w-24">
                    {row.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.specification}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 w-80">
                    {row.bronvermelding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> {getTipContent(activeTab)}
        </p>
      </div>
      
            {showTooltip && createPortal(
        <div 
          className="fixed w-80 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: tooltipPosition.x - 160,
            top: tooltipPosition.y - 200,
          }}
        >
          <div className="mb-2 font-semibold text-sm">{getTooltipContent(activeTab).title}</div>
          {getTooltipContent(activeTab).content}
          <div 
            className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
            style={{
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>,
        document.body
      )}
    </div>
  );
};

const GunningscriteriaTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'circulariteit' | 'milieu' | 'sociaal' | 'kwaliteit' | 'certificering' | 'logistiek'>('circulariteit');
  const [isCopied, setIsCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getTipContent = (tab: string) => {
    switch (tab) {
      case 'circulariteit':
        return "Stimuleert hergebruik en verlenging van de levensduur, in lijn met Rijksbeleid Circulaire Economie.";
      case 'milieu':
        return "Richt zich op reductie van milieubelasting. Vereist bewijs via EPD's, LCA's of certificaten.";
      case 'sociaal':
        return "Ondersteunt eerlijk werk, veilige productieomstandigheden en inclusieve arbeid.";
      case 'kwaliteit':
        return "Verlengt de gebruiksperiode en voorkomt vervanging. Toetsing is relatief eenvoudig.";
      case 'certificering':
        return "Vergemakkelijkt toetsing via erkende labels en borgt minimale prestaties.";
      case 'logistiek':
        return "Draagt bij aan emissiereductie in de keten en circulaire retourstromen.";
      default:
        return "Geen tip beschikbaar.";
    }
  };

  const getTooltipContent = (tab: string) => {
    switch (tab) {
      case 'circulariteit':
        return "Deze criteria zijn gebaseerd op circulaire ontwerpprincipes in de EU GPP-achtergronddocumentatie.";
      case 'milieu':
        return "Deze criteria zijn gericht op CO₂-reductie en toxiciteit en gebaseerd op het EU GPP-achtergronddocument.";
      case 'sociaal':
        return "Geïnspireerd op OESO-richtlijnen voor IMVO en sociaal ondernemerschap. Zie ook EU GPP achtergrondpagina's.";
      case 'kwaliteit':
        return "Gebaseerd op kwaliteitsnormen uit het EU GPP-document en achtergrondrapport.";
      case 'certificering':
        return "Gebaseerd op erkende certificeringen en EU-aanbevolen milieulabels.";
      case 'logistiek':
        return "Gebaseerd op logistieke optimalisatie en emissiebeperking zoals opgenomen in de GPP-achtergrondrapporten.";
      default:
        return "Geen informatie beschikbaar.";
    }
  };

  const tables = {
    circulariteit: {
      title: "Gunningscriteria circulariteit",
      data: [
        { code: "GC1", criterion: "Modulair ontwerp met vervangbare onderdelen", bronvermelding: "GPP background 2017, p. 53" },
        { code: "GC2", criterion: "Demonteerbaar ontwerp t.b.v. recycling", bronvermelding: "GPP background 2017, p. 54" },
        { code: "GC3", criterion: "Hergebruik van refurbished onderdelen", bronvermelding: "GPP background 2017, p. 52" },
        { code: "GC4", criterion: "Aanwezigheid van materialenpaspoort", bronvermelding: "GPP background 2017, p. 60" },
        { code: "GC5", criterion: "Terugnamegarantie einde levensduur", bronvermelding: "GPP background 2017, p. 56" }
      ]
    },
    milieu: {
      title: "Gunningscriteria milieu-impact",
      data: [
        { code: "GC6", criterion: "LCA met aantoonbaar lagere impact dan referentieproduct", bronvermelding: "GPP background 2017, p. 58–59" },
        { code: "GC7", criterion: "Vrij van schadelijke stoffen (zoals formaldehyde)", bronvermelding: "GPP background 2017, p. 50" },
        { code: "GC8", criterion: "Gebruik van snel hernieuwbare materialen (bv. bamboe)", bronvermelding: "GPP background 2017, p. 51" }
      ]
    },
    sociaal: {
      title: "Gunningscriteria sociaal",
      data: [
        { code: "GC9", criterion: "Transparantie over toeleveringsketen en mensenrechtenrisico's", bronvermelding: "OESO-richtlijnen IMVO" },
        { code: "GC10", criterion: "Gecertificeerde arbeidsomstandigheden (SA8000, Fair Wear)", bronvermelding: "GPP background 2017, p. 61" },
        { code: "GC11", criterion: "Inclusieve werkgelegenheid bij montage of levering", bronvermelding: "Nederlandse social return-beleidskaders" }
      ]
    },
    kwaliteit: {
      title: "Gunningscriteria kwaliteit & levensduur",
      data: [
        { code: "GC12", criterion: "Levensduur ≥ 10 jaar", bronvermelding: "EU GPP criteria, hfst. 2.3" },
        { code: "GC13", criterion: "Beschikbaarheid reserveonderdelen ≥ 5 jaar", bronvermelding: "EU GPP criteria, hfst. 2.4" }
      ]
    },
    certificering: {
      title: "Gunningscriteria certificering & labels",
      data: [
        { code: "GC14", criterion: "EU Ecolabel of gelijkwaardig", bronvermelding: "EU GPP criteria, hfst. 2.1" },
        { code: "GC15", criterion: "Gecertificeerd circulair ontwerp", bronvermelding: "GPP background 2017, p. 55" }
      ]
    },
    logistiek: {
      title: "Gunningscriteria logistiek & transport",
      data: [
        { code: "GC16", criterion: "Emissiearm transport (elektrisch of HVO)", bronvermelding: "GPP background 2017, p. 62" }
      ]
    }
  };

  const handleCopy = async () => {
    try {
      const currentTable = tables[activeTab];
      let tableText = `${currentTable.title}\n\n`;
      tableText += "GC-code\tGunningscriterium\tBronvermelding\n";
      currentTable.data.forEach(row => {
        tableText += `${row.code}\t${row.criterion}\t${row.bronvermelding}\n`;
      });
      
      await navigator.clipboard.writeText(tableText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('circulariteit')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'circulariteit' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ♻️ Circulariteit
          </button>
          <button 
            onClick={() => setActiveTab('milieu')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'milieu' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🌿 Milieu-impact
          </button>
          <button 
            onClick={() => setActiveTab('sociaal')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'sociaal' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            👥 Sociaal
          </button>
          <button 
            onClick={() => setActiveTab('kwaliteit')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'kwaliteit' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📦 Kwaliteit & levensduur
          </button>
          <button 
            onClick={() => setActiveTab('certificering')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'certificering' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Certificering & labels
          </button>
          <button 
            onClick={() => setActiveTab('logistiek')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'logistiek' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🚛 Logistiek & transport
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
          <h5 className="font-medium text-gray-900">
            {tables[activeTab].title}
          </h5>
          <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded transition-colors group"
            title={isCopied ? "Gekopieerd!" : "Kopieer tabel naar klembord"}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">
                  GC-code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Gunningscriterium
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-80">
                  <div className="flex items-center gap-1">
                    <span>Bronvermelding</span>
                    <div className="relative">
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" 
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          });
                          setShowTooltip(true);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables[activeTab].data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 w-24">
                    {row.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.criterion}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 w-80">
                    {row.bronvermelding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> {getTipContent(activeTab)}
        </p>
      </div>
      
      {showTooltip && createPortal(
        <div 
          className="fixed w-80 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: tooltipPosition.x - 160,
            top: tooltipPosition.y - 200,
          }}
        >
          <div className="mb-2 font-semibold text-sm">Bronvermelding</div>
          <p>{getTooltipContent(activeTab)}</p>
          <div 
            className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
            style={{
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>,
        document.body
      )}
    </div>
  );
};


// ReikwijdteOpdrachtExamples component with tabs and copy functionality
const ReikwijdteOpdrachtExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'minimaal' | 'streng'>('minimaal');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = {
    minimaal: [
      {
        title: "📋 Opdracht scope",
        text: "De opdracht betreft de levering en plaatsing van kantoormeubilair. Afvoer van oud meubilair wordt als optionele dienst benoemd. Eventuele onderhoudsverplichtingen zijn beperkt tot de garantietermijn."
      }
    ],
    streng: [
      {
        title: "📋 Opdracht scope",
        text: "De opdracht omvat levering, plaatsing, onderhoud en circulaire verwerking van bestaand meubilair. Van opdrachtnemer wordt verwacht dat hij ontzorgt via een totaaloplossing, inclusief demontage, sortering, hergebruik en rapportage over teruggewonnen materialen."
      }
    ]
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('minimaal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'minimaal' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Minimaal
          </button>
          <button 
            onClick={() => setActiveTab('streng')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'streng' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🎯 Streng
          </button>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid gap-3">
        {examples[activeTab].map((example, index) => (
          <div key={`${activeTab}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">
                {example.title}
              </h5>
              <button 
                onClick={() => handleCopy(example.text, index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors group"
                title={copiedIndex === index ? "Gekopieerd!" : "Kopieer naar klembord"}
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-l-3 border-l-blue-200 italic">
              "{example.text}"
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          {activeTab === 'minimaal' ? (
            <>
              💡 <strong>Tip:</strong> De minimale criteria helpen je te voldoen aan de EED-verplichting. 
              Kies deze variant als je vooral wilt voldoen aan de Europese regelgeving zonder aanvullende ambities.
            </>
          ) : (
            <>
              💡 <strong>Tip bij Streng:</strong> De strenge criteria gaan verder dan de EED-verplichting en helpen je organisatie actief te sturen op circulariteit, CO₂-reductie en innovatie. 
              Kies deze variant als je duurzaamheid centraal wilt stellen.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

const ContractueleUitvoeringsvoorwaardenTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arbeidsomstandigheden' | 'sociale' | 'milieunormen'>('arbeidsomstandigheden');
  const [isCopied, setIsCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getTipContent = (tab: string) => {
    switch (tab) {
      case 'arbeidsomstandigheden':
        return "Ondersteunt arbeidsrechten zoals veilige werkomstandigheden en verbod op dwangarbeid.";
      case 'sociale':
        return "Helpt sociale misstanden in productieketens te vermijden.";
      case 'milieunormen':
        return "Vermindert milieu-impact door emissiebeperking en afvalscheiding.";
      default:
        return "Geen tip beschikbaar.";
    }
  };

  const getTooltipContent = (tab: string) => {
    switch (tab) {
      case 'arbeidsomstandigheden':
        return "Deze voorwaarden zijn gebaseerd op sociale en arbeidsnormen in de EU GPP-achtergronddocumentatie Meubilair, 2017.";
      case 'sociale':
        return "Deze voorwaarden zijn gebaseerd op sociale en arbeidsnormen in de EU GPP-achtergronddocumentatie Meubilair, 2017.";
      case 'milieunormen':
        return "Deze voorwaarden komen uit de milieucriteria in de EU GPP-achtergronddocumentatie Meubilair, 2017.";
      default:
        return "Geen informatie beschikbaar.";
    }
  };

  const tables = {
    arbeidsomstandigheden: {
      title: "Contractuele voorwaarden arbeidsomstandigheden",
      data: [
        { code: "CV1", criterion: "Aannemer moet zorgen voor naleving van gezondheids- en veiligheidseisen tijdens de uitvoering.", bronvermelding: "GPP background 2017, p. 61" },
        { code: "CV2", criterion: "Producten moeten worden vervaardigd onder omstandigheden die voldoen aan fundamentele arbeidsnormen van de ILO.", bronvermelding: "GPP background 2017, p. 61" }
      ]
    },
    sociale: {
      title: "Contractuele voorwaarden sociale normen",
      data: [
        { code: "CV3", criterion: "Leveranciers moeten een verklaring ondertekenen dat er geen sprake is van kinderarbeid of gedwongen arbeid.", bronvermelding: "GPP background 2017, p. 61" },
        { code: "CV4", criterion: "Transparantie over de toeleveringsketen is gewenst (herkomst, productiecondities).", bronvermelding: "GPP background 2017, p. 61" }
      ]
    },
    milieunormen: {
      title: "Contractuele voorwaarden milieunormen",
      data: [
        { code: "CV5", criterion: "Levering en montage moeten plaatsvinden met minimaal CO₂-belastend transport.", bronvermelding: "GPP background 2017, p. 59" },
        { code: "CV6", criterion: "Gebruik van oplosmiddelarme of -vrije lakken en lijmen bij assemblage of herstelling.", bronvermelding: "GPP background 2017, p. 57" },
        { code: "CV7", criterion: "Afval van verpakkingen of oude meubels moet gescheiden worden afgevoerd.", bronvermelding: "GPP background 2017, p. 58" }
      ]
    }
  };

  const handleCopy = async () => {
    try {
      const currentTable = tables[activeTab];
      let tableText = `${currentTable.title}\n\n`;
      tableText += "CV-code\tContractuele voorwaarde\tBronvermelding\n";
      currentTable.data.forEach(row => {
        tableText += `${row.code}\t${row.criterion}\t${row.bronvermelding || ''}\n`;
      });
      
      await navigator.clipboard.writeText(tableText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('arbeidsomstandigheden')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'arbeidsomstandigheden' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            💼 Arbeidsomstandigheden
          </button>
          <button 
            onClick={() => setActiveTab('sociale')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'sociale' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🤝 Sociale normen
          </button>
          <button 
            onClick={() => setActiveTab('milieunormen')}
            className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'milieunormen' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🌱 Milieunormen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
          <h5 className="font-medium text-gray-900">
            {tables[activeTab].title}
          </h5>
          <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded transition-colors group"
            title={isCopied ? "Gekopieerd!" : "Kopieer tabel naar klembord"}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">
                  CV-code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Contractuele voorwaarde
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-80">
                  <div className="flex items-center gap-1">
                    <span>Bronvermelding</span>
                    <div className="relative">
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" 
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          });
                          setShowTooltip(true);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables[activeTab].data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 w-24">
                    {row.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.criterion}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 w-80">
                    {row.bronvermelding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> {getTipContent(activeTab)}
        </p>
      </div>
      
      {showTooltip && createPortal(
        <div 
          className="fixed w-80 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: tooltipPosition.x - 160,
            top: tooltipPosition.y - 200,
          }}
        >
          <div className="mb-2 font-semibold text-sm">Bronvermelding</div>
          <p>{getTooltipContent(activeTab)}</p>
          <div 
            className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
            style={{
              left: '50%',
              top: '100%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>,
        document.body
      )}
    </div>
  );
};

const Results: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isStealthMode } = useStealthMode();

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
      title: "Type opdracht",
      level: "basis",
      description: (
        <>
          Bij aanbestedingen voor kantoormeubilair wordt vaak automatisch gekozen voor nieuw meubilair, zonder dat bewust wordt gekeken naar andere duurzame opties. De GPP-criteria vragen je om deze keuze bewust te maken aan de hand van duurzaamheidsoverwegingen. GPP onderscheidt drie soorten opdrachten:
          <br /><br />
          - <strong>Nieuw meubilair:</strong> productie van nieuwe meubels met milieuvriendelijke materialen en processen.<br />
          - <strong>Refurbished meubilair:</strong> bestaande meubels worden opgeknapt, aangepast of opnieuw gestoffeerd.<br />
          - <strong>End-of-life verwerking:</strong> afvoer, hergebruik of recycling van oude meubels.
          <br /><br />
          Door vooraf na te denken over welk type opdracht het beste past bij de doelstelling en context van je organisatie, voldoe je aan de verplichting van de EED én stuur je gericht op milieu-impact.
        </>
      ),
      expandedInfo: (
        <TypeOpdrachtExamples />
      ),
      hideCopyButton: true,
      hideLevelBadge: true
    },
    {
      title: "Functionele behoefte",
      level: "basis",
      description: "In deze stap beschrijf je wat het meubilair functioneel moet kunnen. Denk aan ergonomie, comfort, onderhoudsgemak, aanpasbaarheid (bijv. modulair), gebruiksduur of geschiktheid voor intensief gebruik. Door deze eisen slim te formuleren, kun je sturen op duurzaamheid zonder over te specificeren. Zo voorkom je dat duurzaamheid botst met functionele eisen, en vergroot je de ruimte voor innovatieve oplossingen.",
      expandedInfo: (
        <FunctioneleBehoefteExamples />
      ),
      hideCopyButton: true,
      hideLevelBadge: true
    },
    {
      title: "Levenscyclusbenadering",
      level: "basis",
      description: "De levenscyclusbenadering kijkt verder dan alleen de aanschafprijs. Je houdt hierbij rekening met de milieu-impact en kosten over de hele levensduur van het meubilair: van grondstoffenwinning en productie, tot gebruik, onderhoud en afdanking. Door in deze fase al levensduur, repareerbaarheid en hergebruik mee te nemen, kun je sturen op lagere milieukosten en minder verspilling.",
      expandedInfo: (
        <LevenscyclusbenaderingExamples />
      ),
      hideCopyButton: true,
      hideLevelBadge: true
    },
    {
      title: "Reikwijdte van de opdracht",
      level: "basis",
      description: "De reikwijdte bepaalt welke producten, diensten en nevenactiviteiten binnen de aanbesteding vallen. Bij kantoorinrichting kun je denken aan losse meubels, vaste inrichting, transport, plaatsing, onderhoud, en afvoer van bestaand meubilair. Door de reikwijdte slim te kiezen, vergroot je de impact op circulariteit en milieu, én kun je beter sturen op samenhangende prestaties. De Europese GPP-criteria helpen bij het expliciteren van een duurzame scope.",
      expandedInfo: (
        <ReikwijdteOpdrachtExamples />
      ),
      hideCopyButton: true,
      hideLevelBadge: true
    }
  ];



  const sampleTechnischeSpecificaties = [
    {
      title: "GPP-criteria voor meubilair",
      level: "basis",
      description: "De onderstaande technische specificaties zijn gebaseerd op de officiële EU GPP-criteria voor meubilair. Deze vormen de juridisch bindende ondergrens voor je aanbesteding.",
      expandedInfo: (
        <TechnischeSpecificatiesTables />
      ),
      hideCopyButton: true,
      hideLevelBadge: true
    }
  ];

  const sampleContractueleUitvoeringsvoorwaarden = [
    {
      title: "Arbeidsomstandigheden",
      level: "basis",
      description: "Naleving van veiligheidsvoorschriften tijdens uitvoering",
      expandedInfo: (
        <div className="space-y-3">
          <p>Voorbeelden van arbeidsomstandigheden eisen:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Gebruik van persoonlijke beschermingsmiddelen (PBM's)</li>
            <li>Toezicht op veilige werkomstandigheden op locatie</li>
            <li>Voldoende instructie en training voor uitvoerend personeel</li>
          </ul>
        </div>
      )
    },
    {
      title: "Sociale normen",
      level: "gemiddeld", 
      description: "Eerlijke arbeidsvoorwaarden en geen kinderarbeid",
      expandedInfo: (
        <div className="space-y-3">
          <p>Voorbeelden van sociale normen eisen:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Betaling van ten minste het lokale minimumloon</li>
            <li>Transparantie over herkomst van personeel</li>
            <li>Uitsluiting van leveranciers die kinderarbeid toestaan</li>
          </ul>
        </div>
      )
    },
    {
      title: "Milieunormen",
      level: "streng",
      description: "Minimale milieu-impact tijdens uitvoering",
      expandedInfo: (
        <div className="space-y-3">
          <p>Voorbeelden van milieunormen eisen:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Gebruik van emissievrij transport tijdens levering</li>
            <li>Afvalscheiding en hergebruik van verpakkingen</li>
            <li>Gebruik van milieuvriendelijke middelen bij reiniging/installatie</li>
          </ul>
        </div>
      )
    }
  ];



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
                {estimationAnswer === 'no' ? (
                  'Geen EED verplichtingen'
                ) : (
                  <>
                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                    Let op: Meerdere verplichtingen
                  </>
                )}
              </h1>
            </div>

          </div>

          {/* User Input Summary - integrated */}
          {(organizationType || estimationAnswer) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Uw keuzes
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

        {/* EED Disclaimer - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationDuration: '1000ms' }}>
            <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 leading-relaxed">
                Concludeert u dat onderstaande EED verplichtingen niet haalbaar zijn? Dan moet dit onderbouwd worden gedocumenteerd in het inkoopdossier. Op basis van artikel 2.98 Aw 2012 controleert de Europese Commissie steekproefsgewijs of uw motivering steekhoudend is.
              </p>
            </div>
          </div>
        )}

        {/* EED Section - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="space-y-4 animate-fade-in mb-8" style={{ animationDelay: '550ms', animationDuration: '1200ms' }}>
            {/* EU EED Criteria Banner with EED heading and content */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Overzicht algemene EED verplichtingen <span className="text-red-600 font-semibold">NOTE TO SELF: ALLEEN INDIEN GEEN GPP VAN TOEPASSING</span></h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    EED
                  </span>
                  <svg className="h-6 w-auto" style={{height: '24px'}} id="Layer_2_EU_EED" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 92.01 55.11">
                  <defs>
                    <style>
                      {`.cls-1-eu-eed { fill: none; } .cls-2-eu-eed { fill: #314199; } .cls-3-eu-eed { fill: #f8ec26; } .cls-4-eu-eed { clip-path: url(#clippath-eu-eed); }`}
                    </style>
                    <clipPath id="clippath-eu-eed">
                      <rect className="cls-1-eu-eed" x="0" width="92.01" height="55.11" rx="8.77" ry="8.77"/>
                    </clipPath>
                  </defs>
                  <g id="Flag-EU-EED">
                    <g className="cls-4-eu-eed">
                      <g>
                        <rect className="cls-2-eu-eed" x=".05" y="-.64" width="91.91" height="56.67"/>
                        <g>
                          <polygon className="cls-3-eu-eed" points="45.99 43.82 46.73 46.03 49 46.02 47.39 47.24 47.83 49.61 45.99 48.27 44.13 49.58 44.58 47.24 42.99 46.02 45.25 46.02 45.99 43.82"/>
                          <polygon className="cls-3-eu-eed" points="45.99 5.49 46.73 7.7 49 7.7 47.39 8.91 47.83 11.28 45.99 9.94 44.13 11.25 44.58 8.91 42.99 7.69 45.25 7.69 45.99 5.49"/>
                          <polygon className="cls-3-eu-eed" points="55.22 7.96 55.96 10.16 58.23 10.16 56.62 11.38 57.07 13.75 55.22 12.4 53.36 13.71 53.81 11.38 52.22 10.15 54.49 10.15 55.22 7.96"/>
                          <polygon className="cls-3-eu-eed" points="36.31 7.96 37.05 10.16 39.32 10.16 37.71 11.38 38.16 13.75 36.31 12.4 34.45 13.71 34.9 11.38 33.31 10.15 35.58 10.15 36.31 7.96"/>
                          <polygon className="cls-3-eu-eed" points="55.22 41.23 55.96 43.44 58.23 43.43 56.62 44.65 57.07 47.02 55.22 45.68 53.36 46.99 53.81 44.65 52.22 43.43 54.49 43.43 55.22 41.23"/>
                          <polygon className="cls-3-eu-eed" points="36.31 41.23 37.05 43.44 39.32 43.43 37.71 44.65 38.16 47.02 36.31 45.68 34.45 46.99 34.9 44.65 33.31 43.43 35.58 43.43 36.31 41.23"/>
                          <polygon className="cls-3-eu-eed" points="29.24 15.19 29.98 17.4 32.25 17.39 30.64 18.61 31.08 20.98 29.24 19.64 27.38 20.95 27.83 18.61 26.24 17.39 28.51 17.39 29.24 15.19"/>
                          <polygon className="cls-3-eu-eed" points="62.52 15.19 63.27 17.4 65.54 17.39 63.92 18.61 64.37 20.98 62.52 19.64 60.67 20.95 61.12 18.61 59.52 17.39 61.79 17.39 62.52 15.19"/>
                          <polygon className="cls-3-eu-eed" points="29.24 34.32 29.98 36.53 32.25 36.52 30.64 37.74 31.08 40.11 29.24 38.77 27.38 40.08 27.83 37.74 26.24 36.52 28.51 36.52 29.24 34.32"/>
                          <polygon className="cls-3-eu-eed" points="62.52 34.32 63.27 36.53 65.54 36.52 63.92 37.74 64.37 40.11 62.52 38.77 60.67 40.08 61.12 37.74 59.52 36.52 61.79 36.52 62.52 34.32"/>
                          <polygon className="cls-3-eu-eed" points="27.04 24.68 27.79 26.89 30.06 26.89 28.45 28.11 28.89 30.47 27.04 29.13 25.19 30.44 25.64 28.11 24.04 26.88 26.31 26.88 27.04 24.68"/>
                          <polygon className="cls-3-eu-eed" points="64.96 24.68 65.7 26.89 67.97 26.89 66.36 28.11 66.8 30.47 64.96 29.13 63.1 30.44 63.55 28.11 61.96 26.88 64.22 26.88 64.96 24.68"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                </div>
              </div>
              <p className="text-gray-700">
                Vanwege de gekozen CPV-code bent u verplicht om de <a href="https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX%3A32012L0027" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Energy Efficiency Directive (EED)</a> te volgen.
              </p>
            </div>
            
            <Accordion 
              type="multiple" 
              className="space-y-4"
              value={openAccordions}
              onValueChange={setOpenAccordions}
            >
              {/* Bepaling scope opdracht - EED */}
              <AccordionItem value="eed-bepaling-scope" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Bepaling scope opdracht</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        EED
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-3">Wat je doet in deze fase:</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Vaststellen van de opdracht en het doel ervan</li>
                        <li>Opstellen van het programma van eisen (PvE)</li>
                        <li>Kiezen van de aanbestedingsstrategie (bijv. EMVI, laagste prijs, functioneel specificeren)</li>
                        <li>Bepalen of en hoe duurzaamheid wordt meegenomen — en dus hoe je invulling geeft aan de EED/GPP-verplichting</li>
                      </ul>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-yellow-800"><strong>📌 Let op:</strong> De EU EED-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor de bepaling scope opdracht omdat deze helpen om duurzaamheidsdoelen te realiseren.</p>
                      </div>
                    </div>
                    {sampleBepalingScope.map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Publicatie op Tendernet - EED */}
              <AccordionItem value="eed-publicatie-tendernet" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                                          <span className="text-lg font-semibold">Rapportage op TenderNed</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        EED
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Verplicht
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-3 font-medium">U moet in TenderNed rapporteren:</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Hoe het energie-efficiëntie-eerst-beginsel is toegepast.</li>
                      </ul>
                      <p className="mb-3 font-medium">OF</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Waarom het energie-efficiëntie-eerst-beginsel niet is toegepast.</li>
                      </ul>
                      <p className="mb-4">
                        Aanbestedende diensten moeten in TenderNed rapporteren hoe zij het energie-efficiëntie-eerst-beginsel hebben toegepast.
                      </p>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                        <p className="text-red-800"><strong>⚠️ Let op:</strong> De rapportage in TenderNed over het (niet) toepassen van het energie-efficiëntie-eerst-beginsel is verplicht voor deze aanbesteding. Op basis van artikel 2.98 Aw 2012 controleert de Europese Commissie steekproefsgewijs of uw motivering steekhoudend is.</p>
                      </div>
                      
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 transition-colors mb-3 group">
                            <span className="group-data-[state=open]:hidden">Toon voorbeelden</span>
                            <span className="group-data-[state=closed]:hidden">Verberg voorbeelden</span>
                            <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <TenderNetExamples />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* GPP Section - only show if above threshold */}
        {estimationAnswer !== 'no' && (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '600ms', animationDuration: '1200ms' }}>
            {/* EU GPP Criteria Banner with GPP heading and content */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Overzicht GPP verplichtingen</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    GPP
                  </span>
                  <svg className="h-6 w-auto" style={{height: '24px'}} id="Layer_2_EU" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 92.01 55.11">
                  <defs>
                    <style>
                      {`.cls-1-eu { fill: none; } .cls-2-eu { fill: #314199; } .cls-3-eu { fill: #f8ec26; } .cls-4-eu { clip-path: url(#clippath-eu); }`}
                    </style>
                    <clipPath id="clippath-eu">
                      <rect className="cls-1-eu" x="0" width="92.01" height="55.11" rx="8.77" ry="8.77"/>
                    </clipPath>
                  </defs>
                  <g id="Flag-EU">
                    <g className="cls-4-eu">
                      <g>
                        <rect className="cls-2-eu" x=".05" y="-.64" width="91.91" height="56.67"/>
                        <g>
                          <polygon className="cls-3-eu" points="45.99 43.82 46.73 46.03 49 46.02 47.39 47.24 47.83 49.61 45.99 48.27 44.13 49.58 44.58 47.24 42.99 46.02 45.25 46.02 45.99 43.82"/>
                          <polygon className="cls-3-eu" points="45.99 5.49 46.73 7.7 49 7.7 47.39 8.91 47.83 11.28 45.99 9.94 44.13 11.25 44.58 8.91 42.99 7.69 45.25 7.69 45.99 5.49"/>
                          <polygon className="cls-3-eu" points="55.22 7.96 55.96 10.16 58.23 10.16 56.62 11.38 57.07 13.75 55.22 12.4 53.36 13.71 53.81 11.38 52.22 10.15 54.49 10.15 55.22 7.96"/>
                          <polygon className="cls-3-eu" points="36.31 7.96 37.05 10.16 39.32 10.16 37.71 11.38 38.16 13.75 36.31 12.4 34.45 13.71 34.9 11.38 33.31 10.15 35.58 10.15 36.31 7.96"/>
                          <polygon className="cls-3-eu" points="55.22 41.23 55.96 43.44 58.23 43.43 56.62 44.65 57.07 47.02 55.22 45.68 53.36 46.99 53.81 44.65 52.22 43.43 54.49 43.43 55.22 41.23"/>
                          <polygon className="cls-3-eu" points="36.31 41.23 37.05 43.44 39.32 43.43 37.71 44.65 38.16 47.02 36.31 45.68 34.45 46.99 34.9 44.65 33.31 43.43 35.58 43.43 36.31 41.23"/>
                          <polygon className="cls-3-eu" points="29.24 15.19 29.98 17.4 32.25 17.39 30.64 18.61 31.08 20.98 29.24 19.64 27.38 20.95 27.83 18.61 26.24 17.39 28.51 17.39 29.24 15.19"/>
                          <polygon className="cls-3-eu" points="62.52 15.19 63.27 17.4 65.54 17.39 63.92 18.61 64.37 20.98 62.52 19.64 60.67 20.95 61.12 18.61 59.52 17.39 61.79 17.39 62.52 15.19"/>
                          <polygon className="cls-3-eu" points="29.24 34.32 29.98 36.53 32.25 36.52 30.64 37.74 31.08 40.11 29.24 38.77 27.38 40.08 27.83 37.74 26.24 36.52 28.51 36.52 29.24 34.32"/>
                          <polygon className="cls-3-eu" points="62.52 34.32 63.27 36.53 65.54 36.52 63.92 37.74 64.37 40.11 62.52 38.77 60.67 40.08 61.12 37.74 59.52 36.52 61.79 36.52 62.52 34.32"/>
                          <polygon className="cls-3-eu" points="27.04 24.68 27.79 26.89 30.06 26.89 28.45 28.11 28.89 30.47 27.04 29.13 25.19 30.44 25.64 28.11 24.04 26.88 26.31 26.88 27.04 24.68"/>
                          <polygon className="cls-3-eu" points="64.96 24.68 65.7 26.89 67.97 26.89 66.36 28.11 66.8 30.47 64.96 29.13 63.1 30.44 63.55 28.11 61.96 26.88 64.22 26.88 64.96 24.68"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                </div>
              </div>
              <p className="text-gray-700">
                Vanwege de gekozen CPV code bent u volgens de EED verplicht om de <a href="https://green-forum.ec.europa.eu/green-business/green-public-procurement/gpp-criteria-and-requirements_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">EU Green Public Procurement (GPP)-criteria</a> toe te passen. Er zijn verplichte en niet verplichte aanbevelingen voor uw leidraad.
              </p>
            </div>
            
            <Accordion 
              type="multiple" 
              className="space-y-4"
              value={openAccordions}
              onValueChange={setOpenAccordions}
            >
              {/* Bepaling scope opdracht */}
              <AccordionItem value="bepaling-scope" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Bepaling scope opdracht</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        GPP
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-3">Wat je doet in deze fase:</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Vaststellen van de opdracht en het doel ervan</li>
                        <li>Opstellen van het programma van eisen (PvE)</li>
                        <li>Kiezen van de aanbestedingsstrategie (bijv. EMVI, laagste prijs, functioneel specificeren)</li>
                        <li>Bepalen of en hoe duurzaamheid wordt meegenomen — en dus hoe je invulling geeft aan de EED/GPP-verplichting</li>
                      </ul>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-yellow-800"><strong>📌 Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor de bepaling scope opdracht omdat deze helpen om duurzaamheidsdoelen te realiseren.</p>
                      </div>
                    </div>
                    {sampleBepalingScope.map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Technische specificaties */}
              <AccordionItem value="technische-specificaties" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Technische specificaties</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        GPP
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Verplicht
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Bij deze aanbesteding moeten de Europese GPP-criteria uitdrukkelijk worden opgenomen als technische specificaties. Ze vormen de ondergrens waaraan geleverd meubilair moet voldoen. Door deze eisen expliciet in het bestek op te nemen, voldoe je aan de verplichting uit de Energie-Efficiëntierichtlijn (EED).</p>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                        <p className="text-red-800">
                          ⚠️ <strong>Let op:</strong> De minimale technische specificaties uit de GPP criteria zijn verplicht voor deze aanbesteding.
                        </p>
                      </div>
                      <p>Kopieer de tabel hier onder letterlijk in je bestek of verwijs naar <a href="https://green-forum.ec.europa.eu/green-business/green-public-procurement/gpp-criteria-and-requirements_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">de officiële EU GPP-meubilaircriteria</a>.</p>
                    </div>
                    <TechnischeSpecificatiesTables />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Gunningscriteria */}
              <AccordionItem value="gunningscriteria" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Gunningscriteria</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        GPP
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Gebruik gunningscriteria om bepaalde prestaties extra te belonen. De onderstaande voorbeelden zijn optioneel en helpen je aanbesteding aan te laten sluiten op je ambities.</p>
                      <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">📌 <strong>Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor gunningscriteria omdat deze helpen om duurzaamheidsdoelen te realiseren.</p>
                      </div>
                    </div>
                    <GunningscriteriaTable />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contractuele uitvoeringsvoorwaarden */}
              <AccordionItem value="contractuele-uitvoeringsvoorwaarden" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Contractuele uitvoeringsvoorwaarden</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        GPP
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">De toepasselijke GPP-criteria bevatten aanbevelingen voor contractuele voorwaarden op het gebied van arbeidsomstandigheden, sociale normen en milieunormen. Deze zijn niet verplicht, maar dragen bij aan circulaire of klimaatvriendelijke doelstellingen en sluiten aan bij het Rijksbeleid voor maatschappelijk verantwoord inkopen.</p>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-yellow-800">
                          📌 <strong>Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor contractuele uitvoeringsvoorwaarden omdat deze helpen om duurzaamheidsdoelen te realiseren.
                        </p>
                      </div>
                    </div>
                    <ContractueleUitvoeringsvoorwaardenTable />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Duplicate MVI Expandable Sections */}
        {estimationAnswer !== 'no' && (
          <div className="space-y-4 animate-fade-in mt-8" style={{ animationDelay: '1000ms', animationDuration: '1200ms' }}>
            {/* MVI Criteria Banner with MVI heading and content */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Overzicht MVI criteria</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    MVI
                  </span>
                  <svg className="h-6 w-auto" style={{height: '24px'}} id="Layer_2_NL" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 92.01 55.11">
                  <defs>
                    <style>
                      {`.cls-1-nl { fill: #ae1c28; } .cls-2-nl { fill: #fff; } .cls-3-nl { fill: none; } .cls-4-nl { fill: #21468b; } .cls-5-nl { clip-path: url(#clippath-dutch); }`}
                    </style>
                    <clipPath id="clippath-dutch">
                      <rect className="cls-3-nl" x="0" width="92.01" height="55.11" rx="8.77" ry="8.77"/>
                    </clipPath>
                  </defs>
                  <g id="Flag-NL">
                    <g className="cls-5-nl">
                      <g>
                        <rect className="cls-4-nl" x="-3.74" y="36.65" width="99.5" height="18.46"/>
                        <rect className="cls-2-nl" x="-3.74" y="18.16" width="99.5" height="18.48"/>
                        <rect className="cls-1-nl" x="-3.74" width="99.5" height="18.16"/>
                      </g>
                    </g>
                  </g>
                </svg>
                </div>
              </div>
              <p className="text-gray-700">
                Vanwege de gekozen CPV code bent u verplicht om de criteria voor Maatschappelijk verantwoord inkopen toe te passen.
              </p>
            </div>
            
            <Accordion 
              type="multiple" 
              className="space-y-4"
              value={openAccordions}
              onValueChange={setOpenAccordions}
            >
              {/* Bepaling scope opdracht - MVI */}
              <AccordionItem value="mvi-bepaling-scope" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Bepaling scope opdracht</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        MVI
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-3">Wat je doet in deze fase:</p>
                      <ul className="list-disc list-inside mb-4 space-y-1">
                        <li>Vaststellen van de opdracht en het doel ervan</li>
                        <li>Opstellen van het programma van eisen (PvE)</li>
                        <li>Kiezen van de aanbestedingsstrategie (bijv. EMVI, laagste prijs, functioneel specificeren)</li>
                        <li>Bepalen of en hoe duurzaamheid wordt meegenomen — en dus hoe je invulling geeft aan de EED/GPP-verplichting</li>
                      </ul>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-yellow-800"><strong>📌 Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor de bepaling scope opdracht omdat deze helpen om duurzaamheidsdoelen te realiseren.</p>
                      </div>
                    </div>
                    {sampleBepalingScope.map((item, index) => (
                      <ExpandableInfo key={index} {...item} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Technische specificaties - MVI */}
              <AccordionItem value="mvi-technische-specificaties" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Technische specificaties</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        MVI
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Verplicht
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Bij deze aanbesteding moeten de Europese GPP-criteria uitdrukkelijk worden opgenomen als technische specificaties. Ze vormen de ondergrens waaraan geleverd meubilair moet voldoen. Door deze eisen expliciet in het bestek op te nemen, voldoe je aan de verplichting uit de Energie-Efficiëntierichtlijn (EED).</p>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                        <p className="text-red-800">
                          ⚠️ <strong>Let op:</strong> De minimale technische specificaties uit de GPP criteria zijn verplicht voor deze aanbesteding.
                        </p>
                      </div>
                      <p>Kopieer de tabel hier onder letterlijk in je bestek of verwijs naar <a href="https://green-forum.ec.europa.eu/green-business/green-public-procurement/gpp-criteria-and-requirements_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">de officiële EU GPP-meubilaircriteria</a>.</p>
                    </div>
                    <TechnischeSpecificatiesTables />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Gunningscriteria - MVI */}
              <AccordionItem value="mvi-gunningscriteria" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Gunningscriteria</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        MVI
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">Gebruik gunningscriteria om bepaalde prestaties extra te belonen. De onderstaande voorbeelden zijn optioneel en helpen je aanbesteding aan te laten sluiten op je ambities.</p>
                      <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">📌 <strong>Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor gunningscriteria omdat deze helpen om duurzaamheidsdoelen te realiseren.</p>
                      </div>
                    </div>
                    <GunningscriteriaTable />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contractuele uitvoeringsvoorwaarden - MVI */}
              <AccordionItem value="mvi-contractuele-uitvoeringsvoorwaarden" className="bg-white rounded-xl shadow-sm border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-semibold">Contractuele uitvoeringsvoorwaarden</span>
                    <div className="flex items-center gap-3 mr-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        MVI
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full min-w-[100px] text-center">
                        Aanbevolen
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-gray-600 mb-4">
                      <p className="mb-4">De toepasselijke GPP-criteria bevatten aanbevelingen voor contractuele voorwaarden op het gebied van arbeidsomstandigheden, sociale normen en milieunormen. Deze zijn niet verplicht, maar dragen bij aan circulaire of klimaatvriendelijke doelstellingen en sluiten aan bij het Rijksbeleid voor maatschappelijk verantwoord inkopen.</p>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-yellow-800">
                          📌 <strong>Let op:</strong> De EU GPP-criteria geven deze <strong>niet verplichte</strong> aanbevelingen voor contractuele uitvoeringsvoorwaarden omdat deze helpen om duurzaamheidsdoelen te realiseren.
                        </p>
                      </div>
                    </div>
                    <ContractueleUitvoeringsvoorwaardenTable />
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
