import React from 'react';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, CreditCard } from 'lucide-react';

export default function RequestsListPage({
  requests,
  onSelectRequest,
  onApproveRequest,
  onOpenPayment
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FEF3C7] text-[#B45309]">Pending</span>;
      case 'Approved':
      case 'Owner approved':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E0E7FF] text-[#4338CA]">Approved</span>;
      case 'Payment':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Payment</span>;
      case 'Order placed':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Order Placed</span>;
      case 'Completed':
      case 'Delivered':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#D1FAE5] text-[#047857]">Completed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Requests & Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage all incoming and outgoing credit card offer transactions with escrow protection
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Platform</th>
                <th className="py-4 px-6">Card Used</th>
                <th className="py-4 px-6">Fee Earned</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800">
                    #{req.id}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {req.product}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {req.platform}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-600">
                    {req.cardName || 'HDFC ..4821'}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">
                    +₹{req.processingFee}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {req.status === 'Pending' ? (
                      <button
                        onClick={() => onApproveRequest(req.id)}
                        className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        Approve
                      </button>
                    ) : req.status === 'Payment' || req.status === 'Owner approved' ? (
                      <button
                        onClick={() => onSelectRequest(req)}
                        className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        Pay Escrow
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectRequest(req)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                      >
                        View Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
