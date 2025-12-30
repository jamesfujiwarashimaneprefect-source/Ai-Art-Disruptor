import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { ProcessingResult } from '../lib/types';

interface ProcessingResultsProps {
  result: ProcessingResult;
  processedImageUrl: string;
  originalImageUrl: string;
}

export function ProcessingResults({
  result,
  processedImageUrl,
  originalImageUrl,
}: ProcessingResultsProps) {
  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'protected-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const overallScore = (result.effectiveness.overall * 100).toFixed(0);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
        <div>
          <p className="font-semibold text-green-900">Processing Complete</p>
          <p className="text-sm text-green-700">Your image has been successfully protected</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Original</h4>
          <img src={originalImageUrl} alt="Original" className="rounded-lg w-full h-auto" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Protected</h4>
          <img src={processedImageUrl} alt="Protected" className="rounded-lg w-full h-auto" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-4">Effectiveness Summary</h4>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Overall Protection</p>
              <p className="text-lg font-bold text-blue-600">{overallScore}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${result.effectiveness.overall * 100}%` }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Reverse Image Search</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.effectiveness.googleReverseImage * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 w-12">
                  {(result.effectiveness.googleReverseImage * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-3">AI Model Training</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.effectiveness.aiModelTraining * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 w-12">
                  {(result.effectiveness.aiModelTraining * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Quality Metrics</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">PSNR</span>
              <span className="font-semibold text-gray-900">{result.psnr.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Processing Time</span>
              <span className="font-semibold text-gray-900">{result.processingTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Higher PSNR = Less visible change</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-3">File Info</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Original</span>
              <span className="font-semibold text-gray-900">{(result.originalSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Protected</span>
              <span className="font-semibold text-gray-900">{(result.processedSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Notes</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Protection is not guaranteed against dedicated attacks</li>
              <li>Tests show effectiveness on common reverse search and model inference</li>
              <li>Add a watermark for additional legal protection</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        <Download size={20} />
        Download Protected Image
      </button>
    </div>
  );
}
