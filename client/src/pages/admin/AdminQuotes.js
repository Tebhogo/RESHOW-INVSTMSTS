import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumbers, setWhatsappNumbers] = useState({});
  const [showWhatsappInput, setShowWhatsappInput] = useState({});

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await api.get('/quotes');
      setQuotes(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (quoteId, status) => {
    try {
      await api.patch(`/quotes/${quoteId}`, { status });
      fetchQuotes();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleReplyEmail = (quote) => {
    const subject = encodeURIComponent(`Re: Quote Request - ${quote.products.map(p => p.productName).join(', ')}`);
    const body = encodeURIComponent(
      `Dear ${quote.name},\n\nThank you for your quote request.\n\n` +
      `We have received your request for the following products:\n` +
      `${quote.products.map(p => `- ${p.productName} (Quantity: ${p.quantity})`).join('\n')}\n\n` +
      `We will get back to you shortly with pricing and details.\n\n` +
      `Best regards,\nReshow Investments Team`
    );
    window.location.href = `mailto:${quote.email}?subject=${subject}&body=${body}`;
  };

  const handleOpenWhatsApp = (quote) => {
    const phoneNumber = whatsappNumbers[quote.id] || quote.phone;
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    // Remove any non-numeric characters and ensure country code format
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Build WhatsApp message with quote details
    const message = encodeURIComponent(
      `Hello ${quote.name},\n\n` +
      `Thank you for your quote request.\n\n` +
      `Your requested products:\n` +
      `${quote.products.map(p => `- ${p.productName} (Qty: ${p.quantity})`).join('\n')}\n\n` +
      `We will provide you with pricing and details shortly.\n\n` +
      `Best regards,\nReshow Investments Team`
    );

    // Open WhatsApp Web/App with the number and message
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    
    // Reset WhatsApp input
    setShowWhatsappInput({ ...showWhatsappInput, [quote.id]: false });
    setWhatsappNumbers({ ...whatsappNumbers, [quote.id]: '' });
  };

  const toggleWhatsappInput = (quoteId, quotePhone = '') => {
    setShowWhatsappInput({
      ...showWhatsappInput,
      [quoteId]: !showWhatsappInput[quoteId]
    });
    if (!showWhatsappInput[quoteId]) {
      // Pre-fill with quote's phone number if available
      setWhatsappNumbers({ ...whatsappNumbers, [quoteId]: quotePhone });
    } else {
      // Clear when closing
      setWhatsappNumbers({ ...whatsappNumbers, [quoteId]: '' });
    }
  };

  const handleWhatsappNumberChange = (quoteId, value) => {
    setWhatsappNumbers({
      ...whatsappNumbers,
      [quoteId]: value
    });
  };

  if (loading) {
    return <div className="text-center py-12 font-dosis">Loading quotes...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Quote Requests</h2>
      {quotes.length === 0 ? (
        <div className="text-center py-12 font-dosis text-gray-600">No quote requests yet.</div>
      ) : (
        <div className="space-y-4">
          {quotes.map(quote => (
            <div key={quote.id} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold font-dinbek text-reshow-dark">{quote.name}</h3>
                  <p className="font-dosis text-gray-600">{quote.email}</p>
                  {quote.phone && <p className="font-dosis text-gray-600">{quote.phone}</p>}
                  {quote.company && <p className="font-dosis text-gray-600">{quote.company}</p>}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-dosis font-semibold ${
                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                  <p className="text-xs font-dosis text-gray-500 mt-2">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-dosis font-semibold mb-2">Products Requested:</h4>
                <ul className="list-disc list-inside font-dosis text-gray-700">
                  {quote.products.map((item, index) => (
                    <li key={index}>
                      {item.productName} (Qty: {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
              {quote.message && (
                <div className="mb-4">
                  <h4 className="font-dosis font-semibold mb-2">Message:</h4>
                  <p className="font-dosis text-gray-700">{quote.message}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleReplyEmail(quote)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-dosis font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                  title={`Reply to ${quote.email}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Reply to Email
                </button>
                
                <div className="relative">
                  {showWhatsappInput[quote.id] ? (
                    <div className="flex gap-2 items-center bg-green-50 p-2 rounded-lg border border-green-200">
                      <input
                        type="tel"
                        value={whatsappNumbers[quote.id] || ''}
                        onChange={(e) => handleWhatsappNumberChange(quote.id, e.target.value)}
                        placeholder={quote.phone || "Enter phone number"}
                        className="px-3 py-1 border border-gray-300 rounded text-sm font-dosis w-40 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleOpenWhatsApp(quote);
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleOpenWhatsApp(quote)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm font-dosis font-semibold hover:bg-green-600 transition-colors"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => toggleWhatsappInput(quote.id, quote.phone)}
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleWhatsappInput(quote.id, quote.phone)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-dosis font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                      title="Send to WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Send to WhatsApp
                    </button>
                  )}
                </div>

                <button
                  onClick={() => updateStatus(quote.id, 'pending')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-dosis font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Pending
                </button>
                <button
                  onClick={() => updateStatus(quote.id, 'approved')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-dosis font-semibold hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(quote.id, 'rejected')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-dosis font-semibold hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;

