import api from "../../instance/TokenInstance";
import jsPDF from "jspdf";
import imageInput from "../../assets/images/Agent.png";

// const handleGuarantorPrint = async (id) => {
//   try {
//     const response = await api.get(`/guarantor/get-guarantor-info-by-id/${id}`);
//     const guarantor = response?.data?.guarantor;

//     const doc = new jsPDF("p", "mm", "a4");

//     doc.setFillColor(201, 216, 250);
//     doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
//        const drawTextBox1 = (
//             text,
//             x,
//             y,
//             padding = 4,
//             lineHeight = 12,
//             radius = 2
//         ) => {
//             const pageWidth = doc.internal.pageSize.getWidth();
//             console.log(pageWidth);
//             const margin = 15; 
//             const availableWidth = pageWidth - 2 * margin; 
//             console.log(availableWidth);
           
//             const boxWidth = availableWidth + 10;
//             console.log(boxWidth);
//             const boxHeight = lineHeight;

//             // Shadow effect (smoothed)
//             // doc.setDrawColor(180);
//             // doc.setFillColor(153, 153, 153); // shadow color
//             // doc.roundedRect(
//             //     x + 1.5,
//             //     y + 1.5,
//             //     boxWidth,
//             //     boxHeight,
//             //     radius,
//             //     radius,
//             //     "F"
//             // );

//             // Main text box with fill
//             doc.setDrawColor(0);
//             doc.setFillColor(0, 38, 124); // background color for the box
//             doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

//             // Add text
//             doc.setTextColor(255, 255, 255); // text color
//             doc.text(text, x + padding, y + lineHeight - 4);
//         };

//         //customer name and address text field
//         const drawTextBox3 = (
//             text,
//             x,
//             y,
//             padding = 4,
//             lineHeight = 12,
//             radius = 2
//         ) => {
//             const pageWidth = doc.internal.pageSize.getWidth();
//             console.log(pageWidth);
//             const margin = 15; // 15mm margin from left and right side of the page

//             const availableWidth = pageWidth - 2 * margin; // Space available between left and right margin
//             console.log(availableWidth);
//             //const textWidth = doc.getTextWidth(text);

//             // Set the box width to either available width or text width + padding
//             //const boxWidth = Math.min(availableWidth, textWidth + padding * 2);
//             const boxWidth = availableWidth + 10;
//             console.log(boxWidth);
//             const boxHeight = lineHeight;

//             // Shadow effect (smoothed)
//             // doc.setDrawColor(180);
//             // doc.setFillColor(153, 153, 153); // shadow color
//             // doc.roundedRect(
//             //     x + 1.5,
//             //     y + 1.5,
//             //     boxWidth,
//             //     boxHeight,
//             //     radius,
//             //     radius,
//             //     "F"
//             // );

//             // Main text box with fill
//             doc.setDrawColor(0);
//             doc.setFillColor(255, 255, 255); // background color for the box
//             doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

//             // Add text
//             doc.setTextColor(0, 0, 0); // text color
//             doc.text(text, x + padding, y + lineHeight - 4);
//         };

//         // chit enrollment form text field
//         const drawTextBox2 = (text, y, lineHeight = 12, radius = 2) => {
//             const pageWidth = doc.internal.pageSize.getWidth();
//             const margin = 1;
//             const boxWidth = pageWidth - 2 * margin;
//             const boxHeight = lineHeight;
//             const x = margin;

//             // Shadow effect
//             // doc.setDrawColor(180);
//             // doc.setFillColor(153, 153, 153); // shadow color
//             // doc.roundedRect(
//             //     x + 1,
//             //     y + 1,
//             //     boxWidth,
//             //     boxHeight,
//             //     radius,
//             //     radius,
//             //     "F"
//             // );

//             // Main box
//             doc.setDrawColor(0);
//             doc.setFillColor(0, 38, 124); // blue background
//             doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

//             // Center-aligned text inside the box
//             const textWidth = doc.getTextWidth(text);
//             const textX = x + (boxWidth - textWidth) / 2;

//             doc.setTextColor(255, 255, 255); // white text
//             doc.text(text, textX, y + lineHeight - 4);
//         };

//         // 2 text field in a same row
//         const drawTextBox = (
//             text,
//             x,
//             y,
//             padding = 4,
//             lineHeight = 12,
//             radius = 2
//         ) => {
//             const pageWidth = doc.internal.pageSize.getWidth();
//             console.log(pageWidth);
//             const margin = 15; // 15mm margin from left and right side of the page

