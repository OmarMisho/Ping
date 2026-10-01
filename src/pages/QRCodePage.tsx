import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage: React.FC = () => {
  const currentUrl = `${window.location.origin}${window.location.pathname}#/`;

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your QR Code</h1>
          <p className="text-gray-500 text-sm mb-6">
            Share this QR code with trusted people. When they scan it, they'll be able to contact you in case of emergency.
          </p>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-6">
            <QRCodeSVG
              value={currentUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#dc2626"
            />
          </div>

          {/* URL */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-400 mb-1">Link URL</p>
            <p className="text-sm text-gray-700 font-mono break-all">{currentUrl}</p>
          </div>

          {/* Instructions */}
          <div className="text-left space-y-3 bg-red-50 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 text-sm">How to use:</h3>
            <ol className="text-sm text-red-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Print or screenshot this QR code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Share it with family, friends, or keep it accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>In emergencies, they scan the code and message you directly</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              🖨️ Print
            </button>
            <a
              href="/"
              className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
