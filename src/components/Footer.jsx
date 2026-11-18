import React from 'react';
import { Heart, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export default function Footer({ onSelectTool }) {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-7 h-7" viewBox="-479.5 280.5 252 252">
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
              <span className="text-xl font-bold text-white tracking-tight">Sejda</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                Free Copy
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              We help with your PDF tasks. Built with a passion to provide 100% free, private, and powerful PDF tools for poor families, students, and workers worldwide.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% In-Browser Privacy — Files never upload to any server</span>
            </div>
          </div>

          {/* Quick Tools Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Edit & Sign
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onSelectTool('pdf-editor')} className="hover:text-emerald-400 transition-colors">
                  PDF Editor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('sign-pdf')} className="hover:text-emerald-400 transition-colors">
                  Fill & Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('compress-pdf')} className="hover:text-emerald-400 transition-colors">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('watermark-pdf')} className="hover:text-emerald-400 transition-colors">
                  Watermark PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('encrypt-pdf')} className="hover:text-emerald-400 transition-colors">
                  Protect / Lock PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Tools Column 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Merge & Split
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onSelectTool('merge-pdf')} className="hover:text-emerald-400 transition-colors">
                  Merge PDF Files
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split-pdf')} className="hover:text-emerald-400 transition-colors">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('delete-pdf-pages')} className="hover:text-emerald-400 transition-colors">
                  Delete Pages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('crop-pdf')} className="hover:text-emerald-400 transition-colors">
                  Crop PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('rotate-pdf-pages')} className="hover:text-emerald-400 transition-colors">
                  Rotate Pages
                </button>
              </li>
            </ul>
          </div>

          {/* Conversion */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Convert & Layout
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onSelectTool('pdf-to-jpg')} className="hover:text-emerald-400 transition-colors">
                  PDF to JPG
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('jpg-to-pdf')} className="hover:text-emerald-400 transition-colors">
                  JPG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('extract-text-from-pdf')} className="hover:text-emerald-400 transition-colors">
                  PDF to Text
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('page-numbers-pdf')} className="hover:text-emerald-400 transition-colors">
                  Page Numbers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('unlock-pdf')} className="hover:text-emerald-400 transition-colors">
                  Unlock PDF
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Sejda Free Copy. Helping people worldwide with free, private PDF utilities.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300">Zero Tracking</span>
            <span className="hover:text-gray-300">No Data Storage</span>
            <span className="hover:text-gray-300">Open & Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

