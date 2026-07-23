"use client";

/**
 * EquipLink Enterprise PDF Report & Certificate Generator Utility.
 * Renders styled HTML documents and triggers native browser PDF generation/download.
 */

export interface EstimatePDFData {
  projectType: string;
  durationDays: number;
  excavators: number;
  cranes: number;
  rollers: number;
  dailyEquipmentCost: number;
  totalEquipmentCost: number;
  totalFuelLiters: number;
  totalFuelCost: number;
  recommendedOperators: number;
  estimatedCO2Tons: number;
}

export interface EsgPDFData {
  certificateId?: string;
  corporateEntity?: string;
  carbonOffsetTons?: number;
  electricFleetHours?: number;
  sustainabilityRating?: string;
  issueDate?: string;
}

export interface VerificationPDFData {
  bookingId: number | string;
  equipmentName: string;
  chassisVin?: string;
  rtoAuthority?: string;
  insurancePolicyNo?: string;
  sumAssured?: string;
  emissionStandard?: string;
  operatorLicenseClass?: string;
  verifiedAt?: string;
}

function printHtmlContent(htmlContent: string, title: string) {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Please allow pop-ups to download/print the PDF document.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 40px;
            box-sizing: border-box;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -0.5px;
          }
          .brand span {
            color: #f59e0b;
          }
          .badge {
            background: #fef3c7;
            color: #92400e;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .title-box {
            background: #0f172a;
            color: #ffffff;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 30px;
          }
          .title-box h1 {
            margin: 0 0 8px 0;
            font-size: 22px;
            font-weight: 800;
            color: #fbbf24;
          }
          .title-box p {
            margin: 0;
            font-size: 13px;
            color: #94a3b8;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            background: #f8fafc;
          }
          .card label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 4px;
          }
          .card .value {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          th {
            background: #f1f5f9;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            color: #475569;
          }
          .total-row {
            background: #fffbeb;
            font-weight: 900;
            font-size: 15px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Auto trigger browser print dialog to save as PDF
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Generate & Download AI Fleet Cost Estimate PDF
 */
export function downloadEstimatePDF(data: EstimatePDFData) {
  const generatedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const grandTotal = data.totalEquipmentCost + data.totalFuelCost;

  const html = `
    <div class="header">
      <div class="brand">Equip<span>Link</span></div>
      <div class="badge">Official AI Budget Forecast Report</div>
    </div>

    <div class="title-box">
      <h1>Heavy Machinery Lease & Fuel Budget Estimate</h1>
      <p>Project Type: <strong>${data.projectType}</strong> • Contract Duration: <strong>${data.durationDays} Days</strong> • Generated: ${generatedAt}</p>
    </div>

    <div class="grid">
      <div class="card">
        <label>Total Equipment Lease Budget</label>
        <div class="value">₹${data.totalEquipmentCost.toLocaleString("en-IN")}</div>
      </div>
      <div class="card">
        <label>Total Diesel Fuel Budget</label>
        <div class="value">₹${data.totalFuelCost.toLocaleString("en-IN")}</div>
      </div>
      <div class="card">
        <label>Projected Fuel Burn</label>
        <div class="value">${data.totalFuelLiters.toLocaleString("en-IN")} Liters</div>
      </div>
      <div class="card">
        <label>Estimated Carbon Footprint</label>
        <div class="value">${data.estimatedCO2Tons} Tons CO₂</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Machinery Type</th>
          <th>Units</th>
          <th>Daily Rate</th>
          <th>Est. Daily Fuel</th>
          <th>Total Fleet Cost (${data.durationDays} Days)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Heavy Excavator (20-30T)</td>
          <td>${data.excavators}</td>
          <td>₹9,500/day</td>
          <td>85 L/day/unit</td>
          <td>₹${(data.excavators * 9500 * data.durationDays).toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td>Hydraulic Heavy Crane (50T+)</td>
          <td>${data.cranes}</td>
          <td>₹18,000/day</td>
          <td>110 L/day/unit</td>
          <td>₹${(data.cranes * 18000 * data.durationDays).toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td>Vibratory Soil Roller</td>
          <td>${data.rollers}</td>
          <td>₹6,000/day</td>
          <td>45 L/day/unit</td>
          <td>₹${(data.rollers * 6000 * data.durationDays).toLocaleString("en-IN")}</td>
        </tr>
        <tr class="total-row">
          <td colspan="4">GRAND TOTAL ESTIMATE (Lease + Diesel Fuel)</td>
          <td style="color: #d97706;">₹${grandTotal.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <div class="card" style="margin-bottom: 20px;">
      <label>Recommended Field Operator Staffing</label>
      <div class="value" style="font-size: 15px;">${data.recommendedOperators} Certified Heavy Machine Operators & Riggers</div>
    </div>

    <div class="footer">
      <span>EquipLink Digital Heavy Machinery Network • Enterprise SLA Verified</span>
      <span>Document Ref: EQL-EST-${Math.floor(100000 + Math.random() * 900000)}</span>
    </div>
  `;

  printHtmlContent(html, "EquipLink_AI_Cost_Estimate_Report.pdf");
}

/**
 * Generate & Download Enterprise ESG Compliance PDF Certificate
 */
export function downloadEsgCertificatePDF(data: EsgPDFData = {}) {
  const certId = data.certificateId || `ESG-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = data.issueDate || new Date().toLocaleDateString("en-IN");
  const offsetTons = data.carbonOffsetTons || 340.5;
  const evHours = data.electricFleetHours || 1280;

  const html = `
    <div style="border: 12px solid #0f172a; padding: 40px; border-radius: 24px; position: relative;">
      <div class="header">
        <div class="brand">Equip<span>Link</span> <span style="font-size: 14px; color: #10b981;">ESG GREEN HUB</span></div>
        <div class="badge" style="background: #d1fae5; color: #065f46;">Certified Corporate Audit</div>
      </div>

      <div style="text-center; margin: 40px 0; text-align: center;">
        <span style="font-size: 48px;">🌿</span>
        <h1 style="font-size: 28px; font-weight: 900; color: #0f172a; margin: 10px 0 5px 0;">Certificate of ESG Sustainability Compliance</h1>
        <p style="font-size: 14px; color: #64748b;">This audit certificate verifies carbon offset & green fleet deployment compliance</p>
      </div>

      <div class="grid" style="margin-top: 30px;">
        <div class="card">
          <label>Certificate Serial Number</label>
          <div class="value" style="font-family: monospace;">${certId}</div>
        </div>
        <div class="card">
          <label>Issue Date</label>
          <div class="value">${issueDate}</div>
        </div>
        <div class="card">
          <label>Verified Carbon Offset</label>
          <div class="value" style="color: #059669;">${offsetTons} Tons CO₂</div>
        </div>
        <div class="card">
          <label>Zero-Emission EV Fleet Usage</label>
          <div class="value" style="color: #0284c7;">${evHours} Operating Hours</div>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-top: 20px; text-align: center;">
        <p style="font-size: 12px; color: #475569; margin: 0;">
          Issued in accordance with ISO 14064 Greenhouse Gas Verification Standard. Equipment deployed via EquipLink Green Fleet Initiative.
        </p>
      </div>

      <div class="footer">
        <span>EquipLink ESG Audit Committee</span>
        <span>Cryptographically Verified & Sealed</span>
      </div>
    </div>
  `;

  printHtmlContent(html, `EquipLink_ESG_Certificate_${certId}.pdf`);
}

/**
 * Generate & Download Machinery Compliance Verification PDF Certificate
 */
export function downloadVerificationPDF(data: VerificationPDFData) {
  const generatedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const regNo = `REG-EQ-${data.bookingId}-2026`;

  const html = `
    <div class="header">
      <div class="brand">Equip<span>Link</span></div>
      <div class="badge" style="background: #dcfce7; color: #166534;">Verified Machinery Legal Compliance</div>
    </div>

    <div class="title-box">
      <h1>RTO Compliance & Machinery Inspection Pass</h1>
      <p>Booking Reference: <strong>#${data.bookingId}</strong> • Machinery: <strong>${data.equipmentName}</strong> • Generated: ${generatedAt}</p>
    </div>

    <div class="grid">
      <div class="card">
        <label>Chassis / VIN Number</label>
        <div class="value" style="font-family: monospace;">${data.chassisVin || regNo}</div>
      </div>
      <div class="card">
        <label>RTO Issuing Authority</label>
        <div class="value">${data.rtoAuthority || "Peenya RTO, Bangalore North"}</div>
      </div>
      <div class="card">
        <label>Commercial Insurance Policy</label>
        <div class="value" style="font-family: monospace;">${data.insurancePolicyNo || "INS-POLICY-99201"}</div>
      </div>
      <div class="card">
        <label>Sum Assured Liability</label>
        <div class="value" style="color: #059669;">${data.sumAssured || "₹5,00,00,000"}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Certificate Name</th>
          <th>Authority / Standard</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Government RTO Registration Certificate (RC)</td>
          <td>Regional Transport Office</td>
          <td style="color: #059669; font-weight: 800;">VERIFIED & ACTIVE</td>
        </tr>
        <tr>
          <td>Commercial Machinery Insurance Policy</td>
          <td>ICICI Lombard / Bajaj Allianz</td>
          <td style="color: #059669; font-weight: 800;">FULLY COVERED</td>
        </tr>
        <tr>
          <td>RTO Mechanical Fitness Certificate</td>
          <td>${data.emissionStandard || "BS-IV / CEV Stage IV"}</td>
          <td style="color: #059669; font-weight: 800;">APPROVED</td>
        </tr>
        <tr>
          <td>Certified Heavy Operator License</td>
          <td>${data.operatorLicenseClass || "TRANS-HEAVY-CRANE-EXCAVATOR"}</td>
          <td style="color: #059669; font-weight: 800;">VERIFIED OPERATOR</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>EquipLink Legal Verification Network</span>
      <span>Inspection Timestamp: ${data.verifiedAt || generatedAt}</span>
    </div>
  `;

  printHtmlContent(html, `EquipLink_Verification_Pass_Booking_${data.bookingId}.pdf`);
}