//             const availableWidth = pageWidth - 2 * margin; // Space available between left and right margin
//             console.log(availableWidth);
//             //const textWidth = doc.getTextWidth(text);

//             // Set the box width to either available width or text width + padding
//             //const boxWidth = Math.min(availableWidth, textWidth + padding * 2);
//             const boxWidth = availableWidth / 2;
//             console.log(boxWidth);
//             const boxHeight = lineHeight;




//             // Shadow effect (smoothed)
//             // doc.setDrawColor(180);
//             // doc.setFillColor(153, 153, 153); // shadow color
//             // doc.roundedRect(
//             //     x + 1.5,
//             //     y + 1.5,
//             //     boxWidth,
//             //     boxHeight,
//             //     radius,
//             //     radius,
//             //     "F"
//             // );



//             // Main text box with fill
//             doc.setDrawColor(0);
//             doc.setFillColor(255, 255, 255); // background color for the box
//             doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

//             // Add text
//             doc.setTextColor(0, 0, 0); // text color
//             doc.text(text, x + padding, y + lineHeight - 4);
//         };

//       const drawTextBoxWithMultipleLines = (y, lineHeight = 8) => {
//             const docWidth = doc.internal.pageSize.getWidth();
//             const margin = 0.1;
//             const x = margin;
//             const boxWidth = docWidth - 2 * margin;

//             const lines = [
//                 {
//                     text: "VIJAYA VINAYAK CHIT FUNDS PRIVATE LIMITED",
//                     color: [212, 175, 55], // Gold
//                 },
//                 {
//                     text: "#11/36-25, 3rd Floor, 2nd Main, Kathriguppe Main Road, Banshankari 3rd Stage, Bengaluru-560085",
//                     color: [255, 255, 255], // White
//                 },
//                 {
//                     text: "Mob: 9483900777 | Ph: 080-4979 8763 | Email: info.mychits@gmail.com | Website: www.mychits.co.in",
//                     color: [255, 255, 255], // White
//                 },
//             ];

//             const boxHeight = lineHeight * lines.length;

//             // Optional shadow
//             doc.setDrawColor(180);
//             doc.setFillColor(128, 128, 128);
//             doc.rect(x + 1.5, y + 1.5, boxWidth, boxHeight, "F");

//             // Main background box
//             doc.setDrawColor(0);
//             doc.setFillColor(0, 38, 124); // Blue
//             doc.rect(x, y, boxWidth, boxHeight, "FD");

//             // Render each line, centered
//             lines.forEach((line, index) => {
//                 doc.setTextColor(...line.color);
//                 const textWidth = doc.getTextWidth(line.text);
//                 const textX = x + (boxWidth - textWidth) / 2;
//                 const textY = y + index * lineHeight; // no vertical spacing subtracted
//                 doc.text(line.text, textX, textY + lineHeight * 0.75); // center vertically in line box
//             });
//         };
//        // drawTextBoxWithMultipleLines(273);
//     // Add Header
//     doc.addImage(imageInput, "PNG", 90, 3, 30, 30);
//     doc.setFontSize(20);
//     doc.setFont("helvetica", "bold");
//     drawTextBox2("GUARANTOR INFORMATION FORM", 35);

//     doc.setFontSize(12);
//     drawTextBox(`Customer Name: ${guarantor?.user_id?.full_name || ""}`, 10, 50);
//     drawTextBox(`Date: ${new Date().toLocaleDateString("en-GB")}`, 110, 50);
//     drawTextBox3(`Enrollment : ${(guarantor?.enrollment_ids || []).map(e => `${e.group_id?.group_name || "N/A"} | Ticket: ${e.tickets || "N/A"}`).join(", ") || "N/A"}`, 10, 65);


//     // Section Header
//     doc.setFontSize(15);
//     drawTextBox1("Guarantor Details:", 10, 85);
//     doc.setFontSize(12);

//     // Universal fields
//    // drawTextBox3(`Enrollment(s): ${(guarantor?.enrollment_ids || []).map(e => `${e.group_id?.group_name || "N/A"} | Ticket: ${e.tickets || "N/A"}`).join(", ") || "N/A"}`, 10, 100);

