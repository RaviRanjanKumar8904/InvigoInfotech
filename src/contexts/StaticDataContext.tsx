import React, { createContext, useContext, useEffect, useState } from 'react';
import type { InternshipDomain, FAQItem, PartnerCollege, MCQQuestion } from '../types';

export interface StaticData {
  domains: InternshipDomain[];
  testimonials: any[];
  branchOptions: string[];
  hardcodedColleges: PartnerCollege[];
  faqs: FAQItem[];
  defaultMcqQuestions: Record<string, MCQQuestion[]>;
  extendedColleges: PartnerCollege[];
}

const StaticDataContext = createContext<StaticData | null>(null);

export function useStaticData() {
  const context = useContext(StaticDataContext);
  if (!context) {
    throw new Error('useStaticData must be used within a StaticDataProvider');
  }
  return context;
}

export function StaticDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StaticData | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/data.json').then(res => res.json()),
      fetch('/colleges.json').then(res => res.json())
    ]).then(([dataJson, collegesJson]) => {
      if (mounted) {
        setData({
          domains: dataJson.INTERNSHIP_DOMAINS,
          testimonials: dataJson.TESTIMONIALS,
          branchOptions: dataJson.BRANCH_OPTIONS,
          hardcodedColleges: dataJson.HARDCODED_COLLEGES,
          faqs: dataJson.FAQS,
          defaultMcqQuestions: dataJson.DEFAULT_MCQ_QUESTIONS,
          extendedColleges: collegesJson
        });
      }
    }).catch(err => {
      console.error('Failed to load static data', err);
    });
    return () => { mounted = false; };
  }, []);

  if (!data) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div></div>;
  }

  return (
    <StaticDataContext.Provider value={data}>
      {children}
    </StaticDataContext.Provider>
  );
}
