import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export const ProjectToolbar: React.FC = () => {
  return (
    <section className="mb-10 grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
      <label className="xl:col-span-4 relative block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="What do you want to make?"
          className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#6CBAE6]/40"
        />
      </label>

      <select className="xl:col-span-2 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#6CBAE6]/40">
        <option>All products</option>
      </select>

      <select className="xl:col-span-2 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#6CBAE6]/40">
        <option>Any type</option>
      </select>

      <select className="xl:col-span-2 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#6CBAE6]/40">
        <option>Any difficulty</option>
      </select>

      <div className="xl:col-span-2 flex items-center justify-end gap-4 text-slate-600">
        <span className="text-sm">6,030 projects</span>
        <button className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
          <ArrowUpDown size={16} />
          <span className="text-sm font-medium">Trending</span>
        </button>
      </div>
    </section>
  );
};
