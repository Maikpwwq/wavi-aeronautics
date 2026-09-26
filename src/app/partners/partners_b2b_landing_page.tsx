import React from 'react';
import { 
  Rocket, 
  ShieldAlert, 
  Clock, 
  Database, 
  Headset, 
  Zap, 
  TrendingUp, 
  Target, 
  ChevronRight,
  Globe2
} from 'lucide-react';

const Navbar = () => (
  <nav className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md fixed top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Rocket className="w-6 h-6 text-cyan-500" />
        <span className="text-xl font-bold tracking-widest text-white">WAVI<span className="text-cyan-500 font-light">AERONAUTICS</span></span>
      </div>
      <a href="mailto:director@waviaeronautics.com" className="text-sm font-medium text-gray-300 hover:text-white transition-colors border border-gray-700 hover:border-cyan-500 px-4 py-2 rounded-md">
        Partner Contact
      </a>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 -z-10"></div>
    
    <div className="max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-sm font-medium mb-6">
        <Globe2 className="w-4 h-4" /> LATAM Market Expansion
      </div>
      <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
        Unlock the Colombian FPV Market. <br className="hidden lg:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Zero Friction.
        </span>
      </h1>
      <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
        Wavi Aeronautics is the premier technical and logistical bridge for top-tier FPV brands entering Latin America. We handle DIAN customs, local support, and direct API order routing.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="#partnership-models" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)]">
          View Partnership Models <ChevronRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  </section>
);

const FrictionSection = () => {
  const problems = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
      title: "Complex Customs (DIAN)",
      desc: "Arbitrary holds, high tariffs, and complex import documentation kill direct-to-consumer conversion rates in LatAm."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "20+ Day Shipping",
      desc: "Long transit times destroy impulse buys for BNF drones and urgent replacement parts (props, VTX, ELRS receivers)."
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-500" />,
      title: "Regulatory Blindspots",
      desc: "Unclear local aviation laws (RAC 100) scare off new pilots from investing in high-end equipment."
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why Global Brands Lose Market Share Here</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">The barrier to entry isn't demand; it's logistics. We eliminate the localized friction that your global fulfillment centers cannot solve.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((prob, idx) => (
            <div key={idx} className="bg-black border border-gray-800 p-8 rounded-xl hover:border-gray-600 transition-colors">
              <div className="mb-6 p-3 bg-gray-900 inline-block rounded-lg">{prob.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{prob.title}</h3>
              <p className="text-gray-400 leading-relaxed">{prob.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InfrastructureSection = () => {
  const solutions = [
    {
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      title: "API-Ready Routing",
      desc: "Our modern stack (Next.js/Firebase) is ready to ingest your CSV/JSON inventory feeds and route orders directly to your fulfillment centers via B2B dropshipping."
    },
    {
      icon: <Headset className="w-6 h-6 text-cyan-400" />,
      title: "Native Tech Support",
      desc: "Licensed UAS pilots provide first-line technical support in Spanish, reducing your global customer service overhead and RMA rates."
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Micro-Stocking Pipeline",
      desc: "We maintain local buffer inventory of high-rotation consumables (props, straps, antennas) for same-day delivery, capturing immediate local demand."
    }
  ];

  return (
    <section className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">The Wavi Infrastructure</h2>
          <p className="text-gray-400 text-lg mb-10">
            We don't just sell drones; we engineer logistics. By taking the operational and customs risk off the buyer, we create a seamless premium purchasing experience for your hardware.
          </p>
          <div className="space-y-8">
            {solutions.map((sol, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 p-2 bg-cyan-950/30 border border-cyan-900/50 rounded-lg h-fit">
                  {sol.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{sol.title}</h3>
                  <p className="text-gray-400">{sol.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          {/* Abstract representation of code/infrastructure */}
          <div className="bg-zinc-950 border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-400 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2">
              <p><span className="text-pink-500">const</span> <span className="text-blue-400">orderPayload</span> = {'{'}</p>
              <p className="pl-4">partnerId: <span className="text-green-400">'brand_tier_1'</span>,</p>
              <p className="pl-4">market: <span className="text-green-400">'CO'</span>,</p>
              <p className="pl-4">fulfillment: <span className="text-green-400">'B2B_DROPSHIP'</span>,</p>
              <p className="pl-4">items: [</p>
              <p className="pl-8">{'{\n'} sku: <span className="text-green-400">'BNF-O3-6S'</span>, qty: <span className="text-orange-400">1</span> {'\n}'},</p>
              <p className="pl-8">{'{\n'} sku: <span className="text-green-400">'PROP-51433'</span>, qty: <span className="text-orange-400">50</span>, type: <span className="text-green-400">'MICRO_STOCK'</span> {'\n}'}</p>
              <p className="pl-4">]</p>
              <p>{'}'};</p>
              <p className="text-gray-500 mt-4">// Seamless API routing directly to global warehouse</p>
              <p><span className="text-pink-500">await</span> WaviCore.<span className="text-blue-300">dispatchOrder</span>(orderPayload);</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ModelsSection = () => (
  <section id="partnership-models" className="py-24 bg-zinc-950 px-6 border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Partnership Architectures</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">We require zero initial MOQ. We trade volume commitments for aggressive local market penetration and direct ROI.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Model 1 */}
        <div className="bg-black border border-gray-800 p-8 rounded-xl hover:border-cyan-900/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">B2B Dropship Pipeline</h3>
          <p className="text-cyan-400 font-medium mb-6">Tier 1 Affiliate / Wholesale Access</p>
          <ul className="space-y-4 text-gray-400 relative z-10 mb-8">
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <span>Zero minimum order quantity (MOQ) to launch.</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <span>Direct routing of local pre-orders to your global fulfillment centers.</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <span>Wavi handles UI, payment gateways, and local buyer communications.</span>
            </li>
          </ul>
        </div>

        {/* Model 2 */}
        <div className="bg-black border border-gray-800 p-8 rounded-xl hover:border-blue-900/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-32 h-32 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Strategic Demo Sponsorship</h3>
          <p className="text-blue-400 font-medium mb-6">Brand Authority & Content ROI</p>
          <ul className="space-y-4 text-gray-400 relative z-10 mb-8">
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>Provision of latest BNF demo units at manufacturing cost or sponsored.</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>Exclusive showcasing at Colombian drone tracks and FPV events.</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>Native Spanish content creation (YouTube/IG) driving direct sales to your pipeline.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 bg-black px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-cyan-900/10 -z-10"></div>
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-white mb-6">Stop losing LatAm market share to logistics.</h2>
      <p className="text-xl text-gray-400 mb-10">Let's build a distribution pipeline. Schedule a 15-minute technical alignment call with our Project Director.</p>
      <a href="mailto:director@waviaeronautics.com?subject=Partnership Inquiry - LatAm Expansion" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
        Initiate Partnership
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black py-8 border-t border-gray-800 text-center text-gray-600 text-sm">
    <p>© {new Date().getFullYear()} Wavi Aeronautics. Licensed UAS Operations. Bogotá, Colombia.</p>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <Navbar />
      <HeroSection />
      <FrictionSection />
      <InfrastructureSection />
      <ModelsSection />
      <CTASection />
      <Footer />
    </div>
  );
}