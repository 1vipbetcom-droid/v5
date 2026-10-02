import React, { useState } from "react";
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Apple,
  Copy,
  Check,
  Sparkles,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "../utils/audio";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "bn" | "en";
  hasPrompt: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onTriggerInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  lang = "bn",
  hasPrompt,
  isStandalone,
  isIOS,
  isAndroid,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">(() => {
    if (isIOS) return "ios";
    if (isAndroid) return "android";
    return "android";
  });
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    sound.playButtonClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDirectInstall = async () => {
    sound.playButtonClick();
    setInstalling(true);
    try {
      const success = await onTriggerInstall();
      if (success) {
        sound.playWinFanfare();
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-[#0c1017] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-neutral-100"
        >
          {/* Header */}
          <div className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/30">
                <Smartphone className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{lang === "bn" ? "অ্যাপ ইনস্টল ও ওপেন গাইড" : "App Install & Launch Guide"}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono uppercase">
                    PWA 100%
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {lang === "bn"
                    ? "ফুল-স্ক্রিন মোডে দ্রুত ও নিখুঁত গেমিং অভিজ্ঞতা"
                    : "Native full-screen performance with zero lag"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playButtonClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
            {/* Direct 1-Tap Trigger Banner if Browser Prompt is Available */}
            {hasPrompt && !isStandalone && (
              <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{lang === "bn" ? "সরাসরি ইনস্টল প্রস্তুত!" : "Direct 1-Tap Install Ready!"}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    {lang === "bn"
                      ? "আপনার ব্রাউজার প্রস্তুত। ১-ট্যাপেই ইনস্টল করুন।"
                      : "Click below to install directly to your device home screen."}
                  </p>
                </div>
                <button
                  onClick={handleDirectInstall}
                  disabled={installing || installSuccess}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>
                    {installSuccess
                      ? (lang === "bn" ? "ইনস্টল সম্পন্ন!" : "Installed!")
                      : installing
                      ? (lang === "bn" ? "প্রসেসিং..." : "Installing...")
                      : (lang === "bn" ? "এখনই ইনস্টল করুন" : "Install Now")}
                  </span>
                </button>
              </div>
            )}

            {/* Crucial Explanation: How to Open Installed App */}
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <span className="font-bold text-amber-300">
                    {lang === "bn" ? "অ্যাপ কীভাবে ওপেন করবেন?" : "How to Open the App:"}
                  </span>{" "}
                  {lang === "bn" ? (
                    <>
                      আপনি যদি ইতিমধ্যে অ্যাপটি ইনস্টল করে থাকেন, তবে ব্রাউজারের কোনো ওয়েবসাইট বাটন থেকে সরাসরি অন্য অ্যাপ ওপেন করা যায় না (মোবাইল সিকিউরিটি নিয়ম অনুযায়ী)। আপনার মোবাইলের{" "}
                      <strong className="text-white">হোম স্ক্রিন (Home Screen)</strong> বা{" "}
                      <strong className="text-white">অ্যাপ ড্রয়ার</strong> থেকে{" "}
                      <strong className="text-amber-400">APEX Casino</strong> আইকনে চাপুন—অ্যাপটি তৎক্ষণাৎ ফুল-স্ক্রিনে ওপেন হবে!
                    </>
                  ) : (
                    <>
                      If already installed, mobile OS security prevents web links from force-launching installed apps. Simply tap the{" "}
                      <strong className="text-amber-400">APEX Casino</strong> icon directly from your phone's{" "}
                      <strong className="text-white">Home Screen</strong> or{" "}
                      <strong className="text-white">App Drawer</strong>!
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* OS Device Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
              <button
                onClick={() => setActiveTab("android")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "android"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setActiveTab("ios")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "ios"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActiveTab("desktop")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "desktop"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* Step-by-Step Instructions based on active tab */}
            {activeTab === "android" && (
              <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>{lang === "bn" ? "অ্যান্ড্রয়েড ফোনে ইনস্টল করার নিয়ম (Chrome Browser):" : "Android Chrome Installation Steps:"}</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ১
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>Chrome ব্রাউজারের উপরে ডানদিকের <strong>তিনটি ডট মেনু (⋮)</strong> চাপুন।</>
                      ) : (
                        <>Tap the <strong>three dots (⋮)</strong> in Chrome top-right corner.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ২
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>তালিকায় থাকা <strong>"Install app"</strong> অথবা <strong>"Add to Home Screen"</strong> চাপুন।</>
                      ) : (
                        <>Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong> from menu.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ৩
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>নিশ্চিতকরণ পপ-আপে <strong>"Install"</strong> বাটনে ক্লিক করলেই ইনস্টল হয়ে যাবে!</>
                      ) : (
                        <>Confirm by tapping <strong>"Install"</strong> in the prompt.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {lang === "bn" ? (
                        <>আপনার মোবাইলের <strong>Home Screen</strong>-এ APEX Casino আইকন চলে আসবে। যেকোনো সময় ক্লিক করে খেলুন!</>
                      ) : (
                        <>The APEX Casino gold icon is now on your Home Screen. Tap to play anytime!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ios" && (
              <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  <span>{lang === "bn" ? "আইফোন / আইপ্যাডে ইনস্টল করার নিয়ম (Safari Browser):" : "iPhone / iPad Safari Installation Steps:"}</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ১
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>Safari ব্রাউজারের নিচে থাকা <strong>Share (শেয়ার)</strong> আইকনটিতে চাপুন (তীর চিহ্ন 📤)।</>
                      ) : (
                        <>Tap the <strong>Share</strong> button at bottom of Safari (box with up arrow 📤).</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ২
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>একটু নিচে স্ক্রল করে <strong>"Add to Home Screen"</strong> (হোম স্ক্রিনে যোগ করুন ➕) চাপুন।</>
                      ) : (
                        <>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ৩
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>উপরে ডানদিকের <strong>"Add"</strong> বাটনে ট্যাপ করুন।</>
                      ) : (
                        <>Tap <strong>"Add"</strong> in the top-right corner.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {lang === "bn" ? (
                        <>আপনার আইফোনের হোম স্ক্রিনে চলে যাওয়া অ্যাপটিতে ক্লিক করলেই সম্পূর্ণ ফুল-স্ক্রিনে গেমটি চলবে!</>
                      ) : (
                        <>Tap the APEX Casino icon on your iPhone home screen to play in standalone mode!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "desktop" && (
              <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  <span>{lang === "bn" ? "ডেস্কটপ / পিসিতে ইনস্টল করার নিয়ম:" : "Desktop / Laptop Chrome & Edge Steps:"}</span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ১
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <>ব্রাউজারের অ্যাড্রেস বারের (URL bar) একদম ডানে থাকা <strong>ইনস্টল আইকন</strong> (মনিটর বা ডাউনলোড চিহ্ন)-এ ক্লিক করুন।</>
                      ) : (
                        <>Click the <strong>Install icon</strong> in Chrome or Edge address bar (right side).</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ২
                    </span>
                    <span>
                      {lang === "bn" ? (
                        <><strong>"Install"</strong> বাটনে ক্লিক করলেই উইন্ডোজ বা ম্যাক ডেস্কটপে স্বতন্ত্র অ্যাপ হিসেবে চালু হবে।</>
                      ) : (
                        <>Click <strong>"Install"</strong> to launch as a standalone desktop desktop window.</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions & URL Copy */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800 text-xs">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? (lang === "bn" ? "লিংক কপি হয়েছে!" : "Link Copied!") : (lang === "bn" ? "অ্যাপ লিংক কপি করুন" : "Copy App Link")}</span>
              </button>

              <button
                onClick={() => {
                  sound.playButtonClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === "bn" ? "ঠিক আছে, বুঝেছি" : "Got It"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-900 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PWA Native App Ready • Zero Installation Delay</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
