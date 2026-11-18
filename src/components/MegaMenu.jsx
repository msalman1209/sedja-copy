import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { TOOL_CATEGORIES, POPULAR_TOOLS } from '../data/toolsData';

export default function MegaMenu({ onClose, onSelectTool }) {
  const [search, setSearch] = useState('');

  // Filter tools based on search query
  const filteredCategories = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: cat.tools.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((cat) => cat.tools.length > 0);

  return (
    <div className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xl max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar with Search & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a tool (e.g. merge, edit, compress, watermark)..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors ml-4"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {category.name}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-1">{category.description}</p>
              </div>
              <ul className="space-y-1.5">
                {category.tools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onSelectTool(tool.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-emerald-50/70 transition-all group flex flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                          {tool.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {tool.desc}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No PDF tools matching "{search}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

