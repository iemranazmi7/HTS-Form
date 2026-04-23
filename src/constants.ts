export const DEPARTMENTS = [
  'ACC', 'BD', 'BDNA', 'CHROM', 'ENG', 'ENG2', 'HMS', 'HRD', 'IM', 'INHOUS', 
  'IT', 'MCHMT', 'MMAINT', 'PAINT', 'PEKAN', 'PMAINT', 'PPC', 'PVD', 'QC', 
  'SAFETY', 'SP', 'TM', 'WHSE'
] as const;

export type Department = typeof DEPARTMENTS[number];

export const PLANTS = ['Shah Alam', 'Tanjung Malim', 'Pekan', 'Melaka'] as const;

export const MANUFACTURING_PROCESSES = ['Injection Moulding', 'Painting', 'Assembly', 'Chroming'] as const;

export interface Employee {
  name: string;
  empId: string;
}

export const HOD_MAPPING: Record<Department, Employee> = {
  ACC:    { name: 'Che Wan Zakiah Binti Jamaluddin',    empId: '224141' },
  BD:     { name: 'Yau Kian Min',      empId: '204045' },
  BDNA:   { name: 'Yau Kian Min',     empId: '204045' },
  CHROM:  { name: 'Faizal Bin Jalil',               empId: '202122' },
  ENG:    { name: 'Shamsul Safwan Bin Mohamad',     empId: '970022' },
  ENG2:   { name: 'Faizal Bin Jalil',      empId: '202122' },
  HMS:    { name: 'Mohd Syahiful Adlan Bin Maarof',  empId: '200187' },
  HRD:    { name: 'Sofian Bin Ahmad Suhami',        empId: '203167' },
  IM:     { name: 'Muhammad Hanif Bin Mat Som',             empId: '223168' },
  INHOUS: { name: 'Cheah Bee Hong',                empId: '203198' },
  IT:     { name: 'Cheah Bee Hong',                empId: '203198' },
  MCHMT:  { name: 'Muhammad Riduan Lim Bin Abdullah',          empId: '920004' },
  MMAINT: { name: 'Suria Bin Mat Sahar',     empId: '214173' },
  PAINT:  { name: 'Muhamad Ibrahim Bin Abdul Halim',   empId: '211078' },
  PEKAN:  { name: 'Ahmad Syamrim Bin Yusof',  empId: '208120' },
  PMAINT: { name: 'Rudin Anwar Bin Aminudin',   empId: '980062' },
  PPC:    { name: 'Cheah Bee Hong',                empId: '203198' },
  PVD:    { name: 'Che Wan Zakiah Binti Jamaluddin',            empId: '224141' },
  QC:     { name: 'Mohamed Azri Bin Mohamed Zabidi',          empId: '217001' },
  SAFETY: { name: 'Shamsul Safwan Bin Mohamad',             empId: '970022' },
  SP:     { name: 'Muhammad Hanif Bin Mat Som',               empId: '223168' },
  TM:     { name: 'Muhamad Salmegi Bin Zakaria',       empId: '200118' },
  WHSE:   { name: 'Muhammad Hatta Bin Lukman',         empId: '940017' },
};

export const HOO: Employee = { name: 'Mohd Razaleigh Che Kob', empId: '200156' };
export const CEO: Employee = { name: 'Lim Sheng Sun', empId: '203168' };
