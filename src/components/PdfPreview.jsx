import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point the worker to the bundled file so Vite can serve it
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfPreview = ({ url, className = '', renderAllPages = false }) => {
  const canvasRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    let loadingTask = null;

    const render = async () => {
      try {
        setLoading(true);
        setError(false);

        loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        if (cancelled) return;

        if (renderAllPages) {
          const container = pagesContainerRef.current;
          if (!container) return;

          container.innerHTML = '';

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            if (cancelled) return;

            const page = await pdf.getPage(pageNumber);
            const canvas = document.createElement('canvas');
            canvas.className = 'w-full h-auto rounded-lg';

            const baseViewport = page.getViewport({ scale: 1 });
            const targetWidth = container.clientWidth > 0 ? container.clientWidth : 700;
            const scale = targetWidth / baseViewport.width;
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            container.appendChild(canvas);

            await page.render({
              canvasContext: canvas.getContext('2d'),
              viewport,
            }).promise;
          }
        } else {
          const page = await pdf.getPage(1);
          const canvas = canvasRef.current;
          if (!canvas) return;

          const viewport = page.getViewport({ scale: 1 });
          const scale = canvas.offsetWidth > 0
            ? canvas.offsetWidth / viewport.width
            : 400 / viewport.width;

          const scaledViewport = page.getViewport({ scale });
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;

          await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: scaledViewport,
          }).promise;
        }
      } catch (err) {
        if (!cancelled) {
          console.error('PDF preview failed:', err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [url, renderAllPages]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-900 text-gray-400 ${className}`}>
        <svg className="w-12 h-12 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-xs">PDF Preview Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <svg className="animate-spin w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      )}
      {renderAllPages ? (
        <div
          ref={pagesContainerRef}
          className="space-y-4"
          style={{ display: loading ? 'none' : 'block' }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ display: loading ? 'none' : 'block' }}
        />
      )}
    </div>
  );
};

export default PdfPreview;