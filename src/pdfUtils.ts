import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Department, Employee, HOD_MAPPING, HOO, CEO } from './constants';

interface VisitData {
  visitDate: string;
  visitTime: string;
  company: string;
  purpose: string;
  picLead: string;
  department: Department;
  plant: string;
  processes: string[];
  visitors: { name: string; position: string }[];
  fileUploaded: boolean;
  approvals: {
    hod: 'Approved' | 'Pending' | 'Rejected';
    hoo: 'Approved' | 'Pending' | 'Rejected';
    ceo: 'Approved' | 'Pending' | 'Rejected';
  };
}

export const generateVisitPDF = (data: VisitData) => {
  const doc = new jsPDF();
  const hod = HOD_MAPPING[data.department];

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 44, 52);
  doc.text('Visit Approval Request Summary', 105, 20, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Visit Details Section
  doc.setFontSize(14);
  doc.text('Visit Information', 20, 35);
  
  doc.setFontSize(10);
  const infoData = [
    ['Visit Date/Time', `${data.visitDate} ${data.visitTime}`],
    ['Company/Organization', data.company],
    ['Purpose of Visit', data.purpose],
    ['HTS PIC Lead', data.picLead],
    ['Department', data.department],
    ['HTS Plant', data.plant],
    ['Manufacturing Processes', data.processes.join(', ') || 'N/A'],
  ];

  autoTable(doc, {
    startY: 40,
    body: infoData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });

  // Visitor List Section
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('List of Visitors', 20, finalY);

  if (data.fileUploaded) {
    doc.setFontSize(10);
    doc.text('Note: Additional visitor list uploaded separately.', 20, finalY + 7);
  }

  const tableData = data.visitors
    .filter(v => v.name || v.position)
    .map((v, i) => [i + 1, v.name, v.position]);

  autoTable(doc, {
    startY: data.fileUploaded ? finalY + 12 : finalY + 5,
    head: [['#', 'Name', 'Position']],
    body: tableData.length > 0 ? tableData : [['-', 'No manual entries', '-']],
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Approvals Section
  const approvalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Approval Records', 20, approvalY);

  const approvalData = [
    ['[1] Head of Department', hod.name, hod.empId, data.approvals.hod],
    ['[2] Head of Operation', HOO.name, HOO.empId, data.approvals.hoo],
    ['[3] Chief Executive Officer', CEO.name, CEO.empId, data.approvals.ceo],
  ];

  autoTable(doc, {
    startY: approvalY + 5,
    head: [['Level', 'Name', 'Employee ID', 'Status']],
    body: approvalData,
    theme: 'grid',
    headStyles: { fillColor: [40, 167, 69] },
    columnStyles: { 3: { fontStyle: 'bold' } },
  });

  // Document ID / Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated on: ${new Date().toLocaleString()} | Digital Approval Record | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`Visit_Request_${data.company.replace(/\s+/g, '_')}.pdf`);
};
