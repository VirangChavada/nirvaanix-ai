const leads = [
  {
    company: "Northstar Family Clinics",
    industry: "Healthcare",
    region: "United States · Midwest",
    size: "mid",
    employees: 640,
    intent: 91,
    value: 185000,
    problem: "Manual intake, billing follow-up, and patient routing are slowing care teams.",
    signals: ["Hiring data analysts", "Recently added telehealth locations", "High support ticket volume"],
    contact: "COO"
  },
  {
    company: "BridgeLedger Credit Union",
    industry: "Financial Services",
    region: "United States · Texas",
    size: "mid",
    employees: 780,
    intent: 88,
    value: 220000,
    problem: "Needs faster member onboarding and fraud triage without adding headcount.",
    signals: ["Digital transformation roadmap", "Compliance operations backlog", "New mobile banking launch"],
    contact: "VP Operations"
  },
  {
    company: "Atlas Precision Parts",
    industry: "Manufacturing",
    region: "United States · Ohio",
    size: "enterprise",
    employees: 1600,
    intent: 84,
    value: 310000,
    problem: "Disconnected production data limits forecasting, QA, and maintenance planning.",
    signals: ["ERP modernization", "Multiple plant locations", "Quality defect reduction goal"],
    contact: "Director of Manufacturing Systems"
  },
  {
    company: "Luma Home Goods",
    industry: "Retail",
    region: "United States · Remote",
    size: "small",
    employees: 180,
    intent: 76,
    value: 95000,
    problem: "Customer service demand spikes during promotions and returns season.",
    signals: ["New Shopify Plus build", "Expanding product catalog", "High abandoned cart rate"],
    contact: "Head of Ecommerce"
  },
  {
    company: "FreightNest Logistics",
    industry: "Logistics",
    region: "United States · Southeast",
    size: "enterprise",
    employees: 2400,
    intent: 93,
    value: 420000,
    problem: "Dispatch, route exceptions, and shipment updates rely on manual coordinator work.",
    signals: ["Fleet expansion", "Customer portal RFP", "Delivery SLA pressure"],
    contact: "Chief Logistics Officer"
  },
  {
    company: "Summit Pathways Academy",
    industry: "Education",
    region: "United States · California",
    size: "small",
    employees: 220,
    intent: 71,
    value: 82000,
    problem: "Admissions and student success teams need personalized engagement at scale.",
    signals: ["New online programs", "CRM adoption", "Enrollment conversion initiative"],
    contact: "Director of Enrollment"
  },
  {
    company: "Pinnacle Claims Group",
    industry: "Financial Services",
    region: "United States · New York",
    size: "enterprise",
    employees: 1200,
    intent: 86,
    value: 275000,
    problem: "Claims review queues are growing and decision support is inconsistent.",
    signals: ["AI governance role posted", "Claims backlog", "Document-heavy workflows"],
    contact: "Chief Claims Officer"
  },
  {
    company: "CareBridge Diagnostics",
    industry: "Healthcare",
    region: "United States · Florida",
    size: "small",
    employees: 145,
    intent: 68,
    value: 76000,
    problem: "Lab scheduling, reporting, and physician updates need workflow automation.",
    signals: ["Opening new lab", "Referral partner growth", "Manual report delivery"],
    contact: "Practice Administrator"
  }
];

const form = document.querySelector("#leadForm");
const industryInput = document.querySelector("#industry");
const sizeInput = document.querySelector("#companySize");
const scoreInput = document.querySelector("#scoreThreshold");
const scoreLabel = document.querySelector("#scoreLabel");
const regionInput = document.querySelector("#region");
const leadList = document.querySelector("#leadList");
const template = document.querySelector("#leadCardTemplate");
const pipelineValue = document.querySelector("#pipelineValue");
const pipelineCount = document.querySelector("#pipelineCount");
const avgIntent = document.querySelector("#avgIntent");
const topIndustry = document.querySelector("#topIndustry");
const nextStep = document.querySelector("#nextStep");
const exportButton = document.querySelector("#exportCsv");

