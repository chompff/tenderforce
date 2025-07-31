import React from 'react';

const AboutEEDTool: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 pt-24 pb-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">About EED TOOL</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your comprehensive solution for EU Energy Efficiency Directive compliance. 
                Automated assessment and guidance for sustainable procurement requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Mission Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    EED TOOL was created to simplify compliance with the EU Energy Efficiency Directive (EED) 
                    for procurement professionals across Europe.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We believe that energy efficiency requirements should be accessible and easy to implement, 
                    helping organizations meet their sustainability goals while ensuring regulatory compliance.
                  </p>
                </div>
                <div className="bg-green-50 p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">Our Core Values</h3>
                  <ul className="space-y-3 text-green-800">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Sustainability & compliance
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Accessibility & ease of use
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Innovation in green procurement
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Evidence-based recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* What We Do Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Do</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance Assessment</h3>
                  <p className="text-gray-600">
                    Automated analysis of your procurement requirements against EU Energy Efficiency Directive obligations.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">GPP Criteria Integration</h3>
                  <p className="text-gray-600">
                    Direct access to EU Green Public Procurement (GPP) criteria relevant to your specific procurement needs.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Energy Efficiency Guidance</h3>
                  <p className="text-gray-600">
                    Step-by-step guidance on implementing energy efficiency requirements in your procurement process.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
                  <p className="text-gray-600">
                    Access to sustainability and procurement experts for complex compliance questions.
                  </p>
                </div>
              </div>
            </section>

            {/* Technology Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Technology</h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  EED TOOL is built on a comprehensive database of EU energy efficiency requirements, 
                  Green Public Procurement criteria, and best practices from across Europe.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">27</div>
                    <div className="text-sm text-gray-600">EU Member States Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">GPP Criteria Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
                    <div className="text-sm text-gray-600">Compliance Updates</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Journey</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-6">
                    <span className="text-green-600 font-semibold">2023</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Initiation</h3>
                    <p className="text-gray-600">
                      Development began following the updated EU Energy Efficiency Directive, 
                      recognizing the need for better compliance tools in public procurement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                    <span className="text-blue-600 font-semibold">2024</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Beta Testing</h3>
                    <p className="text-gray-600">
                      Extensive testing with procurement professionals across Europe. 
                      Refinement of algorithms and user interface based on real-world feedback.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-6">
                    <span className="text-purple-600 font-semibold">2025</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Public Launch</h3>
                    <p className="text-gray-600">
                      Official launch of EED TOOL with comprehensive coverage of EU energy efficiency requirements 
                      and integrated GPP criteria for sustainable procurement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your EED Compliance?</h2>
                <p className="text-xl mb-6">
                  Discover how EED TOOL can streamline your energy efficiency procurement processes.
                </p>
                <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Your Assessment
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default AboutEEDTool;