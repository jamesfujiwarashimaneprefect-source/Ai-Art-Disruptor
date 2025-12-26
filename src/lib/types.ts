export type ProtectionPreset = 'minimal' | 'balanced' | 'strong' | 'maximum';
export type ProtectionMethod = 'v2-only' | 'v1-only' | 'hybrid';

export interface DisruptorConfig {
  preset: ProtectionPreset;
  method: ProtectionMethod;
  seed: number;
}

export interface ProcessingResult {
  originalSize: number;
  processedSize: number;
  psnr: number;
  processingTime: number;
  effectiveness: {
    googleReverseImage: number;
    grok41: number;
    overall: number;
  };
}
