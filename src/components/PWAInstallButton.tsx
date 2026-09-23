import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenApkModal?: () => void;
  className?: string;
  variant?: 'banner' | 'pill' | 'button';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenApkModal,
  className = '',
  variant = 'pill',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // If already running in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      install();
    } else if (onOpenApkModal) {
      onOpenApkModal();
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-pixel text-[10px] sm:text-xs px-2.5 py-1 rounded-lg border-2 border-white shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
        title="APK / Uygulamayı Telefona Yükle"
      >
        <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>APK / YÜKLE</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs px-3.5 py-1.5 rounded-xl border-2 border-white shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <Download className="w-4 h-4" />
      <span>📲 APK / UYGULAMAYI KUR</span>
    </button>
  );
};
