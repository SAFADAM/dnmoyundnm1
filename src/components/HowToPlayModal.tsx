import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Flame, Zap, ShieldAlert } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-xl bg-[#f9c944] border-8 border-black rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#000] text-black max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <div>
            <span className="font-pixel text-[10px] uppercase tracking-wider text-black font-bold">
              ★ REHBER ★
            </span>
            <h2 className="font-fnf text-3xl sm:text-4xl text-white fnf-text-stroke uppercase">
              NASIL OYNANIR?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-black text-[#f9c944] border-3 border-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Core Rules in FNF Style */}
        <div className="mt-4 space-y-3 font-pixel text-xs">
          {/* Rule 1: Sol Bariyer */}
          <div className="bg-black text-white p-3.5 rounded-2xl border-4 border-black flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#06b6d4] text-black flex items-center justify-center shrink-0 border-2 border-white font-bold">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-fnf text-lg text-[#06b6d4] tracking-wide mb-1">
                1. SOL BARİYER (SAĞA KAÇ!)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Sol bariyer geldiğinde hem <strong>Sol</strong> hem <strong>Orta</strong> şerit kapanır. Boş yer sadece <strong>Sağda</strong> kalır! <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-cyan-300">D</kbd> veya <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-cyan-300">➡️</kbd> tuşuna basıp sağa kaç! Kaçtıktan sonra karakter otomatik olarak <strong>ortaya geri döner</strong>.
              </p>
            </div>
          </div>

          {/* Rule 2: Sağ Bariyer */}
          <div className="bg-black text-white p-3.5 rounded-2xl border-4 border-black flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#06b6d4] text-black flex items-center justify-center shrink-0 border-2 border-white font-bold">
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-fnf text-lg text-[#06b6d4] tracking-wide mb-1">
                2. SAĞ BARİYER (SOLA KAÇ!)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Sağ bariyer geldiğinde hem <strong>Sağ</strong> hem <strong>Orta</strong> şerit kapanır. Boş yer sadece <strong>Solda</strong> kalır! <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-cyan-300">A</kbd> veya <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-cyan-300">⬅️</kbd> tuşuna basıp sola kaç! Kaçtıktan sonra karakter otomatik olarak <strong>ortaya geri döner</strong>.
              </p>
            </div>
          </div>

          {/* Rule 3: Alttan Engel (Zıpla) */}
          <div className="bg-black text-white p-3.5 rounded-2xl border-4 border-black flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-black flex items-center justify-center shrink-0 border-2 border-white font-bold">
              <ArrowUp className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-fnf text-lg text-[#f59e0b] tracking-wide mb-1">
                3. ALTTAN ENGEL (ZIPLA!)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Yoldan elektrikli zemin bariyeri gelir! <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-yellow-300">W</kbd>, <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-yellow-300">⬆️</kbd> veya <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-yellow-300">Space</kbd> tuşuna basarak üstünden zıpla!
              </p>
            </div>
          </div>

          {/* Rule 4: Üstten Gelen Engel (Eğil / Kay) */}
          <div className="bg-black text-white p-3.5 rounded-2xl border-4 border-black flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ec4899] text-white flex items-center justify-center shrink-0 border-2 border-white font-bold">
              <ArrowDown className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-fnf text-lg text-[#ec4899] tracking-wide mb-1">
                4. ÜSTTEN YUKARIDAN ENGEL (EĞİL / KAY!)
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Yukarıdan, gökyüzünden kafana doğru inen giyotin/plazma engeli! <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-pink-300">S</kbd> veya <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 text-pink-300">⬇️</kbd> tuşuna basarak altına eğil veya kay!
              </p>
            </div>
          </div>

          {/* Rule 5: Ardışık Hata ve Patlama */}
          <div className="bg-black text-white p-3.5 rounded-2xl border-4 border-rose-600 flex items-start gap-3 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 border-2 border-white font-bold animate-pulse">
              <Flame className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-fnf text-lg text-rose-500 tracking-wide mb-1">
                💥 ARDIŞIK HATA & ANİ PATLAMA!
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Üst üste <strong>3 hata</strong> yaparsan siber reaktör kritik sıcaklığa ulaşır ve <strong>BİR ANDA PATLAR</strong>! Ritmi kaçırmadan engelleri atlatmalısın.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-black text-[#f9c944] font-fnf text-2xl border-4 border-white hover:bg-slate-900 cursor-pointer fnf-box-shadow active:scale-95 transition-transform"
          >
            ANLADIM, OYUNA BAŞLA!
          </button>
        </div>
      </div>
    </div>
  );
};
