import pdfParse from 'pdf-parse';
async function readFileAsBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result instanceof ArrayBuffer) {
                const buffer = Buffer.from(event.target.result);
                resolve(buffer);
            } else {
                reject(new Error('Failed to read file as buffer.'));
            }
        };

        reader.onerror = (event) => {
            reject(new Error(`FileReader error: ${event.target?.error}`));
        };

        reader.readAsArrayBuffer(file);
    });
}
export async function extractTextFromPDF(pdfFile: File): Promise<string> {
    try {
        const pdfBuffer = await readFileAsBuffer(pdfFile);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
    } catch (error) {
        throw new Error(`Error extracting text from PDF: ${error}`);
    }
}

