import pdfMake from 'pdfmake/build/pdfmake';
import { mdpdfmake } from 'mdpdfmake';

// Регистрация шрифтов через require (обход проблем с типами)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfFonts = require('pdfmake/build/vfs_fonts');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// Экспорт markdown в PDF
export async function exportToPdf(markdown: string, filename: string = 'document.pdf'): Promise<void> {
  try {
    const docDefinition = await mdpdfmake(markdown, {
      headingFontSizes: [24, 20, 16, 14, 12, 11],
      headingUnderline: false,
    });

    pdfMake.createPdf(docDefinition).download(filename);
  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    throw error;
  }
}

// Открыть PDF для печати (preview)
export async function printToPdf(markdown: string): Promise<void> {
  try {
    const docDefinition = await mdpdfmake(markdown, {
      headingFontSizes: [24, 20, 16, 14, 12, 11],
      headingUnderline: false,
    });

    pdfMake.createPdf(docDefinition).print();
  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    throw error;
  }
}
