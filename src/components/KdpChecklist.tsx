import React from 'react';
import { CheckCircle2, ShieldCheck, FileCheck2, Info, AlertTriangle } from 'lucide-react';
import { KDPBook } from '../types';
import { runKDPPreFlightAudit } from '../utils/kdpSpecs';

interface KdpChecklistProps {
  book: KDPBook;
}

export const KdpChecklist: React.FC<KdpChecklistProps> = ({ book }) => {
  const auditResults = runKDPPreFlightAudit(book);
  const passedCount = auditResults.filter((r) => r.passed).length;
  const isAllPassed = passedCount === auditResults.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">
                Amazon KDP Pre-Flight Audit & Verification
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {passedCount} / {auditResults.length} Specs Passed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated mechanical check ensuring zero rejections by Amazon KDP automated review engines
            </p>
          </div>
        </div>

        {isAllPassed && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Amazon KDP Print Ready</span>
          </div>
        )}
      </div>

      {/* Checklist Table */}
      <div className="divide-y divide-slate-200">
        {auditResults.map((check) => (
          <div
            key={check.id}
            className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex items-start space-x-3"
          >
            <div className="mt-0.5 shrink-0">
              {check.passed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900">
                  {check.label}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {check.actualValue}
                </span>
              </div>
              
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                <span className="font-medium text-slate-600">Amazon Standard:</span>
                <span>{check.specRequired}</span>
              </div>

              <p className="text-[11px] text-slate-600 mt-1">
                {check.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer reassurance banner */}
      <div className="p-3 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Pre-flight checks follow official Amazon KDP Print On Demand mechanical guidelines.
        </span>
        <span className="font-mono text-[11px] text-slate-400">KDP Spec Rev. 2026</span>
      </div>

    </div>
  );
};
