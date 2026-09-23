import React from 'react';
import { X, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

interface ReadMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadMeModal: React.FC<ReadMeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#f9c944] border-8 border-black rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#000] text-black max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black text-[#f9c944] flex items-center justify-center border-2 border-white font-bold shrink-0">
              <Lock className="w-5 h-5 text-[#f9c944]" />
            </div>
            <div>
              <span className="font-pixel text-[10px] uppercase tracking-wider text-black font-bold">
                ★ ÖNEMLİ BİLGİLENDİRME ★
              </span>
              <h2 className="font-fnf text-2xl sm:text-3xl text-white fnf-text-stroke uppercase">
                📖 OKU BENİ
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black text-[#f9c944] border-2 border-white flex items-center justify-center hover:bg-slate-900 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Kapat"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Core Notice Message */}
        <div className="mt-5 space-y-4">
          {/* Main Attention Card */}
          <div className="bg-black text-white p-4 sm:p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
              <span className="font-pixel text-xs tracking-wider uppercase font-bold">
                DİKKAT / TAVSİYE BİLDİRİMİ
              </span>
            </div>

            {/* Exact requested text highlighted */}
            <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-3.5 sm:p-4 text-center">
              <p className="font-sans text-base sm:text-lg font-extrabold text-rose-200 tracking-wide leading-relaxed">
                bu oyun tavsiye için yapılmıştır öneri oyundur lütfen <span className="text-yellow-300 underline underline-offset-4 decoration-rose-500 decoration-2">PAYLAŞMAYINIZ</span>
              </p>
            </div>

            <p className="mt-3.5 text-xs text-slate-300 font-sans leading-relaxed">
              Bu uygulama yalnızca öneri ve kişisel inceleme amacıyla hazırlanmıştır. Projeyi, kaynakları veya erişim bağlantılarını üçüncü şahıslarla paylaşmayınız.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white/80 p-3 rounded-xl border-3 border-black flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="font-pixel text-[10px] text-slate-900">
                <strong>ÖNERİ PROJESİDİR</strong>
                <p className="font-sans text-[11px] text-slate-700">Tavsiye niteliğindedir.</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border-3 border-black flex items-center gap-2.5">
              <Lock className="w-6 h-6 text-rose-600 shrink-0" />
              <div className="font-pixel text-[10px] text-slate-900">
                <strong>GİZLİ TUTUNUZ</strong>
                <p className="font-sans text-[11px] text-slate-700">Lütfen paylaşmayınız.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-5 pt-3 border-t-4 border-black flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-black text-white hover:bg-slate-900 font-pixel text-xs px-6 py-2.5 rounded-xl border-2 border-white shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>ANLADIM, TEŞEKKÜRLER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
