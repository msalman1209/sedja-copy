import React, { useState } from 'react';
import { ChevronDown, Globe, Heart, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Header({ currentTool, onSelectTool, onGoHome }) {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-6">
            <button
              onClick={onGoHome}
              className="flex items-center space-x-2 text-left focus:outline-none group"
              title="Sejda PDF - Home"
            >
              {/* Exact Sejda Logo SVG */}
              <svg
                className="w-8 h-8 transition-transform group-hover:scale-105"
                viewBox="-479.5 280.5 252 252"
              >
                <circle fill="#00BB88" cx="-353.252" cy="406.252" r="120.248" />
                <path
                  fill="#FFFFFF"
                  d="M-300.633,342.973l-9.979,23.363c-17.156-9.544-34.095-13.125-45.799-12.695
                  c-15.238,0.558-24.966,6.664-24.585,17.043c1.237,33.789,84.054,12.621,85.868,68.281
                  c1.012,27.604-22.658,45.499-56.668,46.744c-24.292,0.891-47.623-8.206-64.057-22.2
                  l10.438-22.938c16.434,13.994,36.601,21.217,53.164,20.609c18.107-0.664,28.68-7.906,28.242-19.83
                  c-1.264-34.451-84.035-12.181-86.049-67.168c-0.971-26.502,21.169-43.896,54.736-45.127
                  C-335.225,328.318-315.335,334.002-300.633,342.973z"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800 tracking-tight">Sejda</span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold -mt-1">
                  100% Free
                </span>
              </div>
            </button>

            {/* "All Tools" Mega Menu Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showMegaMenu
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                <span>All Tools</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showMegaMenu ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>

            {/* Quick Tool Links matching Sejda */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('compress-pdf'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'compress-pdf' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Compress
              </button>
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('pdf-editor'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'pdf-editor' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('sign-pdf'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'sign-pdf' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Fill & Sign
              </button>
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('merge-pdf'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'merge-pdf' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Merge
              </button>
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('delete-pdf-pages'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'delete-pdf-pages' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Delete Pages
              </button>
              <button
                onClick={() => { setShowMegaMenu(false); onSelectTool('crop-pdf'); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentTool === 'crop-pdf' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                Crop
              </button>
            </nav>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
              100% Free Forever
            </span>

            <button
              onClick={() => setShowAboutModal(true)}
              className="text-sm font-medium text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors hidden sm:block"
            >
              Why Free?
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="text-sm font-medium text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors hidden sm:flex items-center space-x-1"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Overlay */}
      {showMegaMenu && (
        <MegaMenu
          onClose={() => setShowMegaMenu(false)}
          onSelectTool={(toolId) => {
            setShowMegaMenu(false);
            onSelectTool(toolId);
          }}
        />
      )}

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
            Popular Tools
          </div>
          {[
            { id: 'pdf-editor', label: 'PDF Editor' },
            { id: 'merge-pdf', label: 'Merge PDF' },
            { id: 'compress-pdf', label: 'Compress PDF' },
            { id: 'sign-pdf', label: 'Fill & Sign' },
            { id: 'delete-pdf-pages', label: 'Delete Pages' },
            { id: 'crop-pdf', label: 'Crop PDF' },
            { id: 'rotate-pdf-pages', label: 'Rotate Pages' },
            { id: 'pdf-to-jpg', label: 'PDF to JPG' },
            { id: 'jpg-to-pdf', label: 'JPG to PDF' },
            { id: 'encrypt-pdf', label: 'Protect / Lock' },
            { id: 'watermark-pdf', label: 'Watermark' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setShowMobileMenu(false);
                onSelectTool(item.id);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* About & Why Free Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Heart className="w-6 h-6 fill-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">100% Free for Everyone</h3>
                <p className="text-xs text-emerald-600 font-semibold">Mission: No Paywalls, No Limits</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3">
              <p>
                This platform was created specifically to help students, poor families, educators, and working people who cannot afford expensive Adobe Acrobat subscriptions or paid PDF tools.
              </p>
              <p className="font-semibold text-slate-800">
                🔒 Complete Local Privacy:
              </p>
              <p>
                All PDF processing happens directly in your browser. Your confidential files never upload to any server or cloud, ensuring 100% privacy and zero bandwidth consumption.
              </p>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-medium">
                ✓ Unlimited tasks &nbsp;•&nbsp; ✓ No signup required &nbsp;•&nbsp; ✓ No credit card ever &nbsp;•&nbsp; ✓ 100% Free
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="btn-sejda-primary px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

