document.write(`<!-- JSON-LD: Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Switch to Electric Vic",
  "url": "https://www.switchtoelectricvic.com.au",
  "description": "Helping Victorian homeowners and landlords navigate electrification rules, calculate rebates, and connect with verified local installers.",
  "areaServed": {
    "@type": "State",
    "name": "Victoria",
    "containedInPlace": { "@type": "Country", "name": "Australia" }
  }
}
</script>

<!-- JSON-LD: WebApplication (Calculator) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Victorian Electrification & Rebate Calculator",
  "url": "https://www.switchtoelectricvic.com.au",
  "description": "Free calculator that checks Victorian homeowners' and landlords' compliance with new electrification rules, estimates upgrade costs after stacking Solar Victoria, VEU, and federal STC rebates, and calculates annual energy savings and payback periods.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "AUD"
  },
  "featureList": [
    "Compliance check against Victorian Building Electrification Regulations",
    "MEES compliance check for rental properties (March 2027 deadline)",
    "Rebate stacking calculator (Solar Victoria + VEU + federal STCs)",
    "Upgrade cost estimator for heat pump hot water, reverse cycle AC, solar PV, insulation",
    "Annual energy savings and payback period calculator",
    "Lead capture to connect with up to 3 verified local installers"
  ],
  "creator": {
    "@type": "Organization",
    "name": "Switch to Electric Vic"
  }
}
</script>

<!-- JSON-LD: FAQPage -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the new electrification rules in Victoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Victoria has banned gas connections in all new residential buildings. For existing homes, gas hot water systems must be replaced with electric alternatives (such as heat pump hot water) at end-of-life — you can no longer install a new gas hot water system. Landlords face stricter rules: both gas heating and gas hot water must be replaced with electric when they fail, and rental properties must meet Minimum Energy Efficiency Standards (MEES) by 1 March 2027."
      }
    },
    {
      "@type": "Question",
      "name": "How much rebate can I get for a heat pump hot water system in Victoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Victorian homeowners can stack up to $2,030 in rebates on a heat pump hot water system by combining three programs: Solar Victoria rebate (up to $1,000–$1,400), Victorian Energy Upgrades (VEU) discount ($560–$630), and federal Small-scale Technology Certificates (STCs, $300–$600). A $3,500 heat pump hot water system could cost as little as $1,470 after all rebates."
      }
    },
    {
      "@type": "Question",
      "name": "Can I still install a gas hot water system in Victoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Under Victoria's Building Electrification Regulations (finalised June 2025), when your gas hot water system reaches end-of-life, it must be replaced with an electric alternative such as a heat pump hot water system. New gas hot water installations are no longer permitted. This applies to both owner-occupiers and rental properties."
      }
    },
    {
      "@type": "Question",
      "name": "What is the MEES deadline for Victorian landlords?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Victorian rental properties must meet Minimum Energy Efficiency Standards (MEES) by 1 March 2027. However, advertising a non-compliant rental property has been a criminal offence since 25 November 2025, with penalties of up to 300 penalty units (approximately $61,053). Landlords should audit their rental properties and plan upgrades well before the deadline."
      }
    },
    {
      "@type": "Question",
      "name": "What rebates are available for solar panels in Victoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Victorian homeowners can receive up to $1,400 from the Solar Victoria rebate (50% of system cost) plus a matching $1,400 interest-free loan repaid over 4 years. Federal STCs provide an additional discount of approximately $2,400 for a 6.6kW system in Melbourne (2026 rates). Combined, these can reduce the cost of a residential solar system by over $3,800. Household income must be under $210,000 and property value under $3 million to qualify."
      }
    },
    {
      "@type": "Question",
      "name": "Do Victorian landlords have to replace gas heaters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Unlike owner-occupiers (who only need to replace gas hot water at end-of-life), Victorian landlords must replace both gas heating and gas hot water with electric alternatives when the appliances reach end-of-life. This is part of the stricter electrification requirements for rental properties under Victoria's Building Electrification Regulations."
      }
    },
    {
      "@type": "Question",
      "name": "How much can I save by switching from gas to electric in Victoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Savings vary by household, but typical annual savings include: $400/year by switching from gas to heat pump hot water, $400–$600/year by replacing gas heating with reverse cycle air conditioning, and $100/year by switching from a gas cooktop to induction. Adding a 6.6kW solar PV system can save approximately $1,200/year. Total savings of $1,000–$2,000+ per year are common for a full home electrification."
      }
    },
    {
      "@type": "Question",
      "name": "What is the Victorian Energy Upgrades (VEU) program?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Victorian Energy Upgrades (VEU) program is a market-based state government scheme that provides upfront discounts on energy-efficient products and services. It covers heating/cooling, hot water (including heat pump discounts of $560–$630), draught sealing (up to $700), and ceiling insulation (available from April 2026). Discounts are applied automatically at point of sale by accredited installers. There is no income test — all Victorian households are eligible."
      }
    }
  ]
}
</script>

<!-- JSON-LD: HowTo (Calculator Steps) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Check Your Victorian Electrification Compliance and Calculate Rebates",
  "description": "Use the free Switch to Electric Vic calculator to check if your home complies with Victoria's new electrification rules, estimate upgrade costs after rebates, and connect with verified local installers.",
  "totalTime": "PT1M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter your property details",
      "text": "Select whether you are a homeowner or landlord, and tell us about your current hot water system, heating, cooktop, and property age."
    },
    {
      "@type": "HowToStep",
      "name": "View your compliance status",
      "text": "See whether your property is compliant, needs action, or is non-compliant with Victoria's electrification rules. Landlords will see MEES deadline warnings."
    },
    {
      "@type": "HowToStep",
      "name": "Review recommended upgrades and costs",
      "text": "See a prioritised list of upgrades with gross costs, available rebates (Solar Victoria, VEU, federal STCs), net costs after rebates, annual savings, and payback periods."
    },
    {
      "@type": "HowToStep",
      "name": "Get a free report or installer quotes",
      "text": "Choose to receive a detailed PDF report by email and/or get free quotes from up to 3 verified local installers in your area."
    }
  ]
}
</script>

`);