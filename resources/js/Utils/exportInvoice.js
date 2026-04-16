import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

export function downloadPDF() {
    const el = document.getElementById("invoice");
    html2pdf().from(el).save("invoice.pdf");
}

export function downloadImage() {
    const el = document.getElementById("invoice");

    html2canvas(el).then((canvas) => {
        const link = document.createElement("a");
        link.download = "invoice.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}
