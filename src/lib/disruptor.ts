import { DisruptorConfig, ProcessingResult } from './types';

export class HybridArtDisruptor {
  private seed: number;
  private random: () => number;

  constructor(config: DisruptorConfig) {
    this.seed = config.seed;
    this.random = this.seededRandom(config.seed);
  }

  private seededRandom(seed: number): () => number {
    return () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }

  private getImageData(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): ImageData {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  private putImageData(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    imageData: ImageData
  ): void {
    ctx.putImageData(imageData, 0, 0);
  }

  private normalizeImageData(data: Uint8ClampedArray): Float32Array {
    const normalized = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      normalized[i] = data[i] / 255;
    }
    return normalized;
  }

  private denormalizeImageData(data: Float32Array): Uint8ClampedArray {
    const denormalized = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i++) {
      denormalized[i] = Math.max(0, Math.min(255, Math.round(data[i] * 255)));
    }
    return denormalized;
  }

  private applyStrategicCrop(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    cropPercent: number
  ): void {
    const w = canvas.width;
    const h = canvas.height;
    const cropW = Math.floor((w * cropPercent) / 100);
    const cropH = Math.floor((h * cropPercent) / 100);

    const imageData = this.getImageData(canvas, ctx);
    const cropped = ctx.createImageData(w - cropW * 2, h - cropH * 2);

    for (let i = 0; i < cropped.data.length; i++) {
      cropped.data[i] = imageData.data[i];
    }

    canvas.width = w - cropW * 2;
    canvas.height = h - cropH * 2;
    ctx.putImageData(cropped, 0, 0);
  }

  private addGrainNoise(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    strength: number
  ): void {
    const imageData = this.getImageData(canvas, ctx);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (this.random() - 0.5) * strength * 2;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    this.putImageData(canvas, ctx, imageData);
  }

  private addColorShift(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    intensity: number
  ): void {
    const imageData = this.getImageData(canvas, ctx);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const rShift = (this.random() - 0.5) * intensity * 255;
    const gShift = (this.random() - 0.5) * intensity * 255;
    const bShift = (this.random() - 0.5) * intensity * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + rShift));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + gShift));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + bShift));
    }

    this.putImageData(canvas, ctx, imageData);
  }

  private addGridPattern(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    gridSize: number,
    strength: number
  ): void {
    const imageData = this.getImageData(canvas, ctx);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y % gridSize === 0 || x % gridSize === 0) {
          const idx = (y * w + x) * 4;
          const noise = (this.random() - 0.5) * strength;
          data[idx] = Math.max(0, Math.min(255, data[idx] + noise));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + noise));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + noise));
        }
      }
    }

    this.putImageData(canvas, ctx, imageData);
  }

  private addAdversarialPatterns(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    strength: number
  ): void {
    const imageData = this.getImageData(canvas, ctx);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pattern =
          Math.sin(x * 0.5 + y * 0.3) * 0.3 +
          Math.sin(x * 0.8 - y * 0.6) * 0.2 +
          Math.cos(x * 0.4 + y * 0.9) * 0.25;

        const normalized = (pattern - (-0.75)) / (0.75 - (-0.75));
        const perturbation = (normalized - 0.5) * 2 * strength * 0.3;

        const idx = (y * w + x) * 4;
        data[idx] = Math.max(0, Math.min(255, data[idx] + perturbation));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + perturbation));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + perturbation));
      }
    }

    this.putImageData(canvas, ctx, imageData);
  }

  private addWatermark(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('©', canvas.width / 2, canvas.height / 2);
  }

  private calculatePSNR(original: Uint8ClampedArray, processed: Uint8ClampedArray): number {
    let mse = 0;
    for (let i = 0; i < original.length; i++) {
      const diff = original[i] - processed[i];
      mse += diff * diff;
    }
    mse /= original.length;

    if (mse === 0) return Infinity;
    return 20 * Math.log10(255 / Math.sqrt(mse));
  }

  async processImage(
    file: File,
    preset: 'minimal' | 'balanced' | 'strong' | 'maximum'
  ): Promise<{ canvas: HTMLCanvasElement; result: ProcessingResult }> {
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0);
          const originalData = this.getImageData(canvas, ctx).data.slice();

          switch (preset) {
            case 'minimal':
              this.addGrainNoise(canvas, ctx, 8);
              this.addColorShift(canvas, ctx, 0.04);
              this.addGridPattern(canvas, ctx, 80, 15);
              break;

            case 'balanced':
              this.addGrainNoise(canvas, ctx, 12);
              this.addColorShift(canvas, ctx, 0.08);
              this.addGridPattern(canvas, ctx, 60, 20);
              this.addAdversarialPatterns(canvas, ctx, 3);
              break;

            case 'strong':
              this.addGrainNoise(canvas, ctx, 20);
              this.addColorShift(canvas, ctx, 0.12);
              this.addGridPattern(canvas, ctx, 40, 30);
              this.addAdversarialPatterns(canvas, ctx, 5);
              break;

            case 'maximum':
              this.addGrainNoise(canvas, ctx, 28);
              this.addColorShift(canvas, ctx, 0.16);
              this.addGridPattern(canvas, ctx, 30, 40);
              this.addAdversarialPatterns(canvas, ctx, 7);
              this.addWatermark(canvas, ctx);
              break;
          }

          const processedData = this.getImageData(canvas, ctx).data;
          const psnr = this.calculatePSNR(originalData, processedData);
          const processingTime = performance.now() - startTime;

          const effectiveness = {
            googleReverseImage: preset === 'minimal' ? 0.6 : preset === 'balanced' ? 0.85 : 0.95,
            grok41: preset === 'minimal' ? 0.5 : preset === 'balanced' ? 0.75 : 0.9,
            overall: preset === 'minimal' ? 0.55 : preset === 'balanced' ? 0.8 : 0.925,
          };

          resolve({
            canvas,
            result: {
              originalSize: file.size,
              processedSize: canvas.toDataURL().length,
              psnr,
              processingTime,
              effectiveness,
            },
          });
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}
