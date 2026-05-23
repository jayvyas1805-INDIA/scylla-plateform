import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function DocumentPreview({
  doc,
  docs = [],
  index = 0,
  onClose,
  onApprove,
  onReject,
}) {
  const containerRef = useRef(null);
  // const canvasRef = useRef(null);
  // const renderTaskRef = useRef(null);

  // const [pdf, setPdf] = useState(null);
  // const [pageNum, setPageNum] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  /* ================= BODY LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  /* ================= LOAD PDF ================= */
  //  useEffect(() => {
  //   if (!doc?.pdfUrl) {
  //     setPdf(null);
  //     return;
  //   }

  //   let cancelled = false;

  //   const loadingTask = pdfjsLib.getDocument({
  //     url: doc.pdfUrl,
  //     withCredentials: false,
  //   });

  //   loadingTask.promise
  //     .then((loadedPdf) => {
  //       if (!cancelled) {
  //         setPdf(loadedPdf);
  //         setPageNum(1);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("PDF LOAD FAILED ❌", err);
  //       setPdf(null);
  //     });

  //   return () => {
  //     cancelled = true;
  //     loadingTask.destroy?.();
  //   };
  // }, [doc]);



  /* ================= RENDER PAGE ================= */
  //  useEffect(() => {
  //   if (!pdf || !canvasRef.current) return;

  //   const renderPage = async () => {
  //     try {
  //       const page = await pdf.getPage(pageNum);
  //       const viewport = page.getViewport({ scale: 1.2 });

  //       const canvas = canvasRef.current;
  //       const ctx = canvas.getContext("2d");

  //       canvas.width = viewport.width;
  //       canvas.height = viewport.height;

  //       renderTaskRef.current?.cancel();

  //       renderTaskRef.current = page.render({
  //         canvasContext: ctx,
  //         viewport,
  //       });

  //       await renderTaskRef.current.promise;
  //     } catch (err) {
  //       console.error("PDF RENDER ERROR ❌", err);
  //     }
  //   };

  //   renderPage();
  // }, [pdf, pageNum]);


  if (!doc) return null;

  /* ================= HELPERS ================= */
  const handleDownload = () => {
    if (doc.pdfUrl) {
      const a = document.createElement("a");
      a.href = doc.pdfUrl;
      a.download = doc.title || "document.pdf";
      a.click();
    } else {
      window.print();
    }
  };

  const formattedDate = doc.effectiveDate
    ? new Date(doc.effectiveDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "—";

  const receivingParty = doc.receivingParty || "Receiving Party";

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={containerRef}
          className="w-[95%] max-w-6xl bg-[#0e1628] rounded-xl shadow-2xl overflow-hidden"
        >
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <h2 className="text-white text-lg font-semibold">{doc.title}</h2>
              <p className="text-slate-400 text-sm">
                {doc.owner} • {doc.type}
              </p>
            </div>
            <button onClick={onClose} className="text-xl text-slate-400">
              ✕
            </button>
          </div>

      {/* TOOLBAR */}
      <div className="flex justify-between items-center px-6 py-3 bg-[#0b1220] border-b border-white/10">
            <div /> 
            {/* empty left side */}

      <div className="flex gap-3">
              <button onClick={handleDownload} className={btnBlue}>
                Download
              </button>

              {doc.status === "Pending" && (
                <>
                  <button
                    onClick={() => setConfirmAction("reject")}
                    className={btnRed}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setConfirmAction("approve")}
                    className={btnGreen}
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>

      {/* CONTENT */}
      {/* CONTENT */}
      <div className="relative h-[80vh] overflow-auto bg-[#f4f6f9] p-6">
        <div className="mx-auto bg-white shadow-xl relative max-w-[820px]">
          <div className="absolute inset-0 border-[4px] border-cyan-500 pointer-events-none" />

          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              doc.pdfUrl
            )}&embedded=true`}
            className="w-full h-[75vh]"
            title="Verification Document"
          />

        </div>
      </div>

      {/* </div>
      </div> */}


      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#0e1628] rounded-lg p-6 w-[320px] text-center">
            <h3 className="text-white text-lg mb-4 capitalize">
              {confirmAction} document?
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  confirmAction === "approve"
                    ? onApprove(doc)
                    : onReject(doc);
                  setConfirmAction(null);
                  onClose();
                }}
                className={confirmAction === "approve" ? btnGreen : btnRed}
              >
                Confirm
              </button>
              <button onClick={() => setConfirmAction(null)} className={btn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>

    </>
  );
}

/* ================= BUTTON STYLES ================= */
const btn =
  "px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20";
const btnGreen =
  "px-4 py-2 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30";
const btnRed =
  "px-4 py-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30";
const btnBlue =
  "px-4 py-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30";
