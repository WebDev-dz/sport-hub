// app/api/[org]/players/[id]/card/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { org: string; id: string } }
) {
  try {
    const { org, id } = await params;

    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { slug: org },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Get member
    const member = await prisma.sports_member.findFirst({
      where: {
        id,
        organizationId: organization.id,
        role: "player",
      },
      include: {
        groupMembers: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .card-container {
      width: 85.6mm;
      height: 53.98mm;
      position: relative;
      background: white;
    }
    
    /* Front Card */
    .card {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      padding: 15px;
      position: relative;
      overflow: hidden;
      /* enhanced gradient background with modern blue to teal transition */
      background: linear-gradient(135deg, #0f3460 0%, #1a5f7a 50%, #16a085 100%);
      box-shadow: 0 12px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    
    .card::before {
      /* added decorative accent overlay */
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    
    .card-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Header */
    .header {
      text-align: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 8px;
    }
    
    .org-logo {
      width: 45px;
      height: 45px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 800;
      color: white;
      /* updated logo styling with enhanced border and backdrop blur */
      box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.25);
      backdrop-filter: blur(8px);
    }
    
    .org-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      /* added text shadow for better readability */
    }
    
    .card-type {
      font-size: 10px;
      color: rgba(255,255,255,0.9);
      margin-top: 2px;
      font-weight: 600;
    }
    
    /* Main Content */
    .main-content {
      display: flex;
      gap: 12px;
      flex: 1;
    }
    
    /* Photo Section */
    .photo-section {
      flex-shrink: 0;
    }
    
    .photo {
      width: 70px;
      height: 85px;
      /* enhanced photo background with white base for better contrast */
      background: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      color: #0f3460;
      /* improved shadow and border styling */
      box-shadow: 0 8px 16px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.5);
      border: 3px solid rgba(255,255,255,0.6);
      position: relative;
      overflow: hidden;
    }
    
    .photo::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(15,52,96,0.08) 100%);
    }
    
    .initials {
      position: relative;
      z-index: 1;
    }
    
    /* Info Section */
    .info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .member-name {
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 4px;
      line-height: 1.2;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .info-grid {
      display: grid;
      gap: 3px;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      font-size: 9px;
      /* updated info row styling with better transparency and separation */
      background: rgba(255,255,255,0.12);
      padding: 4px 8px;
      border-radius: 4px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.95);
    }
    
    .info-label {
      font-weight: 700;
      margin-left: 6px;
      opacity: 0.95;
    }
    
    .info-value {
      font-weight: 600;
      flex: 1;
    }
    
    /* Footer */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 6px;
    }
    
    .id-badge {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 8px;
      font-weight: 800;
      /* enhanced badge styling with border */
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      letter-spacing: 0.5px;
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(8px);
    }
    
    .qr-placeholder {
      width: 35px;
      height: 35px;
      background: rgba(255,255,255,0.95);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #0f3460;
      font-weight: 700;
      /* improved QR styling */
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      border: 2px solid rgba(255,255,255,0.5);
    }
    
    .groups-container {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
      margin-top: 3px;
    }
    
    .group-badge {
      /* enhanced group badge with better visual hierarchy */
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 700;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.25);
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    /* Print Styles */
    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;
      }
      
      .card-container {
        width: 85.6mm;
        height: 53.98mm;
        margin: 0;
        page-break-after: always;
      }
      
      .card {
        box-shadow: none;
      }
    }
    
    @page {
      size: 85.6mm 53.98mm;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="header">
          <div class="org-logo">${organization.name.substring(0, 2)}</div>
          <div class="org-name">${organization.name}</div>
          
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
          <!-- Photo -->
          <div class="photo-section">
            <div class="photo">
              <span class="initials">${initials}</span>
            </div>
          </div>
          
          <!-- Info -->
          <div class="info-section">
            <div>
              <div class="info-row">
                <div class="member-name">الإسم الكامل</div>
                <div class="member-name">${member.firstName} ${member.lastName}</div>
              </div>
              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">الفئة:</span>
                  <span class="info-value">${member.category}</span>
                </div>
                
                ${
                  member.groupMembers.length > 0
                    ? `
                <div class="groups-container">
                  ${member.groupMembers.map((gm) => `<span class="group-badge">${gm.group.name}</span>`).join("")}
                </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating card:", error);
    return NextResponse.json(
      { error: "Failed to generate card" },
      { status: 500 }
    );
  }
}
