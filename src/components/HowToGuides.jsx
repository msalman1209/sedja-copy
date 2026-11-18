import React from 'react';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { HOW_TO_GUIDES } from '../data/toolsData';

export default function HowToGuides({ onSelectTool }) {
  return (
    <section className="bg-slate-50 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Step-by-Step Tutorials</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How-to PDF Guides
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Learn how to solve common document challenges easily with our completely free browser tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOW_TO_GUIDES.map((guide, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Quick Guide</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onSelectTool(guide.toolId)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 group"
                >
                  <span>Launch this tool now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

