import { Shield } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Shield className="text-blue-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold">Art Disruptor</h1>
        </div>
        <p className="text-slate-300 max-w-2xl">
          Protect your artwork from AI recognition systems. Keep your images visible to humans while preventing
          Grok 4.1 and Google Reverse Image Search from matching them.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-blue-400">100%</p>
            <p className="text-sm text-slate-400">Privacy Focused</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">Local</p>
            <p className="text-sm text-slate-400">Processing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">Multiple</p>
            <p className="text-sm text-slate-400">Techniques</p>
          </div>
        </div>
      </div>
    </div>
  );
}
