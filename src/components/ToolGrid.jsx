import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { POPULAR_TOOLS, TOOL_CATEGORIES } from '../data/toolsData';

export default function ToolGrid({ onSelectTool }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Popular', 'Merge & Split', 'Edit & Sign', 'Convert', 'Page & Layout'];

  // Filter tools based on selected tab
  let displayTools = [];
  if (selectedCategory === 'All') {
    displayTools = POPULAR_TOOLS;
  } else if (selectedCategory === 'Popular') {
    displayTools = POPULAR_TOOLS.filter((t) => t.badge === 'Popular');
  } else {
    const matchedCategory = TOOL_CATEGORIES.find((c) =>
      c.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    if (matchedCategory) {
      displayTools = matchedCategory.tools.map((ct) => {
        const fullTool = POPULAR_TOOLS.find((pt) => pt.id === ct.id);
        return (
          fullTool || {
            id: ct.id,
            name: ct.name,
            desc: ct.desc,
            icon: 'FileText',
            category: matchedCategory.name
          }
        );
      });
    } else {
      displayTools = POPULAR_TOOLS;
    }
  }

  // Render dynamic Lucide icon
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.FileText;
    return <IconComponent className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Tabs */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative bg-white border border-gray-200/80 rounded-xl p-5 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card top with icon and optional badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  {renderIcon(tool.icon || 'FileText')}
                </div>
                {tool.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {tool.desc}
              </p>
            </div>

            {/* Bottom action trigger */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Open Tool</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

