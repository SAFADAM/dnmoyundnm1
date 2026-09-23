import React, { useState } from 'react';
import { X, Smartphone, Download, ExternalLink, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#f9c944] border-8 border-black rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#000] text-black max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black text-[#06b6d4] flex items-center justify-center border-2 border-white font-bold shrink-0">
              <Smartphone className="w-6 h-6 text-[#06b6d4]" />
            </div>
            <div>
              <span className="font-pixel text-[10px] uppercase tracking-wider text-black font-bold">
                ★ MOBİL & ANDROID ★
              </span>
              <h2 className="font-fnf text-2xl sm:text-3xl text-white fnf-text-stroke uppercase">
                APK & YÜKLEME
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

        {/* Content Body */}
        <div className="mt-4 space-y-4 font-sans text-xs">
          {/* Method 1: Instant PWA Android App Installation */}
          <div className="bg-black text-white p-4 rounded-2xl border-4 border-black shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-xs text-[#06b6d4] tracking-wide">
                1. YÖNTEM: ANINDA UYGULAMA OLARAK YÜKLE (ÖNERİLEN)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-pixel text-[9px] px-2 py-0.5 rounded border border-emerald-400">
                HIZLI
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
              Bu oyun tam <strong>PWA (Progressive Web App)</strong> olarak hazırlanmıştır. Telefonunuza doğrudan APK gibi yüklenir, ana ekranınıza simgesi gelir ve tarayıcı çubuğu olmadan tam ekran çalışır.
            </p>

            {isInstalled ? (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500 rounded-xl flex items-center gap-2 text-emerald-300 font-pixel text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>UYGULAMA ZATEN CİHAZINIZA YÜKLÜ!</span>
              </div>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={install}
                className="w-full py-3 px-4 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 font-fnf text-base sm:text-lg uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#fff] cursor-pointer transition-all hover:scale-102 active:scale-98"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>TELEFONA YÜKLE (TEK TIKLA)</span>
              </button>
            ) : isIOS ? (
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1.5 text-slate-300">
                <span className="font-pixel text-[10px] text-pink-400 block">IPHONE / IPAD İÇİN:</span>
                <p className="text-[11px]">
                  1. Safari alt menüsündeki <strong>Paylaş (Share)</strong> simgesine dokunun.<br />
                  2. <strong>Ana Ekrana Ekle</strong> butonunu seçin.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1.5 text-slate-300">
                <span className="font-pixel text-[10px] text-cyan-400 block">CHROME / ANDROID İÇİN:</span>
                <p className="text-[11px]">
                  Tarayıcınızın sağ üstündeki <strong>üç nokta (⋮)</strong> menüsüne tıklayın ve <strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğine dokunun.
                </p>
              </div>
            )}
          </div>

          {/* Method 2: Convert to Standalone .APK File via PWABuilder */}
          <div className="bg-black text-white p-4 rounded-2xl border-4 border-black shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-xs text-[#f9c944] tracking-wide">
                2. YÖNTEM: .APK DOSYASI İNDİRMEK İÇİN
              </span>
              <span className="bg-amber-500/20 text-amber-300 font-pixel text-[9px] px-2 py-0.5 rounded border border-amber-400">
                PWABUILDER
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed mb-3">
              Uygulamanın manifest ve service worker dosyaları APK oluşturmak için %100 hazırdır. <strong>PWABuilder</strong> ile 10 saniyede resmi <code>.apk</code> dosyasını derleyebilirsiniz:
            </p>

            {/* Current Live URL Bar */}
            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 mb-3">
              <span className="text-[10px] font-pixel text-slate-400 shrink-0">URL:</span>
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-[11px] text-cyan-300 font-mono w-full outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="URL'yi Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Link to PWABuilder */}
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-pixel text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_#fff] cursor-pointer transition-all hover:scale-102"
            >
              <span>PWABUILDER İLE .APK ÜRET</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="mt-3 text-[10px] text-slate-400 space-y-1">
              <div>1. Butona tıklayıp PWABuilder'ı açın.</div>
              <div>2. <strong>"Package for Android"</strong> seçeneğine tıklayın.</div>
              <div>3. İndirdiğiniz <code>.apk</code> dosyasını telefonunuza kurun!</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t-4 border-black flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-black text-white hover:bg-slate-900 font-pixel text-xs px-6 py-2 rounded-xl border-2 border-white shadow-[2px_2px_0px_#000] cursor-pointer transition-all hover:scale-102"
          >
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
};
