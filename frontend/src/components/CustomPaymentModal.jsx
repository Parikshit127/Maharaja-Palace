import React, { useState } from 'react';
import { CreditCard, Smartphone, QrCode, Building2, X, Check } from 'lucide-react';

export const CustomPaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  bookingDetails,
  onPaymentComplete,
  onTestComplete 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTestPayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    onTestComplete();
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay via UPI apps' },
    { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
    { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Scan & Pay' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'Internet Banking' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Payment</h3>
            <p className="text-white/80 text-sm">Maharaja Palace</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Amount */}
        <div className="bg-[#B8860B]/10 px-6 py-4 border-b border-[#B8860B]/20">
          <p className="text-sm text-[#6a6a6a]">Amount to Pay</p>
          <p className="text-3xl font-bold text-[#B8860B]">₹{amount.toLocaleString()}</p>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <p className="text-sm font-semibold text-[#2a2a2a] mb-3">Select Payment Method</p>
          <div className="space-y-2 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-[#B8860B] bg-[#B8860B]/5'
                    : 'border-gray-200 hover:border-[#B8860B]/50'
                }`}
              >
                <method.icon className={`w-6 h-6 ${
                  selectedMethod === method.id ? 'text-[#B8860B]' : 'text-gray-400'
                }`} />
                <div className="flex-1 text-left">
                  <p className={`font-semibold ${
                    selectedMethod === method.id ? 'text-[#B8860B]' : 'text-[#2a2a2a]'
                  }`}>{method.name}</p>
                  <p className="text-xs text-[#6a6a6a]">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-5 h-5 rounded-full bg-[#B8860B] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Payment Details based on selected method */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            {selectedMethod === 'upi' && (
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-[#B8860B] mx-auto mb-2" />
                <p className="text-sm text-[#6a6a6a]">Enter UPI ID or scan QR code</p>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B8860B] focus:outline-none"
                />
              </div>
            )}
            {selectedMethod === 'card' && (
              <div>
                <CreditCard className="w-12 h-12 text-[#B8860B] mx-auto mb-3" />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B8860B] focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B8860B] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B8860B] focus:outline-none"
                  />
                </div>
              </div>
            )}
            {selectedMethod === 'qr' && (
              <div className="text-center">
                <QrCode className="w-24 h-24 text-[#B8860B] mx-auto mb-2" />
                <p className="text-sm text-[#6a6a6a]">Scan this QR code with any UPI app</p>
              </div>
            )}
            {selectedMethod === 'netbanking' && (
              <div>
                <Building2 className="w-12 h-12 text-[#B8860B] mx-auto mb-3" />
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#B8860B] focus:outline-none">
                  <option>Select Your Bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleTestPayment}
              disabled={processing}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Done (Test Payment)
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-[#6a6a6a]">
              🔒 Secured by Razorpay • Test Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
