const download = require("downloadjs")
const downloadPdf = (pdfBytes, fileName) => {
    download(pdfBytes, fileName, "application/pdf");
}
export { downloadPdf };
