import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

// Configure PDF.js worker (only loaded when this component is imported)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfThumbnail = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <Document
        file={fileUrl}
        onLoadSuccess={() => {}}
        loading={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05001a]/50 backdrop-blur-sm">
            <div className="relative w-24 h-32 border border-white/10 rounded-lg overflow-hidden bg-white/5">
              {/* Pulsing Ghost Content */}
              <motion.div
                className="absolute inset-4 bg-white/5 rounded"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-x-4 top-16 h-2 bg-white/5 rounded"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              {/* Scanning Laser */}
              <motion.div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.span
              className="mt-4 text-[9px] font-mono text-purple-400 font-black uppercase tracking-[0.3em]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Decoding Metadata...
            </motion.span>
          </div>
        }
        error={
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-red-500/20" />
            <span className="text-[8px] font-mono text-red-500/40 uppercase tracking-widest">Load Error</span>
          </div>
        }
      >
        <Page
          pageNumber={1}
          width={280}
          devicePixelRatio={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow-2xl"
        />
      </Document>
    </div>
  );
};

export default PdfThumbnail;
