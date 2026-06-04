import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'lab1-cookie-consent';

export const CookiePopup = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (updatedPrefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
    setPreferences(updatedPrefs);
    setIsVisible(false);
    setShowConfigModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible && !showConfigModal) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 left-6 right-6 z-40 md:left-auto md:max-w-md bg-white/80 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4 animate-in slide-in-from-bottom-8 fade-in-50 duration-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">GDPR Cookie Settings</h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                We use cookies to improve your puzzle-solving experience. Choose which preferences you'd like to enable. Read our{' '}
                <a href="/privacy-policy" className="text-violet-600 hover:underline font-medium" onClick={(e) => {
                  e.preventDefault();
                  window.open('/PRIVACY_POLICY.md', '_blank');
                }}>
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="primary" onClick={handleAcceptAll} className="flex-1 text-sm py-2 px-4 rounded-xl">
              Accept All
            </Button>
            <Button variant="secondary" onClick={handleRejectAll} className="text-sm py-2 px-4 rounded-xl">
              Reject
            </Button>
            <Button variant="secondary" onClick={() => setShowConfigModal(true)} className="text-sm py-2 px-4 rounded-xl">
              Configure
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={showConfigModal}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Cookie Preferences</h2>
            <button 
              onClick={() => setShowConfigModal(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Necessary */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="pr-4">
                <h4 className="font-bold text-slate-800 text-sm">Essential Cookies</h4>
                <p className="text-xs text-slate-500 mt-0.5">Required for game saving and consent state storage.</p>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={preferences.necessary} 
                  disabled 
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="pr-4">
                <h4 className="font-bold text-slate-800 text-sm">Analytics</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tracks your solve times and game scores locally.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={() => handleTogglePreference('analytics')}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="pr-4">
                <h4 className="font-bold text-slate-800 text-sm">Marketing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Personalizes content (unused in this app).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.marketing} 
                  onChange={() => handleTogglePreference('marketing')}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRejectAll} className="flex-1 py-2.5 rounded-xl">
              Reject All
            </Button>
            <Button variant="primary" onClick={handleSavePreferences} className="flex-1 py-2.5 rounded-xl">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
