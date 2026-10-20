import { CONTACT, formatKES, type Inspiration } from "./kay";

async function toDataUrl(src: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d")!.drawImage(img, 0, 0);
    return c.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

export async function downloadInspiration(insp: Inspiration) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  doc.setFillColor(110, 22, 45);
  doc.rect(0, 0, W, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text("Kay Events", 14, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(insp.event_type + " Inspiration", W - 14, 15, { align: "right" });

  let y = 32;
  if (insp.image_url) {
    const data = await toDataUrl(insp.image_url);
    if (data) {
      doc.addImage(data, "JPEG", 14, y, W - 28, 90);
      y += 98;
    }
  }
  doc.setTextColor(60, 20, 30);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(insp.title, 14, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const desc = doc.splitTextToSize(insp.description, W - 28);
  doc.text(desc, 14, y);
  y += desc.length * 5 + 6;

  doc.setFont("helvetica", "bold");
  doc.text(`Package price: ${formatKES(insp.price)}`, 14, y);
  doc.text(`Setup duration: ${insp.setup_duration}`, W - 14, y, { align: "right" });
  y += 10;

  doc.setFontSize(12);
  doc.text("Budget plan", 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let total = 0;
  for (const b of insp.budget_items) {
    doc.text(b.item, 16, y);
    doc.text(formatKES(b.cost), W - 16, y, { align: "right" });
    doc.setDrawColor(230, 200, 210);
    doc.line(14, y + 2, W - 14, y + 2);
    total += Number(b.cost);
    y += 8;
  }
  doc.setFont("helvetica", "bold");
  doc.text("Budget total", 16, y);
  doc.text(formatKES(total), W - 16, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 80, 90);
  doc.text(
    `Book us: ${CONTACT.email} | ${CONTACT.phone} | IG @${CONTACT.instagram} | TikTok @${CONTACT.tiktok}`,
    W / 2,
    287,
    { align: "center" },
  );
  doc.save(`kay-events-${insp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
}
