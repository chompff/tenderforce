import React, { useState, useEffect } from 'react';
import '../../styles/button-overlay.css';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white border-b border-gray-100 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo - Centered */}
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <svg
              width="28"
              height="28"
              viewBox="0 0 926 851.98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path className="fill-[#002da0]" d="M926,157.99v536c0,86.41-69.37,156.62-155.45,157.98h-120.98s-373.14.01-373.14.01h0s-120.98-.01-120.98-.01C69.37,850.61,0,780.4,0,693.99V157.99C0,71.41,69.64,1.1,155.96,0h614.08c86.32,1.1,155.96,71.41,155.96,157.99Z"/>
              <polygon className="fill-[#fdcc00]" points="463.1 123.13 473.12 152.32 503.98 152.83 479.32 171.38 488.37 200.89 463.1 183.16 437.84 200.89 446.89 171.38 422.22 152.83 453.08 152.32 463.1 123.13"/>
              <polygon className="fill-[#fdcc00]" points="205.2 383.91 215.22 413.11 246.08 413.62 221.41 432.17 230.46 461.67 205.2 443.95 179.93 461.67 188.99 432.17 164.32 413.62 195.18 413.11 205.2 383.91"/>
              <polygon className="fill-[#fdcc00]" points="238.62 252.48 248.64 281.67 279.5 282.18 254.83 300.73 263.88 330.24 238.62 312.51 213.35 330.24 222.4 300.73 197.74 282.18 228.6 281.67 238.62 252.48"/>
              <polygon className="fill-[#fdcc00]" points="333.43 159.29 343.45 188.48 374.31 188.99 349.64 207.54 358.69 237.05 333.43 219.32 308.16 237.05 317.22 207.54 292.55 188.99 323.41 188.48 333.43 159.29"/>
              <polygon className="fill-[#fdcc00]" points="687.08 252.48 677.06 281.67 646.2 282.18 670.87 300.73 661.82 330.24 687.08 312.51 712.35 330.24 703.29 300.73 727.96 282.18 697.1 281.67 687.08 252.48"/>
              <polygon className="fill-[#fdcc00]" points="238.62 512.87 248.64 542.07 279.5 542.57 254.83 561.12 263.88 590.63 238.62 572.9 213.35 590.63 222.4 561.12 197.74 542.57 228.6 542.07 238.62 512.87"/>
              <polygon className="fill-[#fdcc00]" points="687.08 512.87 677.06 542.07 646.2 542.57 670.87 561.12 661.82 590.63 687.08 572.9 712.35 590.63 703.29 561.12 727.96 542.57 697.1 542.07 687.08 512.87"/>
              <polygon className="fill-[#fdcc00]" points="592.27 159.29 582.25 188.48 551.39 188.99 576.06 207.54 567 237.05 592.27 219.32 617.53 237.05 608.48 207.54 633.15 188.99 602.29 188.48 592.27 159.29"/>
              <polygon className="fill-[#fdcc00]" points="333.43 606.06 343.45 635.25 374.31 635.76 349.64 654.31 358.69 683.82 333.43 666.09 308.16 683.82 317.22 654.31 292.55 635.76 323.41 635.25 333.43 606.06"/>
              <polygon className="fill-[#fdcc00]" points="592.27 606.06 582.25 635.25 551.39 635.76 576.06 654.31 567 683.82 592.27 666.09 617.53 683.82 608.48 654.31 633.15 635.76 602.29 635.25 592.27 606.06"/>
              <polygon className="fill-[#fdcc00]" points="722.78 383.91 732.8 413.11 763.66 413.62 739 432.17 748.05 461.67 722.78 443.95 697.52 461.67 706.57 432.17 681.9 413.62 712.76 413.11 722.78 383.91"/>
              <polygon className="fill-[#fdcc00]" points="463.1 641.83 473.12 671.02 503.98 671.53 479.32 690.08 488.37 719.59 463.1 701.86 437.84 719.59 446.89 690.08 422.22 671.53 453.08 671.02 463.1 641.83"/>
            </svg>
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900 drop-shadow-sm'
              }`}>EED TOOL</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                isScrolled 
                  ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                  : 'bg-orange-100/90 text-orange-800 border border-orange-200/90 backdrop-blur-sm'
              }`}>
                BETA
              </span>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 