import { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ProtectionPresets } from './components/ProtectionPresets';
import { ProcessingResults } from './components/ProcessingResults';
import { ProcessingStatus } from './components/ProcessingStatus';
import { HybridArtDisruptor } from './lib/disruptor';
import { ProcessingResult } from './lib/types';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<'minimal' | 'balanced' | 'strong' | 'maximum'>('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const disruptor = new HybridArtDisruptor({
        preset,
        method: 'hybrid',
        seed: 1337,
      });

      const { canvas, result: processingResult } = await disruptor.processImage(selectedFile, preset);

      setProcessedImageUrl(canvas.toDataURL('image/png'));
      setResult(processingResult);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {result && processedImageUrl ? (
          <ProcessingResults
            result={result}
            processedImageUrl={processedImageUrl}
            originalImageUrl={originalImageUrl}
          />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
                <ImageUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </div>

              {selectedFile && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Ready to Protect</h3>
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    </div>
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Protect Image'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit sticky top-4">
              <ProtectionPresets
                selectedPreset={preset}
                onPresetChange={setPreset}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}
      </div>

      <ProcessingStatus isProcessing={isProcessing} currentStep="Applying protection layers..." />

      {result && (
        <div className="fixed bottom-6 right-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-sm">
          <p className="text-sm text-blue-900">
            ✓ Protection applied successfully. Test the image with Google Images and Grok to verify.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
