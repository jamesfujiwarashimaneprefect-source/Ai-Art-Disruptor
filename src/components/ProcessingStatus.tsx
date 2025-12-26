import { Loader } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  currentStep?: string;
}

export function ProcessingStatus({ isProcessing, currentStep }: ProcessingStatusProps) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="font-semibold text-gray-900 text-center">Processing Your Image</p>
          {currentStep && <p className="text-sm text-gray-600 text-center mt-2">{currentStep}</p>}
          <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
            <div className="bg-blue-600 h-1 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
