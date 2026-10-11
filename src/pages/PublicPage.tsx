import React from 'react';
import { getSettings } from '../storage';
import BrandMark from '../components/BrandMark';
import { MessageCircleIcon, ScanLineIcon, UserRoundIcon } from '../components/icons';

const PublicPage: React.FC = () => {
  const settings = getSettings();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-founder-soft rounded-full opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-founder-soft rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <BrandMark size={104} className="mx-auto rounded-[28px] shadow-xl" />
          <h1 className="text-3xl font-bold text-ink mt-6">Founder</h1>
          <p className="text-ink-muted mt-1">Private QR chat</p>
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-[20px] border border-line p-8 mb-6">
          <div className="w-16 h-16 bg-founder-soft rounded-[20px] flex items-center justify-center mx-auto mb-4">
            <ScanLineIcon className="w-8 h-8 text-founder-deep" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-3">
            {settings.emergencyMessage}
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            Scan a Founder QR code to send its owner a private, anonymous text.
            No sign-in or download needed.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-founder-soft rounded-[14px] p-6 mb-8 text-left">
          <h3 className="text-sm font-semibold text-ink mb-3">How it works:</h3>
          <div className="space-y-2 text-sm text-ink-muted">
            <div className="flex items-start gap-2">
              <span className="bg-founder text-ink rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </span>
              <span>Scan the owner's Founder QR code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-founder text-ink rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </span>
              <span>Start a text chat and send your message</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-founder text-ink rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </span>
              <span>The owner receives it instantly on their app</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full bg-founder text-ink py-4 px-8 rounded-[14px] font-bold text-lg flex items-center justify-center gap-3 border border-white">
          <MessageCircleIcon className="w-6 h-6" strokeWidth={2} />
          Scan a Founder QR code to start a chat
        </div>

        {/* Footer */}
        <div className="mt-8 text-ink-muted text-xs flex items-center justify-center gap-1.5">
          <UserRoundIcon className="w-3.5 h-3.5" />
          <span>Anonymous · Private · Powered by Founder</span>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
