"use client";

import { Icon } from "@/components/Icon";

function plainText(title, books) {
  const lines = books.map((book, index) => {
    const authors = book.authors?.map((author) => author.name).join(", ") || "Unknown author";
    return `${index + 1}. ${book.title} - ${authors}`;
  });
  return `${title}\n\n${lines.join("\n") || "No books saved."}`;
}

export default function ExportTools({ title, books }) {
  const text = plainText(title, books);

  async function copyText() {
    await navigator.clipboard.writeText(text);
  }

  function exportPdf() {
    const escapePdf = (value) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const rows = text.split("\n").flatMap((line) => {
      if (line.length <= 82) return [line];
      return line.match(/.{1,82}(\s|$)/g) || [line];
    });
    const commands = ["BT", "/F1 12 Tf", "50 780 Td", "18 TL", ...rows.map((line, index) => `${index === 0 ? "" : "T* "}(${escapePdf(line.trim())}) Tj`), "ET"].join("\n");
    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >> endobj",
      `5 0 obj << /Length ${commands.length} >> stream\n${commands}\nendstream endobj`
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object) => {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyShareLink() {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(books))));
    const url = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(payload)}`;
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copyText} type="button" className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 bg-white/75 px-4 py-2 text-sm font-bold transition-colors duration-200 hover:border-plum hover:text-plum"><Icon name="copy" className="h-4 w-4" />Copy text</button>
      <button onClick={exportPdf} type="button" className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 bg-white/75 px-4 py-2 text-sm font-bold transition-colors duration-200 hover:border-plum hover:text-plum"><Icon name="file" className="h-4 w-4" />Export PDF</button>
      <button onClick={copyShareLink} type="button" className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 bg-white/75 px-4 py-2 text-sm font-bold transition-colors duration-200 hover:border-plum hover:text-plum"><Icon name="link" className="h-4 w-4" />Copy share link</button>
    </div>
  );
}
