// ── Supabase Config ──────────────────────────────────────────
// Replace these with your Supabase project values:
// Dashboard → Settings → API → Project URL & anon/public key
const SUPABASE_URL = 'https://ikbziqznbgoqpzchcxic.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrYnppcXpuYmdvcXB6Y2hjeGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjMzNDIsImV4cCI6MjA5MzMzOTM0Mn0.cIXovTwu8wgAuGS_m71dZM7zMVxgaWdDB8TF7_VAsYg';
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function app() {
  return {
    page: 'home',
    mobileOpen: false,
    calcStep: 1,
    leadSubmitted: false,
    homeResults: false,
    homeLeadSubmitted: false,
    submitting: false,
    submitError: '',

    homeLead: {
      name: '',
      email: '',
      phone: '',
      wantReport: false,
      wantQuotes: false,
      timeline: '',
    },

    calc: {
      ownership: '',
      propType: '',
      propAge: '',
      bedrooms: '',
      suburb: '',
      hotWater: '',
      heating: '',
      cooktop: '',
      solar: '',
      battery: '',
      bill: 500,
    },

    lead: {
      name: '',
      email: '',
      phone: '',
      contactPref: 'either',
      upgrades: [],
      timeline: '',
    },

    results: {
      compliance: '',
      complianceMsg: '',
      items: [],
      upgrades: [],
      totalGross: 0,
      totalNet: 0,
      totalRebate: 0,
      totalSaving: 0,
      totalPayback: 0,
    },

    async submitLead() {
      if (this.submitting) return;
      this.submitting = true;
      this.submitError = '';

      try {
        const { error } = await _supabase
          .from('leads')
          .insert({
            name: this.homeLead.name,
            email: this.homeLead.email,
            phone: this.homeLead.phone || null,
            suburb: this.calc.suburb || null,
            contact_preference: this.homeLead.wantQuotes ? (this.homeLead.wantReport ? 'either' : 'phone') : 'email',
            want_report: this.homeLead.wantReport,
            want_quotes: this.homeLead.wantQuotes,
            timeline: this.homeLead.timeline || null,
            ownership_type: this.calc.ownership,
            hot_water: this.calc.hotWater,
            heating: this.calc.heating,
            cooktop: this.calc.cooktop,
            property_age: this.calc.propAge,
            compliance_status: this.results.compliance,
            recommended_upgrades: this.results.upgrades,
            total_cost_gross: this.results.totalGross,
            total_cost_net: this.results.totalNet,
            total_rebates: this.results.totalRebate,
            total_annual_saving: this.results.totalSaving,
          });

        if (error) throw error;
        this.homeLeadSubmitted = true;
        window.scrollTo({ top: document.getElementById('home-results').offsetTop, behavior: 'smooth' });
      } catch (err) {
        console.error('Lead submission error:', err);
        this.submitError = 'Something went wrong. Please try again, or email us at hello@switchtoelectricvic.com.au.';
      } finally {
        this.submitting = false;
      }
    },

    async submitCalcLead() {
      if (this.submitting) return;
      this.submitting = true;
      this.submitError = '';

      try {
        const { error } = await _supabase
          .from('leads')
          .insert({
            name: this.lead.name,
            email: this.lead.email,
            phone: this.lead.phone || null,
            suburb: this.calc.suburb || null,
            contact_preference: this.lead.contactPref,
            want_report: false,
            want_quotes: true,
            timeline: this.lead.timeline || null,
            ownership_type: this.calc.ownership,
            hot_water: this.calc.hotWater,
            heating: this.calc.heating,
            cooktop: this.calc.cooktop,
            property_age: this.calc.propAge,
            compliance_status: this.results.compliance,
            recommended_upgrades: this.results.upgrades.filter(u => this.lead.upgrades.includes(u.name)),
            total_cost_gross: this.results.totalGross,
            total_cost_net: this.results.totalNet,
            total_rebates: this.results.totalRebate,
            total_annual_saving: this.results.totalSaving,
          });

        if (error) throw error;
        this.leadSubmitted = true;
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Lead submission error:', err);
        this.submitError = 'Something went wrong. Please try again, or email us at hello@switchtoelectricvic.com.au.';
      } finally {
        this.submitting = false;
      }
    },

    computeResults() {
      const c = this.calc;
      let compliance = 'compliant';
      let complianceMsg = '';
      let items = [];
      let upgrades = [];

      const isLandlord = c.ownership === 'landlord';
      const isGasHW = ['gas_storage', 'gas_instant', 'unknown'].includes(c.hotWater);
      const isGasHeat = ['gas_ducted', 'gas_wall', 'unknown'].includes(c.heating);
      const isGasCook = c.cooktop === 'gas';
      const hwNA = c.hotWater === 'na';
      const heatNA = c.heating === 'na';
      const cookNA = c.cooktop === 'na';
      const noSolar = c.solar !== 'yes';
      const noBattery = c.battery !== 'yes';
      const isOldHome = ['pre1990', '1990-2010'].includes(c.propAge);

      // Compliance check
      if (isLandlord) {
        if (isGasHW || isGasHeat) {
          compliance = 'non_compliant';
          complianceMsg = 'Your rental property has gas appliances that must be replaced with electric alternatives at end-of-life. Additionally, you must meet Minimum Energy Efficiency Standards (MEES) by 1 March 2027. Advertising a non-compliant property is already a criminal offence since November 2025.';
        } else if (isOldHome) {
          compliance = 'action_needed';
          complianceMsg = 'Your appliances appear to be electric, but your property may need insulation or draught sealing upgrades to meet MEES requirements by March 2027. We recommend a professional assessment.';
        }
      } else {
        if (isGasHW) {
          compliance = 'action_needed';
          complianceMsg = 'Your gas hot water system must be replaced with an electric alternative when it reaches end-of-life. You cannot install a new gas hot water system. Plan ahead to access the best rebates.';
        }
      }

      // Items requiring attention
      if (isGasHW) {
        items.push({
          label: 'Gas Hot Water System',
          desc: isLandlord
            ? 'Must be replaced with electric (e.g., heat pump) at end-of-life. Required for MEES compliance.'
            : 'Must be replaced with electric at end-of-life. Cannot install a new gas system.',
          urgent: isLandlord
        });
      }
      if (isGasHeat && isLandlord) {
        items.push({
          label: 'Gas Heating System',
          desc: 'Landlords must replace gas heating with electric (e.g., reverse cycle AC) at end-of-life. Required for MEES compliance.',
          urgent: true
        });
      }
      if (isGasHeat && !isLandlord) {
        items.push({
          label: 'Gas Heating (Optional)',
          desc: 'Not currently mandatory for owner-occupiers, but switching to reverse cycle AC can save $400–$600/year.',
          urgent: false
        });
      }
      if (isLandlord && isOldHome) {
        items.push({
          label: 'Insulation & Draught Sealing',
          desc: 'Older properties likely need insulation upgrades to meet MEES requirements by March 2027.',
          urgent: true
        });
      }

      // Recommended upgrades
      if (isGasHW) {
        upgrades.push({
          name: 'Heat Pump Hot Water',
          desc: 'Replace gas hot water with an efficient heat pump system',
          gross: 3500,
          rebate: 2030,
          net: 1470,
          saving: 400,
          payback: 3.7,
          priority: (isLandlord || isGasHW) ? 'compliance' : 'recommended'
        });
      }

      if (isGasHeat) {
        if (c.heating === 'gas_ducted') {
          upgrades.push({
            name: 'Reverse Cycle Ducted AC',
            desc: 'Replace gas ducted heating with efficient reverse cycle system',
            gross: 12000,
            rebate: 500,
            net: 11500,
            saving: 600,
            payback: 19.2,
            priority: isLandlord ? 'compliance' : 'recommended'
          });
        } else {
          upgrades.push({
            name: 'Reverse Cycle Split System',
            desc: 'Replace gas wall heater with split system AC (heating + cooling)',
            gross: 3500,
            rebate: 300,
            net: 3200,
            saving: 400,
            payback: 8.0,
            priority: isLandlord ? 'compliance' : 'recommended'
          });
        }
      }

      if (isGasCook) {
        upgrades.push({
          name: 'Induction Cooktop',
          desc: 'Replace gas cooktop with fast, efficient induction',
          gross: 2000,
          rebate: 0,
          net: 2000,
          saving: 100,
          payback: 20.0,
          priority: 'optional'
        });
      }

      if (noSolar) {
        upgrades.push({
          name: 'Solar PV System (6.6kW)',
          desc: 'Rooftop solar to offset electricity costs and power your electric appliances',
          gross: 8000,
          rebate: 3800,
          net: 4200,
          saving: 1200,
          payback: 4.0,
          priority: 'recommended'
        });
      }

      if (noSolar === false && noBattery) {
        upgrades.push({
          name: 'Battery Storage (10kWh)',
          desc: 'Store excess solar energy for evening use',
          gross: 12000,
          rebate: 2720,
          net: 9280,
          saving: 800,
          payback: 10.5,
          priority: 'optional'
        });
      }

      if (isOldHome) {
        upgrades.push({
          name: 'Draught Sealing',
          desc: 'Professional draught sealing for windows, doors, and gaps',
          gross: 1500,
          rebate: 700,
          net: 800,
          saving: 150,
          payback: 5.3,
          priority: isLandlord ? 'compliance' : 'recommended'
        });
        upgrades.push({
          name: 'Ceiling Insulation',
          desc: 'Add or upgrade ceiling insulation (VEU discount now available)',
          gross: 3000,
          rebate: 700,
          net: 2300,
          saving: 300,
          payback: 7.7,
          priority: isLandlord ? 'compliance' : 'recommended'
        });
      }

      // Sort: compliance first, then by payback
      upgrades.sort((a, b) => {
        if (a.priority === 'compliance' && b.priority !== 'compliance') return -1;
        if (b.priority === 'compliance' && a.priority !== 'compliance') return 1;
        return a.payback - b.payback;
      });

      // Totals
      const totalGross = upgrades.reduce((s, u) => s + u.gross, 0);
      const totalRebate = upgrades.reduce((s, u) => s + u.rebate, 0);
      const totalNet = upgrades.reduce((s, u) => s + u.net, 0);
      const totalSaving = upgrades.reduce((s, u) => s + u.saving, 0);
      const totalPayback = totalSaving > 0 ? Math.round((totalNet / totalSaving) * 10) / 10 : 0;

      // Pre-select all upgrades for lead form
      this.lead.upgrades = upgrades.map(u => u.name);

      this.results = {
        compliance,
        complianceMsg,
        items,
        upgrades,
        totalGross,
        totalNet,
        totalRebate,
        totalSaving,
        totalPayback,
      };
    }
  };
}