let currentResults = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function getFilteredLeads() {
  const industry = industryInput.value;
  const size = sizeInput.value;
  const threshold = Number(scoreInput.value);
  const region = regionInput.value.trim().toLowerCase();

  return leads
    .filter((lead) => industry === "all" || lead.industry === industry)
    .filter((lead) => size === "all" || lead.size === size)
    .filter((lead) => lead.intent >= threshold)
    .filter((lead) => !region || lead.region.toLowerCase().includes(region))
    .sort((a, b) => b.intent - a.intent || b.value - a.value);
}

function buildOutreach(lead) {
  return `Hi ${lead.contact}, Nirvaanix helps ${lead.industry.toLowerCase()} teams use AI to remove manual work. I noticed ${lead.company} may be dealing with: ${lead.problem} We can map a 30-day automation pilot around ${lead.signals[0].toLowerCase()}. Open to a quick fit check?`;
}

async function copyOutreach(lead, button) {
  const message = buildOutreach(lead);
  await navigator.clipboard.writeText(message);
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = "Copy outreach";
  }, 1600);
}

function renderLeads(results) {
  leadList.innerHTML = "";

  if (!results.length) {
    leadList.innerHTML = '<div class="empty-state">No matching leads yet. Lower the minimum score or broaden your filters.</div>';
    return;
  }

  results.forEach((lead) => {
    const card = template.content.cloneNode(true);
    card.querySelector("h3").textContent = lead.company;
    card.querySelector(".lead-meta").textContent = `${lead.industry} · ${lead.region} · ${lead.employees.toLocaleString()} employees`;
    card.querySelector(".score-pill").textContent = `${lead.intent}% fit`;
    card.querySelector(".lead-problem").textContent = lead.problem;
    card.querySelector(".value").textContent = `${formatCurrency(lead.value)} estimated value · Talk to ${lead.contact}`;

    const signalList = card.querySelector(".signals");
    lead.signals.forEach((signal) => {
      const item = document.createElement("li");
      item.textContent = signal;
      signalList.append(item);
    });

    card.querySelector(".copy-button").addEventListener("click", (event) => {
      copyOutreach(lead, event.currentTarget);
    });

    leadList.append(card);
  });
}

function renderInsights(results) {
  const totalValue = results.reduce((sum, lead) => sum + lead.value, 0);
  const averageIntent = results.length
    ? Math.round(results.reduce((sum, lead) => sum + lead.intent, 0) / results.length)
    : 0;
  const industryCounts = results.reduce((counts, lead) => {
    counts[lead.industry] = (counts[lead.industry] || 0) + 1;
    return counts;
  }, {});
  const leadingIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  pipelineValue.textContent = formatCurrency(totalValue);
  pipelineCount.textContent = `${results.length} lead${results.length === 1 ? "" : "s"} ready`;
  avgIntent.textContent = `${averageIntent}%`;
  topIndustry.textContent = leadingIndustry;
  nextStep.textContent = results[0] ? `Contact ${results[0].contact}` : "—";
}

function refreshResults() {
  scoreLabel.textContent = `${scoreInput.value}+`;
  currentResults = getFilteredLeads();
  renderInsights(currentResults);
  renderLeads(currentResults);
}

function exportCsv() {
  const rows = [
    ["Company", "Industry", "Region", "Employees", "Intent", "Estimated Value", "Problem", "Contact", "Signals"],
    ...currentResults.map((lead) => [
      lead.company,
      lead.industry,
      lead.region,
      lead.employees,
      `${lead.intent}%`,
      lead.value,
      lead.problem,
      lead.contact,
      lead.signals.join("; ")
    ])
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nirvaanix-ai-leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  refreshResults();
});
scoreInput.addEventListener("input", refreshResults);
exportButton.addEventListener("click", exportCsv);

refreshResults();