//     if (guarantor?.guarantor_referred_type === "Customer") {
//       drawTextBox(`Referred Guarantor: ${guarantor?.user_guarantor || ""}`, 10, 115);
//       drawTextBox3(`Description: ${guarantor?.guarantor_description || ""}`, 110, 130);
//     }

//     if (guarantor?.guarantor_referred_type === "Third Party") {
//       drawTextBox3(`Name: ${guarantor?.guarantor_name || ""}`, 10, 100);
//       drawTextBox(`Phone: ${guarantor?.guarantor_phone_number || ""}`, 10, 115);
//       drawTextBox(`Email: ${guarantor?.guarantor_email || ""}`, 110, 115);
//       drawTextBox(`Alternate No: ${guarantor?.guarantor_alternate_number || ""}`, 10, 130);
//       drawTextBox(`DOB: ${guarantor?.guarantor_dateofbirth?.split("T")[0] || ""}`, 110, 130);
//       drawTextBox(`Gender: ${guarantor?.guarantor_gender || ""}`, 10, 145);
//       drawTextBox(`Marital Status: ${guarantor?.guarantor_marital_status || ""}`, 110, 145);
//       drawTextBox(`Nationality: ${guarantor?.guarantor_nationality || ""}`, 10, 160);
//       drawTextBox(`Father Name: ${guarantor?.guarantor_father_name || ""}`, 110, 160);
//       drawTextBox3(`Address: ${guarantor?.guarantor_address || ""}`, 10, 175);
//       drawTextBox(`Referred Type: ${guarantor?.guarantor_referred_type || ""}`, 10,190);
//       drawTextBox(`Village: ${guarantor?.guarantor_village || ""}`, 110, 190);
//       drawTextBox(`Taluk: ${guarantor?.guarantor_taluk || ""}`, 10, 205);
//       drawTextBox(`District: ${guarantor?.guarantor_district || ""}`, 110, 205);
//       drawTextBox(`State: ${guarantor?.guarantor_state || ""}`, 10, 220);
//       drawTextBox(`Pincode: ${guarantor?.guarantor_pincode || ""}`, 110, 220);
//       drawTextBox(`Aadhaar: ${guarantor?.guarantor_adhaar_no || ""}`, 10, 235);
//       drawTextBox(`PAN: ${guarantor?.guarantor_pan_no || ""}`, 110, 235);

      
//     }

//     if (guarantor?.guarantor_referred_type === "Property") {
      
//       drawTextBox3(`Property Property Name: ${guarantor?.guarantor_document_name || ""}`, 10, 100);
//       drawTextBox3(`Property Description: ${guarantor?.guarantor_description || ""}`, 10, 115);
//     }

//     doc.setFontSize(11);
//     doc.text("I / We hereby confirm the above guarantor details are true to the best of my knowledge.", 12, 255);
//     doc.text("Signature of the Subscriber", 10, 270);

//     drawTextBoxWithMultipleLines(272);

//     const name = guarantor?.guarantor_name || guarantor?.user_guarantor || "Guarantor";
//     doc.save(`${name.replace(/\s+/g, "_")}_GuarantorForm.pdf`);
//   } catch (error) {
//     console.error("Error generating Guarantor PDF:", error);
//   }
// };


