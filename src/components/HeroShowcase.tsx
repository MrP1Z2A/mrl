import React from 'react';

export const HeroShowcase: React.FC = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
      <article className="lg:col-span-4 rounded-xl bg-[#dce8ea] border border-[#c4d4d8] p-6 min-h-[220px] flex flex-col justify-between">
        <div>
          <p className="text-4xl font-semibold tracking-tight text-slate-700 leading-tight">Everything</p>
          <p className="text-4xl font-semibold tracking-tight text-slate-700 leading-tight">you need to</p>
          <p className="text-5xl font-bold tracking-tight text-slate-700 leading-tight">get started</p>
        </div>
        <button className="w-fit rounded-full bg-[#0f8b95] hover:bg-[#0f7a83] text-white px-8 py-2.5 text-2xl font-bold tracking-wide transition-colors">
          Explore Docs
        </button>
      </article>

      <article className="lg:col-span-8 rounded-xl bg-gradient-to-r from-[#eceff2] via-[#e8edf0] to-[#d7c7ef] border border-[#e0e6ea] p-6 min-h-[220px] flex flex-col justify-between overflow-hidden relative">
        <div className="absolute -right-10 -bottom-8 h-44 w-44 rounded-full bg-[#6CBAE6]/30 blur-2xl" />
        <div className="relative">
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-700">Arduino VENTUNO Q</h2>
          <p className="mt-2 text-3xl text-slate-600">Where AI takes action.</p>
        </div>
        <button className="relative w-fit rounded-full bg-[#0f8b95] hover:bg-[#0f7a83] text-white px-8 py-2.5 text-2xl font-bold tracking-wide transition-colors">
          Discover More
        </button>
      </article>
    </section>
  );
};
