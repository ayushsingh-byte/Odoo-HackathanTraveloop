import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { API, fmt, fmtMoney } from '../../services/api';

export default function TripInvoice() {
  const [params] = useSearchParams();
  const tripId = params.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!tripId) { navigate('/trips'); return; }
    API.get(`/api/trips/${tripId}/invoice`).then(data => {
      setLoading(false);
      if (data?.error) { showAlert(data.error); return; }
      setInvoice(data.invoice);
    });
  }, [tripId]);

  function downloadCSV() {
    if (!invoice) return;
    const rows = [
      ['Description', 'Qty', 'Unit', 'Unit Cost', 'Amount'],
      ...(invoice.line_items || []).map(i => [i.description, i.qty, i.unit, i.unit_cost, i.amount]),
      [], ['Subtotal', '', '', '', invoice.subtotal],
      ['Tax (5%)', '', '', '', invoice.tax],
      ['Grand Total', '', '', '', invoice.grand_total]
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${invoice.invoice_id}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div style={{ background: '#0a0a0a', minHeight: '100vh' }}><div className="container"><div className="spinner" /></div></div>;

  const statusLabel = isPaid ? 'PAID' : (invoice?.payment_status === 'over_budget' ? 'OVER BUDGET' : 'PENDING');
  const statusClass = isPaid ? 'status-paid' : (invoice?.payment_status === 'over_budget' ? 'status-over_budget' : 'status-pending');

  const tripSubNav = (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
      {[
        { to: `/trip/view?id=${tripId}`, label: '📋 Itinerary' },
        { to: `/trip/builder?id=${tripId}`, label: '🔨 Builder' },
        { to: `/trip/budget?id=${tripId}`, label: '💰 Budget' },
        { to: `/trip/checklist?id=${tripId}`, label: '☑️ Checklist' },
        { to: `/trip/notes?id=${tripId}`, label: '📝 Notes' },
        { to: `/trip/invoice?id=${tripId}`, label: '🧾 Invoice' },
      ].map(({ to, label }) => (
        <Link key={to} to={to} style={{ padding: '0.4rem 0.9rem', borderRadius: 20, fontSize: '0.8rem', textDecoration: 'none', background: location.pathname === to.split('?')[0] ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)', color: location.pathname === to.split('?')[0] ? '#c9a84c' : 'rgba(255,255,255,0.5)', border: `1px solid ${location.pathname === to.split('?')[0] ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.2s' }}>
          {label}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="dark-trip-page" style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '2rem' }}>
      <style>{`
        .invoice-wrap{display:grid;grid-template-columns:1fr 320px;gap:2rem}
        @media(max-width:900px){.invoice-wrap{grid-template-columns:1fr}}
        .invoice-box{background:#fff;color:#1f2937;border:1.5px solid #e5e7eb;border-radius:16px;padding:2rem}
        .invoice-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:2px solid #e5e7eb}
        .invoice-brand{font-size:1.5rem;font-weight:800;color:#6c63ff}
        .invoice-id{font-size:.85rem;color:#6b7280;margin-top:.25rem}
        .invoice-table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.9rem}
        .invoice-table th{background:#f8f9ff;padding:.65rem .75rem;text-align:left;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb}
        .invoice-table td{padding:.65rem .75rem;border-bottom:1px solid #f1f0ff}
        .invoice-table tr:last-child td{border-bottom:none}
        .totals-row{display:flex;justify-content:space-between;padding:.5rem 0;font-size:.9rem}
        .totals-row.grand{font-weight:700;font-size:1.05rem;border-top:2px solid #6c63ff;padding-top:.75rem;margin-top:.25rem;color:#6c63ff}
        .status-badge{display:inline-block;padding:.3rem .9rem;border-radius:20px;font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .status-pending{background:#fef3c7;color:#92400e}
        .status-paid{background:#d1fae5;color:#065f46}
        .status-over_budget{background:#fee2e2;color:#991b1b}
        .insight-item{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #f1f0ff;font-size:.9rem}
        .insight-item:last-child{border-bottom:none}
        .budget-bar-wrap{height:10px;background:#e5e7eb;border-radius:5px;overflow:hidden;margin-top:1rem}
        .budget-bar-fill{height:100%;border-radius:5px}
        @media print{.no-print{display:none!important}}
      `}</style>

      <div className="container">
        {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
        {tripSubNav}
        <div className="page-header flex items-center justify-between no-print">
          <div><h1>Trip Invoice</h1><p>{invoice?.trip_title}</p></div>
          <div className="flex gap-1">
            <Link to={`/trip/view?id=${tripId}`} className="btn btn-secondary">← Back to Trip</Link>
            <button className="btn btn-secondary" onClick={() => window.print()}>Print / PDF</button>
            <button className={`btn ${isPaid ? 'btn-secondary' : 'btn-primary'}`} onClick={() => { setIsPaid(!isPaid); showAlert(isPaid ? 'Marked as pending' : 'Marked as paid', 'success'); }}>
              {isPaid ? 'Mark as Pending' : 'Mark as Paid'}
            </button>
          </div>
        </div>

        {invoice && (
          <div className="invoice-wrap">
            <div className="invoice-box">
              <div className="invoice-header">
                <div>
                  <div className="invoice-brand">✈ Traveloop</div>
                  <div className="invoice-id">{invoice.invoice_id}</div>
                  <div style={{ marginTop: '0.5rem' }}><span className={`status-badge ${statusClass}`}>{statusLabel}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Billed To</div>
                  <strong>{invoice.owner_name}</strong>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{fmt(invoice.start_date)} — {fmt(invoice.end_date)}</div>
                </div>
              </div>

              <h3 style={{ marginBottom: '0.25rem' }}>{invoice.trip_title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Detailed expense breakdown</p>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Cost</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.line_items || []).map((item, i) => (
                    <tr key={i}>
                      <td>{item.description}</td>
                      <td style={{ textAlign: 'right' }}>{item.qty} {item.unit}</td>
                      <td style={{ textAlign: 'right' }}>{fmtMoney(item.unit_cost, invoice.currency)}</td>
                      <td style={{ textAlign: 'right' }}><strong>{fmtMoney(item.amount, invoice.currency)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ maxWidth: 320, marginLeft: 'auto' }}>
                <div className="totals-row"><span className="text-muted">Subtotal</span><span>{fmtMoney(invoice.subtotal, invoice.currency)}</span></div>
                <div className="totals-row"><span className="text-muted">Tax (5%)</span><span>{fmtMoney(invoice.tax, invoice.currency)}</span></div>
                <div className="totals-row"><span className="text-muted">Discount</span><span>$0.00</span></div>
                <div className="totals-row grand"><span>Grand Total</span><span>{fmtMoney(invoice.grand_total, invoice.currency)}</span></div>
              </div>
            </div>

            <div>
              <div className="card mb-2">
                <div className="card-body">
                  <h3 className="mb-2">Budget Insights</h3>
                  {[['Total Budget', invoice.total_budget], ['Total Spent', invoice.total_spent], ['Remaining', invoice.remaining]].map(([label, val]) => (
                    <div key={label} className="insight-item">
                      <span className="text-muted">{label}</span>
                      <strong className={label === 'Remaining' ? (invoice.remaining < 0 ? 'text-danger' : 'text-success') : ''}>{fmtMoney(val, invoice.currency)}</strong>
                    </div>
                  ))}
                  {invoice.total_budget > 0 && (
                    <>
                      <div className="budget-bar-wrap">
                        <div className="budget-bar-fill" style={{ width: `${Math.min(100, Math.round((invoice.total_spent / invoice.total_budget) * 100))}%`, background: invoice.remaining < 0 ? '#ef4444' : '#6c63ff' }} />
                      </div>
                      <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>{Math.min(100, Math.round((invoice.total_spent / invoice.total_budget) * 100))}% of budget used</p>
                    </>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 className="mb-2">Export Options</h3>
                  <div className="flex flex-col gap-1">
                    <button className="btn btn-primary" onClick={() => window.print()}>Export as PDF</button>
                    <button className="btn btn-secondary" onClick={downloadCSV}>Download CSV</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
