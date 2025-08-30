import React, { useState } from 'react';



const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: '',
    priority: '',
    subject: '',
    description: ''
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { value: 'technical', label: 'Technische problemen' },
    { value: 'billing', label: 'Facturering & abonnementen' },
    { value: 'account', label: 'Account & toegang' },
    { value: 'ai-analysis', label: 'AI-analyses & resultaten' },
    { value: 'compliance', label: 'Compliance vragen' },
    { value: 'feature', label: 'Feature verzoeken' },
    { value: 'other', label: 'Overig' }
  ];

  const priorities = [
    { value: 'low', label: 'Laag - Algemene vraag' },
    { value: 'medium', label: 'Medium - Functionaliteit beperkt' },
    { value: 'high', label: 'Hoog - Belangrijke functionaliteit niet beschikbaar' },
    { value: 'urgent', label: 'Urgent - Systeem niet toegankelijk' }
  ];

  const faqs = [
    {
      question: "Hoe accuraat zijn de EED compliance analyses?",
      answer: "Onze AI-analyses zijn gebaseerd op uitgebreide training op Nederlandse en Europese aanbestedingswetgeving. De accuraatheid is hoog voor standaard compliance checks, maar wij raden altijd aan om complexe beslissingen te verifiëren met juridische professionals. Onze AI dient als eerste screening tool, niet als vervanging voor expert advies."
    },
    {
      question: "Kan ik EED CHECK gebruiken voor projecten buiten Nederland?",
      answer: "Ja, EED CHECK ondersteunt alle EU-landen en hun Energy Efficiency Directive verplichtingen. Voor landen buiten de EU raden wij lokale expertise aan."
    },
    {
      question: "Hoe lang duurt het voordat ik een AI-analyse ontvang?",
      answer: "De meeste analyses worden binnen 30 seconden tot 2 minuten voltooid. Complexe documenten kunnen tot 5 minuten duren. Bij systeemproblemen ontvangt u automatisch een statusupdate."
    },
    {
      question: "Zijn mijn aanbestedingsdocumenten veilig?",
      answer: "Absoluut. Alle documenten worden versleuteld opgeslagen en verwerkt in EU-datacenters. Wij bewaren geen volledige documenten na analyse en gebruiken alleen geanonimiseerde data voor systeemverbetering. Zie ons privacybeleid voor details."
    },
    {
      question: "Kan ik mijn abonnement op elk moment opzeggen?",
      answer: "Ja, u kunt uw abonnement op elk moment opzeggen via uw accountinstellingen. Bij maandelijkse abonnementen stopt de facturering direct, bij jaarlijkse abonnementen aan het einde van de periode."
    },
    {
      question: "Biedt EED CHECK training of workshops aan?",
      answer: "Ja, wij bieden aangepaste training voor teams en organisaties. Neem contact op met ons sales team voor meer informatie over onze trainingsmogelijkheden."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateEmailContent = () => {
    const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
    const priorityLabel = priorities.find(prio => prio.value === formData.priority)?.label || formData.priority;
    
    const emailBody = `Beste EED CHECK Support Team,

Naam: ${formData.name}
Email: ${formData.email}
Bedrijf: ${formData.company}
Categorie: ${categoryLabel}
Prioriteit: ${priorityLabel}

Onderwerp: ${formData.subject}

Beschrijving:
${formData.description}

---
Deze email is gegenereerd via het EED CHECK support formulier.
Verwachte responstijd: ${getPriorityResponseTime(formData.priority)}

Met vriendelijke groet,
${formData.name}`;

    return encodeURIComponent(emailBody);
  };

  const getPriorityResponseTime = (priority: string) => {
    switch (priority) {
      case 'urgent': return '1-2 uur (tijdens kantooruren)';
      case 'high': return '4-8 uur (tijdens kantooruren)';
      case 'medium': return '1-2 werkdagen';
      case 'low': return '2-5 werkdagen';
      default: return '2-5 werkdagen';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.description) {
      alert('Vul alstublieft alle verplichte velden in.');
      return;
    }

    const emailContent = generateEmailContent();
    const mailtoLink = `mailto:support@eedtool.eu?subject=${encodeURIComponent(formData.subject)}&body=${emailContent}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Support & Hulp</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Wij staan klaar om u te helpen. Vind snel antwoorden op veelgestelde vragen of neem direct contact met ons op.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Quick Help Cards */}
              <div className="lg:col-span-3 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gebruikershandleiding</h3>
                    <p className="text-sm text-gray-600 mb-4">Ontdek alle functies van EED CHECK</p>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Bekijk handleiding →</a>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 002.5-2.5V6a2.5 2.5 0 00-2.5-2.5H9V10z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                    <p className="text-sm text-gray-600 mb-4">Stap-voor-stap video instructies</p>
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">Bekijk video's →</a>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h3>
                    <p className="text-sm text-gray-600 mb-4">Tips voor optimaal gebruik</p>
                    <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Lees tips →</a>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg text-center">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Pagina</h3>
                    <p className="text-sm text-gray-600 mb-4">Controleer systeem status</p>
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Bekijk status →</a>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde vragen</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact opnemen</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Naam *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrijf
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecteer categorie</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioriteit
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecteer prioriteit</option>
                        {priorities.map(prio => (
                          <option key={prio.value} value={prio.value}>{prio.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onderwerp *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beschrijving *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Beschrijf uw probleem of vraag zo gedetailleerd mogelijk..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Email versturen naar Support
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Directe contact opties:</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📧 support@eedtool.eu</p>
                      <p>📞 +31 (0)20 123 4567</p>
                      <p>🕒 Ma-Vr: 9:00-17:00 CET</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Tip:</strong> Voor snellere hulp, kies de juiste categorie en prioriteit. 
                      Bij technische problemen, vermeld uw browser en besturingssysteem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Support; 