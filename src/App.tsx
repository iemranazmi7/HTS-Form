/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Building2, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileUp, 
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DEPARTMENTS, 
  PLANTS, 
  MANUFACTURING_PROCESSES, 
  HOD_MAPPING, 
  HOO, 
  CEO, 
  Department,
  Employee
} from './constants';
import { generateVisitPDF } from './pdfUtils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface Visitor {
  name: string;
  position: string;
}

export default function App() {
  // Form State
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [picLead, setPicLead] = useState('');
  const [department, setDepartment] = useState<Department>('ACC');
  const [plant, setPlant] = useState(PLANTS[0]);
  const [processes, setProcesses] = useState<string[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>(Array(6).fill({ name: '', position: '' }));
  const [fileUploaded, setFileUploaded] = useState(false);

  // Approval State
  const [approvals, setApprovals] = useState<{
    hod: ApprovalStatus;
    hoo: ApprovalStatus;
    ceo: ApprovalStatus;
  }>({
    hod: 'Pending',
    hoo: 'Pending',
    ceo: 'Pending',
  });

  // Auto-assigned HOD
  const currentHOD = useMemo(() => HOD_MAPPING[department], [department]);

  // Handle department change to reset HOD approval if needed (simulated)
  useEffect(() => {
    setApprovals(prev => ({ ...prev, hod: 'Pending' }));
  }, [department]);

  const toggleProcess = (process: string) => {
    setProcesses(prev => 
      prev.includes(process) 
        ? prev.filter(p => p !== process) 
        : [...prev, process]
    );
  };

  const updateVisitor = (index: number, field: keyof Visitor, value: string) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], [field]: value };
    setVisitors(newVisitors);
  };

  const addVisitorRow = () => {
    setVisitors([...visitors, { name: '', position: '' }]);
  };

  const removeVisitorRow = (index: number) => {
    if (visitors.length > 1) {
      setVisitors(visitors.filter((_, i) => i !== index));
    }
  };

  const handleManualApproval = (level: keyof typeof approvals, status: ApprovalStatus) => {
    setApprovals(prev => ({ ...prev, [level]: status }));
  };

  const isFormComplete = visitDate && visitTime && company && purpose && picLead;
  const isFullyApproved = approvals.ceo === 'Approved';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Sleek Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">H</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Visit Approval System</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">HTS Manufacturing & Logistics Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!isFullyApproved ? (
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-widest hidden md:block"
              >
                Waiting for Full Approval
              </motion.span>
            ) : (
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-widest hidden md:block"
              >
                Approval Granted
              </motion.span>
            )}
          </AnimatePresence>
          <button 
            disabled={!isFullyApproved}
            onClick={() => generateVisitPDF({
              visitDate, visitTime, company, purpose, picLead,
              department, plant, processes, visitors, fileUploaded, approvals
            })}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-all shadow-sm",
              isFullyApproved 
                ? "bg-slate-800 text-white hover:bg-slate-700 cursor-pointer" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
            )}
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1440px] mx-auto w-full">
        {/* Form Left Panel (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              Visit Details
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Visit Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="date" 
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Visit Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="time" 
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Company / Organization</label>
                <input 
                  type="text" 
                  placeholder="Enter visiting organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" 
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Visit Purpose</label>
                <input 
                  type="text" 
                  placeholder="Full scope of audit/visit"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">HTS PIC Lead</label>
                <input 
                  type="text" 
                  placeholder="Internal Lead Name"
                  value={picLead}
                  onChange={(e) => setPicLead(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">HTS Plant</label>
                <select 
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none"
                >
                  {PLANTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Department</label>
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none"
                >
                  {DEPARTMENTS.map(dept => <option key={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">HOD Automatically Assigned</label>
                <input 
                  type="text" 
                  value={currentHOD.name}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-semibold text-slate-500" 
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-4">Manufacturing Process Involved</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MANUFACTURING_PROCESSES.map(proc => (
                  <label key={proc} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-sky-300 transition-all">
                    <input 
                      type="checkbox" 
                      checked={processes.includes(proc)}
                      onChange={() => toggleProcess(proc)}
                      className="w-4 h-4 rounded accent-sky-600" 
                    />
                    <span className="text-xs font-medium text-slate-700">{proc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-sky-900 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-sky-900/10">
            <div>
              <h3 className="font-bold text-lg">Submit Final Review</h3>
              <p className="text-xs text-sky-200">Verify all visitor data before sending to CEO for digital signature.</p>
            </div>
            <button 
               className={cn(
                 "px-8 py-3 bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-sky-400/20 active:scale-95",
                 !isFormComplete && "opacity-50 cursor-not-allowed scale-100 shadow-none"
               )}
            >
              Push to Final Step
            </button>
          </div>
        </div>

        {/* Visitor & Workflow Right Panel (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                Visitor List
              </h2>
              <button 
                onClick={() => setFileUploaded(!fileUploaded)}
                className={cn(
                  "text-[10px] px-3 py-1.5 rounded border transition-all font-bold uppercase tracking-wider",
                  fileUploaded ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                )}
              >
                {fileUploaded ? "Manual List Linked" : "Upload List (.xls)"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-sm z-10">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {visitors.map((visitor, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 text-slate-300 font-mono text-xs">{(idx + 1).toString().padStart(2, '0')}</td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={visitor.name}
                          onChange={(e) => updateVisitor(idx, 'name', e.target.value)}
                          className="w-full border-none bg-transparent focus:ring-0 p-0 text-slate-800 font-medium placeholder:text-slate-200 transition-all"
                          placeholder="Enter name..."
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={visitor.position}
                          onChange={(e) => updateVisitor(idx, 'position', e.target.value)}
                          className="w-full border-none bg-transparent focus:ring-0 p-0 text-slate-500 placeholder:text-slate-200 transition-all"
                          placeholder="Enter position..."
                        />
                      </td>
                      <td className="p-4">
                         <button 
                          onClick={() => removeVisitorRow(idx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                         >
                          <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-50 bg-slate-50/30">
              <button 
                onClick={addVisitorRow}
                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-all border border-dashed border-slate-200 rounded-lg hover:border-sky-300 hover:bg-white"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Row
              </button>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Approval Workflow</h2>
            <div className="space-y-8 relative">
              
              {/* Step 1: HOD */}
              <div className="flex gap-5 relative group">
                <div className={cn(
                  "w-0.5 h-10 absolute left-4 top-9 transition-colors duration-500",
                  approvals.hod === 'Approved' ? "bg-emerald-500" : "bg-slate-200"
                )}></div>
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 transition-all shadow-sm",
                  approvals.hod === 'Approved' ? "bg-emerald-500 text-white shadow-emerald-200" : 
                  approvals.hod === 'Rejected' ? "bg-red-500 text-white" : "bg-white border-2 border-slate-200 text-slate-400"
                )}>
                  {approvals.hod === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                   approvals.hod === 'Rejected' ? <AlertCircle className="w-5 h-5" /> : <span className="font-bold text-xs uppercase">1</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Step 1: HOD Approval</h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none",
                      approvals.hod === 'Approved' ? "text-emerald-600 bg-emerald-50" : 
                      approvals.hod === 'Rejected' ? "text-red-600 bg-red-50" : "text-slate-400 bg-slate-50"
                    )}>{approvals.hod}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 truncate">{currentHOD.name} (Emp ID: {currentHOD.empId})</p>
                  {approvals.hod === 'Pending' && (
                    <div className="flex gap-2">
                       <button onClick={() => handleManualApproval('hod', 'Approved')} className="text-[10px] font-bold bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition-all">Approve</button>
                       <button onClick={() => handleManualApproval('hod', 'Rejected')} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200 transition-all text-xs">Reject</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: HOO */}
              <div className="flex gap-5 relative group">
                <div className={cn(
                  "w-0.5 h-10 absolute left-4 top-9 transition-colors duration-500",
                  approvals.hoo === 'Approved' ? "bg-emerald-500" : "bg-slate-200"
                )}></div>
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 transition-all shadow-sm",
                  approvals.hoo === 'Approved' ? "bg-emerald-500 text-white shadow-emerald-200" : 
                  approvals.hoo === 'Rejected' ? "bg-red-500 text-white" : "bg-white border-2 border-slate-200 text-slate-400"
                )}>
                  {approvals.hoo === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                   approvals.hoo === 'Rejected' ? <AlertCircle className="w-5 h-5" /> : <span className="font-bold text-xs uppercase">2</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Step 2: HOO Approval</h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none",
                      approvals.hoo === 'Approved' ? "text-emerald-600 bg-emerald-50" : 
                      approvals.hoo === 'Rejected' ? "text-red-600 bg-red-50" : "text-slate-400 bg-slate-50"
                    )}>{approvals.hoo}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 truncate">{HOO.name} (Emp ID: {HOO.empId})</p>
                  {approvals.hoo === 'Pending' && approvals.hod === 'Approved' && (
                    <div className="flex gap-2">
                       <button onClick={() => handleManualApproval('hoo', 'Approved')} className="text-[10px] font-bold bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition-all">Approve</button>
                       <button onClick={() => handleManualApproval('hoo', 'Rejected')} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200 transition-all text-xs">Reject</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: CEO */}
              <div className="flex gap-5 relative group">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 transition-all shadow-sm",
                  approvals.ceo === 'Approved' ? "bg-emerald-500 text-white shadow-emerald-200" : 
                  approvals.ceo === 'Rejected' ? "bg-red-500 text-white" : "bg-white border-2 border-slate-200 text-slate-400"
                )}>
                   {approvals.ceo === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                    approvals.ceo === 'Rejected' ? <AlertCircle className="w-5 h-5" /> : <span className="font-bold text-xs uppercase">3</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Step 3: CEO Final</h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none",
                      approvals.ceo === 'Approved' ? "text-emerald-600 bg-emerald-50" : 
                      approvals.ceo === 'Rejected' ? "text-red-600 bg-red-50" : "text-slate-400 bg-slate-50"
                    )}>{approvals.ceo}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 truncate">{CEO.name} (Emp ID: {CEO.empId})</p>
                  {approvals.ceo === 'Pending' && approvals.hoo === 'Approved' && (
                    <div className="flex gap-2">
                       <button onClick={() => handleManualApproval('ceo', 'Approved')} className="text-[10px] font-bold bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition-all">Grant Final</button>
                       <button onClick={() => handleManualApproval('ceo', 'Rejected')} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200 transition-all text-xs">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Alert */}
      {!isFormComplete && (
        <div className="fixed bottom-6 right-6 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-800 text-white p-4 rounded-xl shadow-2xl flex items-start gap-4">
            <div className="p-2 bg-amber-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Action Required</h4>
              <p className="text-xs text-amber-200 leading-relaxed mt-1">Please complete the visit details fields to activate the approval sequence.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
