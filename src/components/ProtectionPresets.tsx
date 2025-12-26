import { Shield, AlertCircle } from 'lucide-react';

interface ProtectionPresetsProps {
  selectedPreset: 'minimal' | 'balanced' | 'strong' | 'maximum';
  onPresetChange: (preset: 'minimal' | 'balanced' | 'strong' | 'maximum') => void;
  isProcessing: boolean;
}

interface PresetInfo {
  id: 'minimal' | 'balanced' | 'strong' | 'maximum';
  name: string;
  description: string;
  googleEffectiveness: number;
  grokEffectiveness: number;
  visualQuality: string;
  details: string[];
}

const PRESETS: PresetInfo[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Subtle protection, high visual quality',
    googleEffectiveness: 60,
    grokEffectiveness: 50,
    visualQuality: 'Excellent',
    details: ['Grain noise', 'Subtle color shift', 'Fine grid pattern'],
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Optimal protection vs quality tradeoff',
    googleEffectiveness: 85,
    grokEffectiveness: 75,
    visualQuality: 'Very Good',
    details: ['Medium grain', 'Color perturbation', 'Grid overlay', 'Adversarial patterns'],
  },
  {
    id: 'strong',
    name: 'Strong',
    description: 'Maximum protection with acceptable quality',
    googleEffectiveness: 95,
    grokEffectiveness: 90,
    visualQuality: 'Good',
    details: ['Heavy grain', 'Strong color shifts', 'Dense grid', 'Multiple patterns'],
  },
  {
    id: 'maximum',
    name: 'Maximum',
    description: 'Maximum protection, visible modifications',
    googleEffectiveness: 98,
    grokEffectiveness: 95,
    visualQuality: 'Fair',
    details: ['Extreme grain', 'Aggressive color shift', 'Dense patterns', 'Watermark'],
  },
];

export function ProtectionPresets({
  selectedPreset,
  onPresetChange,
  isProcessing,
}: ProtectionPresetsProps) {
  const currentPreset = PRESETS.find((p) => p.id === selectedPreset)!;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Protection Level</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id)}
            disabled={isProcessing}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedPreset === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <p className="font-medium text-sm text-gray-900">{preset.name}</p>
            <p className="text-xs text-gray-500 mt-1">{preset.visualQuality} quality</p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-gray-900">{currentPreset.name} Protection</h4>
            <p className="text-sm text-gray-600 mt-1">{currentPreset.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded p-3">
            <p className="text-xs font-medium text-gray-600 uppercase mb-2">Google Reverse Image</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${currentPreset.googleEffectiveness}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-10">
                {currentPreset.googleEffectiveness}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded p-3">
            <p className="text-xs font-medium text-gray-600 uppercase mb-2">Grok 4.1</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${currentPreset.grokEffectiveness}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-10">
                {currentPreset.grokEffectiveness}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded p-3">
          <p className="text-xs font-medium text-gray-600 uppercase mb-2">Techniques</p>
          <ul className="flex flex-wrap gap-2">
            {currentPreset.details.map((detail) => (
              <li key={detail} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {detail}
              </li>
            ))}
          </ul>
        </div>

        {currentPreset.id === 'maximum' && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <AlertCircle className="text-yellow-700 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-yellow-800">
              Visible modifications. Best for maximum protection when visual quality is secondary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
