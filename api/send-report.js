export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'hello@switchtoelectricvic.com.au';

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const lead = req.body;

    // Build upgrade list for emails
    const upgrades = (lead.recommended_upgrades || [])
      .map(u => `• ${u.name} — ~$${u.net?.toLocaleString()} after rebates (saves ~$${u.saving?.toLocaleString()}/yr)`)
      .join('\n');

    const upgradesHtml = (lead.recommended_upgrades || [])
      .map(u => `<tr>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-weight:600;">${u.name}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; text-decoration:line-through; color:#94a3b8;">~$${u.gross?.toLocaleString()}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0f766e; font-weight:600;">~-$${u.rebate?.toLocaleString()}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#0f766e; font-weight:700;">~$${u.net?.toLocaleString()}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0;">~$${u.saving?.toLocaleString()}/yr</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0;">~${u.payback} yrs</td>
      </tr>`)
      .join('');

    const complianceColor = lead.compliance_status === 'compliant' ? '#0f766e' : lead.compliance_status === 'action_needed' ? '#d97706' : '#dc2626';
    const complianceLabel = lead.compliance_status === 'compliant' ? 'Compliant' : lead.compliance_status === 'action_needed' ? 'Action Needed' : 'Non-Compliant';
    const isLandlord = lead.ownership_type === 'landlord';

    // 1. Send report to the USER (if they requested it)
    if (lead.want_report) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Switch to Electric Vic <reports@switchtoelectricvic.com.au>',
          to: [lead.email],
          subject: `Your Electrification Report — ${complianceLabel}`,
          html: `
            <div style="max-width:600px; margin:0 auto; font-family:-apple-system,sans-serif; color:#334155; line-height:1.6;">
              <div style="background:linear-gradient(135deg, #134e4a, #0f766e); padding:32px; text-align:center; border-radius:12px 12px 0 0;">
                <h1 style="color:white; margin:0; font-size:24px;">Your Electrification Report</h1>
                <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Switch to Electric Vic</p>
              </div>
              <div style="padding:32px; background:#ffffff; border:1px solid #e2e8f0; border-top:none;">
                <p>Hi ${lead.name},</p>
                <p>Thanks for using the Switch to Electric Vic calculator. Here's your personalised report.</p>

                <div style="padding:16px; border-radius:8px; background:${lead.compliance_status === 'compliant' ? '#f0fdfa' : lead.compliance_status === 'action_needed' ? '#fffbeb' : '#fef2f2'}; border-left:4px solid ${complianceColor}; margin:24px 0;">
                  <strong style="color:${complianceColor};">Compliance Status: ${complianceLabel}</strong>
                  <p style="margin:4px 0 0; font-size:14px;">${isLandlord ? 'As a landlord, both gas heating and hot water must be replaced with electric at end-of-life. MEES compliance required by 1 March 2027.' : 'Gas hot water must be replaced with electric at end-of-life. You cannot install a new gas hot water system.'}</p>
                </div>

                ${isLandlord ? '<div style="padding:12px 16px; background:#fef2f2; border-radius:8px; margin-bottom:24px; font-size:14px;"><strong style="color:#dc2626;">Landlord Alert:</strong> Advertising a non-compliant rental property has been a criminal offence since November 2025. Penalties up to ~$61,053.</div>' : ''}

                <h2 style="font-size:18px; margin:24px 0 12px;">Recommended Upgrades</h2>
                <table style="width:100%; border-collapse:collapse; font-size:13px;">
                  <thead>
                    <tr style="background:#f8fafc;">
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">Upgrade</th>
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">Cost</th>
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">Rebates</th>
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">You Pay</th>
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">Saving</th>
                      <th style="padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; color:#64748b;">Payback</th>
                    </tr>
                  </thead>
                  <tbody>${upgradesHtml}</tbody>
                </table>

                <div style="display:flex; gap:16px; margin:24px 0; flex-wrap:wrap;">
                  <div style="flex:1; min-width:120px; padding:16px; background:#f8fafc; border-radius:8px; text-align:center;">
                    <div style="font-size:11px; text-transform:uppercase; color:#64748b;">Total Cost</div>
                    <div style="font-size:22px; font-weight:700;">~$${lead.total_cost_gross?.toLocaleString()}</div>
                  </div>
                  <div style="flex:1; min-width:120px; padding:16px; background:#f0fdfa; border-radius:8px; text-align:center; border:1px solid #2dd4bf;">
                    <div style="font-size:11px; text-transform:uppercase; color:#0f766e;">After Rebates</div>
                    <div style="font-size:22px; font-weight:700; color:#0f766e;">~$${lead.total_cost_net?.toLocaleString()}</div>
                  </div>
                  <div style="flex:1; min-width:120px; padding:16px; background:#f0fdfa; border-radius:8px; text-align:center;">
                    <div style="font-size:11px; text-transform:uppercase; color:#0f766e;">Annual Saving</div>
                    <div style="font-size:22px; font-weight:700; color:#0f766e;">~$${lead.total_annual_saving?.toLocaleString()}/yr</div>
                  </div>
                </div>

                <p style="font-size:14px; color:#64748b;">All figures are estimates based on average Melbourne metropolitan pricing. Actual costs may vary based on your specific property, chosen products, and installer.</p>

                ${lead.want_quotes ? '<div style="padding:16px; background:#f0fdfa; border-radius:8px; margin:24px 0;"><strong>Good news:</strong> Up to 3 verified local installers will be in touch within 48 hours with free quotes.</div>' : '<div style="padding:16px; background:#f0fdfa; border-radius:8px; margin:24px 0;"><strong>Ready for quotes?</strong> Visit <a href="https://www.switchtoelectricvic.com.au" style="color:#0f766e;">switchtoelectricvic.com.au</a> to connect with up to 3 verified local installers.</div>'}
              </div>
              <div style="padding:20px; background:#f8fafc; text-align:center; font-size:12px; color:#64748b; border-radius:0 0 12px 12px;">
                <p style="margin:0;">Switch to Electric Vic · <a href="https://www.switchtoelectricvic.com.au" style="color:#0f766e;">switchtoelectricvic.com.au</a></p>
                <p style="margin:4px 0 0;">This report was generated based on information you provided. It is not financial or legal advice.</p>
              </div>
            </div>
          `,
        }),
      });
    }

    // 2. Send notification to BUSINESS
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Switch to Electric Vic <leads@switchtoelectricvic.com.au>',
        to: [NOTIFICATION_EMAIL],
        subject: `New lead: ${lead.name} (${lead.suburb || 'VIC'}) — ${lead.want_quotes ? 'Wants Quotes' : 'Report Only'}`,
        html: `
          <div style="font-family:-apple-system,sans-serif; max-width:600px;">
            <h2 style="margin:0 0 16px;">New Lead from Switch to Electric Vic</h2>
            <table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Name</td><td style="padding:8px; border-bottom:1px solid #eee;">${lead.name}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Email</td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Phone</td><td style="padding:8px; border-bottom:1px solid #eee;">${lead.phone || 'Not provided'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Suburb</td><td style="padding:8px; border-bottom:1px solid #eee;">${lead.suburb || 'Not provided'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Type</td><td style="padding:8px; border-bottom:1px solid #eee;">${isLandlord ? 'Landlord' : 'Homeowner'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Wants</td><td style="padding:8px; border-bottom:1px solid #eee;">${lead.want_report ? 'Report' : ''} ${lead.want_quotes ? '+ Installer Quotes' : ''}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Timeline</td><td style="padding:8px; border-bottom:1px solid #eee;">${lead.timeline || 'Not specified'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Compliance</td><td style="padding:8px; border-bottom:1px solid #eee;">${complianceLabel}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; border-bottom:1px solid #eee;">Net Cost</td><td style="padding:8px; border-bottom:1px solid #eee;">~$${lead.total_cost_net?.toLocaleString() || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Annual Saving</td><td style="padding:8px;">~$${lead.total_annual_saving?.toLocaleString() || '—'}/yr</td></tr>
            </table>
            <h3 style="margin:20px 0 8px;">Recommended Upgrades</h3>
            <pre style="background:#f5f5f5; padding:12px; border-radius:8px; font-size:13px; white-space:pre-wrap;">${upgrades || 'None'}</pre>
          </div>
        `,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
