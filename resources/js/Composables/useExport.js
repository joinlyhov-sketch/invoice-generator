import { ref } from "vue";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

export function useExport() {
    const isExporting = ref(false);
    const exportError = ref(null);

    const exportToPDF = async (elementId, filename = "invoice") => {
        isExporting.value = true;
        exportError.value = null;

        try {
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error("Element not found");
            }

            // Clone the element to avoid issues with scaled preview
            const clone = element.cloneNode(true);

            // Create a hidden container for the clone at full scale
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.left = "-9999px";
            container.style.top = "0";
            container.style.width = "750px";
            container.style.backgroundColor = "#ffffff";
            container.appendChild(clone);
            document.body.appendChild(container);

            const opt = {
                margin: 0,
                filename: `${filename}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    width: 750,
                    windowWidth: 750,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
            };

            await html2pdf().set(opt).from(clone).save();

            // Clean up
            document.body.removeChild(container);
        } catch (error) {
            exportError.value = error.message || "Export failed";
            console.error("PDF export error:", error);
        } finally {
            isExporting.value = false;
        }
    };

    const exportToImage = async (
        elementId,
        filename = "invoice",
        format = "png",
    ) => {
        isExporting.value = true;
        exportError.value = null;

        try {
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error("Element not found");
            }

            // Clone the element to avoid issues with scaled preview
            const clone = element.cloneNode(true);

            // Create a hidden container for the clone at full scale
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.left = "-9999px";
            container.style.top = "0";
            container.style.width = "750px";
            container.style.backgroundColor = "#ffffff";
            container.appendChild(clone);
            document.body.appendChild(container);

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: 750,
                windowWidth: 750,
            });

            const link = document.createElement("a");
            link.download = `${filename}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 1);
            link.click();

            // Clean up
            document.body.removeChild(container);
        } catch (error) {
            exportError.value = error.message || "Export failed";
            console.error("Image export error:", error);
        } finally {
            isExporting.value = false;
        }
    };

    return {
        isExporting,
        exportError,
        exportToPDF,
        exportToImage,
    };
}