const handleGuarantorPrint = async (id) => {
  try {
    const response = await api.get(`/guarantor/get-guarantor-info-by-id/${id}`);
    const guarantor = response?.data?.guarantor;

    const doc = new jsPDF("p", "mm", "a4");
    //doc.setFillColor(201, 216, 250);

    // doc.setFillColor(201, 216, 250); // Light blue
    // doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

     const setBackground = () => {
      doc.setFillColor(201, 216, 250); // Light Blue color
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Fill the whole page with color
    };
     
    // === UTILITY DRAW FUNCTIONS ===
    const drawTextBox1 = (text, x, y, padding = 4, lineHeight = 12, radius = 2) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const availableWidth = pageWidth - 2 * margin;
      const boxWidth = availableWidth + 10;
      const boxHeight = lineHeight;

      doc.setDrawColor(0);
      doc.setFillColor(0, 38, 124);
      doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

      doc.setTextColor(255, 255, 255);
      doc.text(text, x + padding, y + lineHeight - 4);
    };

    const drawTextBox3 = (text, x, y, padding = 4, lineHeight = 12, radius = 2) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const availableWidth = pageWidth - 2 * margin;
      const boxWidth = availableWidth + 10;
      const boxHeight = lineHeight;

      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

      doc.setTextColor(0, 0, 0);
      doc.text(text, x + padding, y + lineHeight - 4);
    };

    const drawTextBox2 = (text, y, lineHeight = 12, radius = 2) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 1;
      const boxWidth = pageWidth - 2 * margin;
      const boxHeight = lineHeight;
      const x = margin;

      doc.setDrawColor(0);
      doc.setFillColor(0, 38, 124);
      doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

      const textWidth = doc.getTextWidth(text);
      const textX = x + (boxWidth - textWidth) / 2;

      doc.setTextColor(255, 255, 255);
      doc.text(text, textX, y + lineHeight - 4);
    };

    const drawTextBox = (text, x, y, padding = 4, lineHeight = 12, radius = 2) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const availableWidth = pageWidth - 2 * margin;
      const boxWidth = availableWidth / 2;
      const boxHeight = lineHeight;

      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, boxWidth, boxHeight, radius, radius, "FD");

      doc.setTextColor(0, 0, 0);
      doc.text(text, x + padding, y + lineHeight - 4);
    };

    const drawTextBoxWithMultipleLines = (y, lineHeight = 8) => {
      const docWidth = doc.internal.pageSize.getWidth();
      const margin = 0.1;
      const x = margin;
      const boxWidth = docWidth - 2 * margin;

      const lines = [
        {
          text: "VIJAYA VINAYAK CHIT FUNDS PRIVATE LIMITED",
          color: [212, 175, 55],
        },
        {
          text: "#11/36-25, 3rd Floor, 2nd Main, Kathriguppe Main Road, Banshankari 3rd Stage, Bengaluru-560085",
          color: [255, 255, 255],
        },
        {
          text: "Mob: 9483900777 | Ph: 080-4979 8763 | Email: info.mychits@gmail.com | Website: www.mychits.co.in",
          color: [255, 255, 255],
        },
      ];

      const boxHeight = lineHeight * lines.length;

      doc.setDrawColor(180);
      doc.setFillColor(128, 128, 128);
      doc.rect(x + 1.5, y + 1.5, boxWidth, boxHeight, "F");

      doc.setDrawColor(0);
      doc.setFillColor(0, 38, 124);
      doc.rect(x, y, boxWidth, boxHeight, "FD");

      lines.forEach((line, index) => {
        doc.setTextColor(...line.color);
        const textWidth = doc.getTextWidth(line.text);
        const textX = x + (boxWidth - textWidth) / 2;
        const textY = y + index * lineHeight;
        doc.text(line.text, textX, textY + lineHeight * 0.75);
      });
    };
   setBackground();
    // ================= PAGE 1 =================
    doc.addImage(imageInput, "PNG", 90, 3, 30, 30);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    drawTextBox2("GUARANTOR INFORMATION FORM", 35);

    doc.setFontSize(12);
    drawTextBox(`Customer Name: ${guarantor?.user_id?.full_name || ""}`, 10, 50);
    drawTextBox(`Date: ${new Date().toLocaleDateString("en-GB")}`, 110, 50);
    drawTextBox3(
      `Enrollment : ${(guarantor?.enrollment_ids || [])
        .map(e => `${e.group_id?.group_name || "N/A"} | Ticket: ${e.tickets || "N/A"}`)
        .join(", ") || "N/A"}`,
      10,
      65
    );

    doc.setFontSize(15);
    drawTextBox1("Personal / KYC Details:", 10, 85);
    doc.setFontSize(12);

    // Personal
    drawTextBox(`Name: ${guarantor?.guarantor_name || ""}`, 10, 100);
    drawTextBox(`Phone: ${guarantor?.guarantor_phone_number || ""}`, 110, 100);
    drawTextBox(`Email: ${guarantor?.guarantor_email || ""}`, 10, 115);
    drawTextBox(`Alternate No: ${guarantor?.guarantor_alternate_number || ""}`, 110, 115);
    drawTextBox(`DOB: ${guarantor?.guarantor_dateofbirth?.split("T")[0] || ""}`, 10, 130);
    drawTextBox(`Gender: ${guarantor?.guarantor_gender || ""}`, 110, 130);
    drawTextBox(`Marital Status: ${guarantor?.guarantor_marital_status || ""}`, 10, 145);
    drawTextBox(`Nationality: ${guarantor?.guarantor_nationality || ""}`, 110, 145);
    drawTextBox(`Father Name: ${guarantor?.guarantor_father_name || ""}`, 10, 160);
    drawTextBox(`Referred Type: ${guarantor?.guarantor_referred_type || ""}`, 110, 160);

    drawTextBox3(`Address: ${guarantor?.guarantor_address || ""}`, 10, 175);
    drawTextBox(`Village: ${guarantor?.guarantor_village || ""}`, 10, 190);
    drawTextBox(`Taluk: ${guarantor?.guarantor_taluk || ""}`, 110, 190);
    drawTextBox(`District: ${guarantor?.guarantor_district || ""}`, 10, 205);
    drawTextBox(`State: ${guarantor?.guarantor_state || ""}`, 110, 205);
    drawTextBox(`Pincode: ${guarantor?.guarantor_pincode || ""}`, 10, 220);

    // KYC
    drawTextBox1("KYC Information:", 10, 240);
    drawTextBox(`Aadhaar No: ${guarantor?.guarantor_adhaar_no || ""}`, 10, 255);
    drawTextBox(`PAN No: ${guarantor?.guarantor_pan_no || ""}`, 110, 255);
    drawTextBox(`Document Name: ${guarantor?.guarantor_document_name || ""}`, 10, 270);
    drawTextBox(`Relationship Type: ${guarantor?.guarantor_relationship_type || ""}`, 110, 270);

    // PAGE BREAK
    doc.addPage();
     setBackground();

    // ================= PAGE 2 =================
    doc.addImage(imageInput, "PNG", 90, 3, 30, 30);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    drawTextBox2("GUARANTOR INFORMATION FORM (Contd.)", 35);

    doc.setFontSize(15);
    drawTextBox1("Bank Details:", 10, 55);
    doc.setFontSize(12);
    drawTextBox(`Bank Name: ${guarantor?.guarantor_bank_name || ""}`, 10, 70);
    drawTextBox(`Account No: ${guarantor?.guarantor_bank_account_number || ""}`, 110, 70);
    drawTextBox(`Branch: ${guarantor?.guarantor_bank_branch || ""}`, 10, 85);
    drawTextBox(`IFSC: ${guarantor?.guarantor_bank_ifsc_code || ""}`, 110, 85);

    doc.setFontSize(15);
    drawTextBox1("Occupation / Business:", 10, 105);
    doc.setFontSize(12);
    drawTextBox(`Occupation: ${guarantor?.guarantor_occupation || ""}`, 10, 120);
    drawTextBox(`Sector: ${guarantor?.guarantor_sector_name || ""}`, 110, 120);
    drawTextBox(`Sub Occupation: ${guarantor?.guarantor_occupation_sub || ""}`, 10, 135);
    drawTextBox(`Profession Type: ${guarantor?.guarantor_profession_type || ""}`, 110, 135);
    drawTextBox(`Business Type: ${guarantor?.guarantor_bussiness_type || ""}`, 10, 150);
    drawTextBox(`Business Name: ${guarantor?.guarantor_bussiness_name || ""}`, 110, 150);
    drawTextBox3(`Business Address: ${guarantor?.guarantor_bussiness_address || ""}`, 10, 165);

    doc.setFontSize(15);
    drawTextBox1("Property / Agriculture:", 10, 185);
    doc.setFontSize(12);
    drawTextBox(`Agri RTC No: ${guarantor?.guarantor_agri_rtc_no || ""}`, 10, 200);
    drawTextBox(`Land Holdings: ${guarantor?.guarantor_land_holdings || ""}`, 110, 200);
    drawTextBox(`All Docs Name: ${guarantor?.guarantor_all_document_name || ""}`, 10, 215);
    drawTextBox(`Consent Document: ${guarantor?.guarantor_consent_document || ""}`, 110, 215);
    drawTextBox3(`Description: ${guarantor?.guarantor_description || ""}`, 10, 230);

    // Footer
    doc.setFontSize(11);
    doc.text("I / We hereby confirm the above guarantor details are true to the best of my knowledge.", 12, 260);
    doc.text("Signature of the Subscriber", 10, 280);

    drawTextBoxWithMultipleLines(282);

    // Save
    const name = guarantor?.guarantor_name || guarantor?.user_guarantor || "Guarantor";
    doc.save(`${name.replace(/\s+/g, "_")}_GuarantorForm.pdf`);
  } catch (error) {
    console.error("Error generating Guarantor PDF:", error);
  }
};

export default handleGuarantorPrint;
