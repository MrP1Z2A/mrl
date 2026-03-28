import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What is Myanmar Robotics Lab Project Hub?",
    answer: "MRL Project Hub is a community-driven platform where robotics enthusiasts in Myanmar and beyond can share their projects, documentation, and code. It aims to be a comprehensive resource similar to the Arduino Project Hub."
  },
  {
    question: "How do I share my project?",
    answer: "Log in with your email or social account (GitHub/Google/Apple), click the '+ New Project' button, and fill out the details including technical components, code snippets, and images."
  },
  {
    question: "Is the platform free to use?",
    answer: "Yes, the MRL Project Hub is completely free for the community. We believe in open-source sharing and helping others learn robotics."
  },
  {
    question: "Can I edit or delete my projects?",
    answer: "Absolutely! Once you are logged in, navigate to your project's detail page. You will see 'Edit' and 'Delete' buttons if you are the original author of the project."
  },
  {
    question: "How can I contribute to the lab?",
    answer: "Sharing your documentation and code is the best way to contribute. You can also join our community discussions or reach out to us via our main website."
  }
];

export const FAQ: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 bg-[#6CBAE6]/10 rounded-2xl text-[#6CBAE6] mb-4">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-slate-500">Everything you need to know about the MRL Project Hub.</p>
      </motion.div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <details className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-[#6CBAE6] transition-all hover:shadow-xl hover:shadow-[#6CBAE6]/5">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-800 text-lg">
                {item.question}
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                {item.answer}
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
