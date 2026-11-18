import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ToolGrid from './components/ToolGrid';
import HowToGuides from './components/HowToGuides';
import { ArrowLeft, Sparkles, Shield, Heart } from 'lucide-react';

// Tool Components
import MergePdfTool from './components/tools/MergePdfTool';
import DeletePagesTool from './components/tools/DeletePagesTool';
import PdfEditorTool from './components/tools/PdfEditorTool';
import CompressPdfTool from './components/tools/CompressPdfTool';
import SplitPdfTool from './components/tools/SplitPdfTool';
import RotatePdfTool from './components/tools/RotatePdfTool';
import WatermarkTool from './components/tools/WatermarkTool';
import ProtectPdfTool from './components/tools/ProtectPdfTool';
import PdfToJpgTool from './components/tools/PdfToJpgTool';
import JpgToPdfTool from './components/tools/JpgToPdfTool';
import CropPdfTool from './components/tools/CropPdfTool';
import PageNumbersTool from './components/tools/PageNumbersTool';
import ExtractTextTool from './components/tools/ExtractTextTool';

export default function App() {
  const [currentTool, setCurrentTool] = useState(null);
  const [initialFiles, setInitialFiles] = useState([]);

  // Handles files dropped on homepage hero
  const handleHeroUpload = (files) => {
    setInitialFiles(files);
    if (files.length > 1) {
      setCurrentTool('merge-pdf');
    } else {
      const first = files[0];
      if (first.type.startsWith('image/')) {
        setCurrentTool('jpg-to-pdf');
      } else {
        setCurrentTool('pdf-editor');
      }
    }
  };

  const handleSelectTool = (toolId) => {
    setCurrentTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentTool(null);
    setInitialFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderToolComponent = () => {
    const singleFile = initialFiles.length > 0 ? initialFiles[0] : null;

    switch (currentTool) {
      case 'merge-pdf':
      case 'alternate-mix-pdf':
      case 'organize-pdf':
        return <MergePdfTool initialFiles={initialFiles} />;
      
      case 'delete-pdf-pages':
        return <DeletePagesTool initialFile={singleFile} />;
      
      case 'pdf-editor':
      case 'sign-pdf':
      case 'flatten-pdf':
        return <PdfEditorTool initialFile={singleFile} />;
      
      case 'compress-pdf':
        return <CompressPdfTool initialFile={singleFile} />;
      
      case 'split-pdf':
      case 'extract-pdf-pages':
        return <SplitPdfTool initialFile={singleFile} />;
      
      case 'rotate-pdf-pages':
        return <RotatePdfTool initialFile={singleFile} />;
      
      case 'watermark-pdf':
        return <WatermarkTool initialFile={singleFile} />;
      
      case 'encrypt-pdf':
      case 'unlock-pdf':
        return <ProtectPdfTool initialFile={singleFile} />;
      
      case 'pdf-to-jpg':
        return <PdfToJpgTool initialFile={singleFile} />;
      
      case 'jpg-to-pdf':
        return <JpgToPdfTool />;
      
      case 'crop-pdf':
        return <CropPdfTool initialFile={singleFile} />;
      
      case 'page-numbers-pdf':
      case 'header-footer-pdf':
        return <PageNumbersTool initialFile={singleFile} />;
      
      case 'extract-text-from-pdf':
      case 'pdf-to-word':
      case 'pdf-to-excel':
        return <ExtractTextTool initialFile={singleFile} />;
      
      default:
        return <PdfEditorTool initialFile={singleFile} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Banner for Poor / Community Access */}
      <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <Heart className="w-3.5 h-3.5 fill-white text-white" />
        <span>
          100% Free PDF Tools for Students, Educators & Community. No paywall, no limits, no sign-up!
        </span>
      </div>

      {/* Main Header */}
      <Header
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
      />

      {/* Content Area */}
      <main className="flex-1">
        {currentTool ? (
          <div className="py-8">
            {/* Breadcrumb & Back button */}
            <div className="max-w-6xl mx-auto px-4 mb-4">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to all tools</span>
              </button>
            </div>

            {/* Active Tool View */}
            {renderToolComponent()}
          </div>
        ) : (
          <>
            {/* Sejda Homepage Clone Hero */}
            <HeroSection
              onUploadFile={handleHeroUpload}
              onSelectTool={handleSelectTool}
            />

            {/* Free and Offline feature section matching Sejda */}
            <section className="bg-slate-50 py-12 border-y border-gray-200">
              <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Online or offline — in the browser or on your computer
                </h3>
                <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                  Files are processed completely locally in your web browser. No files are uploaded to any third-party server, guaranteeing absolute confidentiality for personal documents, homework, and office files.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Zero Data Tracking</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>High-Speed WebAssembly</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Comprehensive Tools Directory Grid */}
            <ToolGrid onSelectTool={handleSelectTool} />

            {/* Step-by-Step Educational Guides */}
            <HowToGuides onSelectTool={handleSelectTool} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} />
    </div>
  );
}

