"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import {
  Download as DownloadIcon,
  FileText as FileTextIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { version as pdfjsVersion } from "pdfjs-dist";

const Home: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [reference, setReference] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [template, setTemplate] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch("/api/getTemplate", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplate(data.content);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, []);

  const handleGenerate = () => {
    if (!template) {
      console.error("Template is not loaded");
      return;
    }

    const generatedLetter = template
      .replace(/\$\{companyName\}/g, companyName)
      .replace(/\$\{jobRole\}/g, jobRole)
      .replace(/\$\{reference\}/g, reference);

    setCoverLetter(generatedLetter);
    setIsGenerated(true);
    generatePdf(generatedLetter);
  };

  const generatePdf = (letter: string) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margins = { top: 10, left: 10, bottom: 10, right: 10 };
    const pageWidth = doc.internal.pageSize.getWidth();
    const textLines = doc.splitTextToSize(
      letter,
      pageWidth - margins.left - margins.right
    );

    doc.setFont("helvetica");
    doc.setFontSize(11);

    doc.text(textLines, margins.left, margins.top);

    const pdfOutput = doc.output("blob");
    setPdfBlob(pdfOutput);
  };

  const handleDownload = () => {
    if (!pdfBlob) {
      console.error("No PDF to download");
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `Jess_Barbosa_Cover_Letter_${companyName || "Default"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Cover Letter Generator
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Input form on the left-hand side */}
        <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <Label className="text-white">Company Name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full mt-2"
            />
          </div>
          <div className="mb-4">
            <Label className="text-white">Job Role</Label>
            <Input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full mt-2"
            />
          </div>
          <div className="mb-4">
            <Label className="text-white">Reference</Label>
            <Input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full mt-2"
            />
          </div>
          <Button
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-700"
            icon={<FileTextIcon />}
          >
            Generate Cover Letter
          </Button>
        </div>

        <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="bg-gray-700 p-4 rounded w-full">
            <h2 className="text-2xl font-semibold mb-2">
              Generated Cover Letter
            </h2>
            <Button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 mb-4"
              icon={<DownloadIcon />}
            >
              Download Cover Letter
            </Button>
            {pdfBlob && (
              <div className="mt-4">
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
                </Worker>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
