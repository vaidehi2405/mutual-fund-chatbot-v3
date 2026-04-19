import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import { Bot, ChevronRight, PieChart, ShieldCheck, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white font-inter text-[#44475b]">
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-groww-emerald rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#44475b]">Groww</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-groww-emerald transition-colors">Mutual Funds</a>
            <a href="#" className="hover:text-groww-emerald transition-colors">Stocks</a>
            <a href="#" className="hover:text-groww-emerald transition-colors">Pricing</a>
            <a href="#" className="hover:text-groww-emerald transition-colors">Learn</a>
          </div>
          <button className="px-5 py-2 bg-groww-emerald text-white rounded-lg text-sm font-bold shadow-lg shadow-groww-emerald/20 hover:scale-105 transition-all">
            Login/Register
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-groww-light rounded-full text-groww-emerald text-xs font-bold uppercase tracking-wider">
              Trusted by 50M+ Indians
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#44475b]">
              Investing <br /> 
              <span className="text-groww-emerald text-stroke">Made Easy.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
              Open a free demat account in minutes. Invest in Direct Mutual Funds, Stocks, and IPOs with zero account opening depth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-groww-emerald text-white rounded-xl text-lg font-bold shadow-xl shadow-groww-emerald/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-100 rounded-xl text-lg font-bold text-[#44475b] hover:bg-gray-50 transition-all">
                How it works
              </button>
            </div>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-groww-emerald/5 rounded-full blur-[80px]"></div>
            <div className="relative bg-white border border-gray-100 p-8 rounded-[40px] shadow-2xl skew-y-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-100 rounded-full"></div>
                  <div className="h-8 w-8 bg-groww-light rounded-full"></div>
                </div>
                <div className="h-64 w-full bg-groww-light/30 rounded-3xl flex items-center justify-center overflow-hidden">
                   <div className="w-48 h-48 border-8 border-groww-emerald/20 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 border-8 border-groww-emerald rounded-full"></div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-50 rounded-2xl"></div>
                  <div className="h-20 bg-gray-50 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Area */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why millions choose Groww?</h2>
          <p className="text-gray-500 font-medium">Built for the next generation of investors.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure & Regulated", desc: "SEBI & CDSL registered. Bank-grade security." },
            { icon: <Zap className="w-6 h-6" />, title: "Fast Onboarding", desc: "Go paperless and start investing in under 5 minutes." },
            { icon: <PieChart className="w-6 h-6" />, title: "Unified Dashboard", desc: "Track all your MF, Stocks, and FD portfolio in one place." }
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-groww-light text-groww-emerald rounded-xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="group relative w-16 h-16 bg-groww-emerald rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-groww-emerald rounded-full animate-ping opacity-25"></div>
            <Bot className="text-white w-8 h-8 relative z-10" />
            
            {/* Tooltip */}
            <div className="absolute right-20 bg-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-[#44475b] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
              Need help? Ask AI Assistant
            </div>
          </button>
        )}
      </div>

      {/* 5. Chat Interface Modal */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[1001] w-full max-w-[420px] animate-in slide-in-from-bottom-8 slide-in-from-right-4 fade-in duration-500 zoom-in-95">
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default App;
