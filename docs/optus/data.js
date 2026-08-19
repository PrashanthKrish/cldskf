// Optus Conversational AI Demo — synthetic content module.
// Every string here is transcribed from optus-uc1-synthetic-data.json (English fields only)
// and optus-uc1-prd.md. Nothing here is invented. Not connected to any live Optus system.

export const DATA = {
  meta: {
    version: "1.0.0",
    useCaseId: "TCS-OPTUS-UC1",
    generatedAt: "2026-08-19T14:32:00+10:00",
    disclaimer: "Internal TCS demonstration asset. All customers, accounts, numbers, tickets and telemetry in this application are synthetic. Not connected to any live Optus system."
  },

  useCase: {
    title: "Optus Conversational AI — resolve, preserve, then grow",
    subtitle: "AI-led technical support, seamless human handoff, and responsible next-best-action recommendation",
    executiveSummary: [
      "This use case demonstrates how TCS can help Optus deliver a modern, customer-first Conversational AI experience for high-volume technical support interactions. An existing Optus customer calls the care helpline with a complex broadband and mobile connectivity issue. The AI agent recognises the customer through the calling number, authenticates securely using the six-digit account PIN, performs guided diagnostics, partially resolves the issue, and escalates to a human agent when deeper technical intervention is required.",
      "The human agent receives a complete AI-generated conversation summary, diagnostics performed, customer sentiment, issue classification, likely root cause and recommended next best actions. During the interaction, Agent Assist also identifies a suitable Optus product recommendation relevant to the customer's home connectivity problem and supports the agent with a compliant, needs-led explanation. The customer's issue is actioned and the customer purchases the recommended service."
    ],
    criticalMessage: "TCS is not positioning Conversational AI as a standalone bot. The demo showcases a controlled Human + AI operating model where the AI resolves what it can, preserves context during handoff, augments the human agent, and recommends growth only after the customer's service need is addressed.",
    scenarioTitle: "Optus broadband intermittent dropouts + mobile data backup + Smart WiFi recommendation",
    scenario: [
      { item: "Customer", design: "Priya Sharma, existing Optus customer with Optus nbn Home Internet and Optus Mobile service." },
      { item: "Primary issue", design: "Intermittent home broadband dropouts, slow WiFi in the back room, and customer dependency on mobile hotspot for work calls." },
      { item: "Complexity", design: "AI detects that the basic customer-premise checks are successful, but line telemetry shows instability that requires human-supported remediation and possible network ticket creation." },
      { item: "AI partial resolution", design: "AI validates the account, checks service status, runs standard troubleshooting, refreshes the modem profile, confirms temporary mobile data backup eligibility, and prepares the escalation package." },
      { item: "Human agent role", design: "Human agent validates the AI summary, completes advanced diagnostic interpretation, initiates the support ticket, confirms the workaround, and explains the recommended Optus service." },
      { item: "Product identified", design: "Optus Smart WiFi Booster / enhanced WiFi coverage support, recommended only after resolving the support issue and confirming customer need." },
      { item: "Outcome", design: "Issue actioned through profile refresh, ticket creation and backup data activation; customer purchases Smart WiFi Booster for better home coverage. Line investigation remains open." }
    ],
    personaLegend: [
      { id: "customer", role: "Customer", detail: "Priya Sharma, Optus customer." },
      { id: "ai", role: "Conversational AI Agent", detail: "“Olivia”, Optus virtual care assistant." },
      { id: "human", role: "Human Agent", detail: "“Daniel”, Optus care specialist." },
      { id: "assist", role: "Agent Assist", detail: "Real-time AI guidance visible to Daniel only." },
      { id: "critical", role: "Critical aspect", detail: "Any important control, capability, risk, intelligence or business value callout is shown in bold black text." }
    ],
    capabilities: [
      { id: "cap1", name: "Natural conversation", shownBy: "The customer explains the problem in everyday language and the AI identifies technical support intent without rigid IVR menus." },
      { id: "cap2", name: "Secure authentication", shownBy: "The AI recognises the calling number but still performs full-name and PIN-based verification before accessing account data." },
      { id: "cap3", name: "Telecom-specific diagnostics", shownBy: "The AI checks outage status, modem health, dropout history, line telemetry and profile mismatch before handoff." },
      { id: "cap4", name: "Partial autonomous resolution", shownBy: "The AI completes the profile refresh and mobile backup eligibility check, then escalates only the unresolved portion." },
      { id: "cap5", name: "Context-preserving handoff", shownBy: "The human agent receives the full summary, diagnostics, sentiment, outcome so far, escalation reason and recommended actions." },
      { id: "cap6", name: "Real-time Agent Assist", shownBy: "The agent gets next best actions, knowledge prompts, compliance guardrails and product clarification support during the live call." },
      { id: "cap7", name: "Responsible next-best-action", shownBy: "The product recommendation is made only after the support need is addressed and the customer need is confirmed." },
      { id: "cap8", name: "Closed-loop fulfilment", shownBy: "Ticket, temporary data support, product order and customer confirmations are completed in one coherent interaction." }
    ],
    successMeasures: [
      { id: "sm1", label: "Customer experience", detail: "Reduced repetition, faster authentication, clearer troubleshooting and a transparent handoff." },
      { id: "sm2", label: "Service performance", detail: "Improved first-contact diagnosis, fewer avoidable transfers and better escalation quality." },
      { id: "sm3", label: "Agent productivity", detail: "Lower search effort, shorter discovery time and real-time action guidance." },
      { id: "sm4", label: "Commercial value", detail: "Needs-led Smart WiFi recommendation after service resolution, supporting responsible cross-sell." },
      { id: "sm5", label: "Trust and risk", detail: "Authentication controls, consent capture, explainable recommendation and an audit-ready interaction record." }
    ],
    positioningStatement: "TCS brings telecom domain experience, conversational AI design patterns, controlled GenAI guardrails, agent assist capability and customer operations transformation expertise to help Optus move from fragmented support interactions to intelligent, context-aware and outcome-led customer care. This demo is designed to show how AI can resolve, assist, protect and grow in the right sequence: first address the service issue, then preserve trust, then recommend only what genuinely fits the customer need.",
    sourceBasis: "Aligned to internal TCS materials on Optus frontline AI strategy, TCS Conversational AI capabilities, telecom troubleshooting patterns and AI-assisted handoff design."
  },

  customer: {
    id: "CUST-AU-4471902",
    name: "Priya Sharma",
    givenName: "Priya",
    maskedCallingNumber: "+61 400 ••• 417",
    email: "p•••@example.com.au",
    tenureMonths: 47,
    serviceAddress: "18 Kenmore Street, Ashfield NSW 2131",
    suburb: "Ashfield", state: "NSW", postcode: "2131",
    consent: { marketing: true, dataUse: true, recording: true },
    preferredChannel: "SMS"
  },

  account: {
    number: "•••••8214",
    type: "Residential bundle (broadband + mobile)",
    billingStatus: "Current, no overdue balance",
    paymentMethod: "Direct debit",
    loyaltySegment: "Established household, 4 years tenure",
    lifetimeValueBand: "Mid-high",
    churnPropensity: "medium"
  },

  services: [
    { id: "SVC-NBN-88301", kind: "broadband", name: "Optus nbn Home Internet", plan: "Family Entertainer nbn plan", speedTier: "nbn 100 / 20 Mbps (FTTN)", activeSince: "2022-09-14", status: "Active, degraded performance" },
    { id: "SVC-MOB-44127", kind: "mobile", name: "Optus Mobile", plan: "Optus Choice Plus 60 GB", dataAllowance: "60 GB per month, 48 GB used", maskedMsisdn: "+61 400 ••• 908", activeSince: "2022-09-14", status: "Active, hotspot in heavy use" }
  ],

  auth: {
    accountPin: "483921",
    failedAttemptsAllowed: 3,
    requiredSteps: [
      { id: "auth1", label: "Calling number matched to account", agentId: "cca-customer-data" },
      { id: "auth2", label: "Full name confirmed by customer", agentId: "cca-customer-data" },
      { id: "auth3", label: "Six-digit account PIN validated", agentId: "cx-validation" },
      { id: "auth4", label: "Authentication outcome", agentId: "cx-validation" },
      { id: "auth5", label: "Failed attempt count", agentId: "cx-validation" }
    ],
    outcome: "Verified — full account access granted"
  },

  intent: {
    intent: "Technical support",
    subIntent: "Broadband intermittent dropouts",
    sentimentInitial: "frustrated",
    sentimentFinal: "satisfied",
    urgency: "High — work-from-home dependency",
    repeatContact: true,
    repeatContactDetail: "Second contact in 9 days on the same service",
    reasonForCall: "Home internet dropping out during work video calls; currently using mobile hotspot as a workaround"
  },

  telemetry: {
    dropoutCount: 6,
    longestDropout: "4 minutes 12 seconds at 20:14",
    lastDisconnect: "2026-08-19T13:48:00+10:00",
    speedTest: { downMbps: 48.6, upMbps: 17.2 },
    verdict: "Intermittent signal instability on the access line. Customer-premise equipment healthy.",
    hourly: [
      { hour: "15:00", snrMarginDb: 16.8, dropout: false },
      { hour: "16:00", snrMarginDb: 16.2, dropout: false },
      { hour: "17:00", snrMarginDb: 15.1, dropout: false },
      { hour: "18:00", snrMarginDb: 7.4, dropout: true, note: "Dropout 1 — 1 m 38 s" },
      { hour: "19:00", snrMarginDb: 12.9, dropout: false },
      { hour: "20:00", snrMarginDb: 5.6, dropout: true, note: "Dropout 2 — 4 m 12 s, longest in window" },
      { hour: "21:00", snrMarginDb: 6.8, dropout: true, note: "Dropout 3 — 2 m 05 s" },
      { hour: "22:00", snrMarginDb: 13.4, dropout: false },
      { hour: "23:00", snrMarginDb: 6.1, dropout: true, note: "Dropout 4 — 1 m 22 s" },
      { hour: "00:00", snrMarginDb: 15.7, dropout: false },
      { hour: "01:00", snrMarginDb: 17.1, dropout: false },
      { hour: "02:00", snrMarginDb: 17.6, dropout: false },
      { hour: "03:00", snrMarginDb: 18.0, dropout: false },
      { hour: "04:00", snrMarginDb: 17.9, dropout: false },
      { hour: "05:00", snrMarginDb: 17.2, dropout: false },
      { hour: "06:00", snrMarginDb: 15.9, dropout: false },
      { hour: "07:00", snrMarginDb: 6.4, dropout: true, note: "Dropout 5 — 2 m 47 s, first work-hours impact" },
      { hour: "08:00", snrMarginDb: 12.1, dropout: false },
      { hour: "09:00", snrMarginDb: 11.6, dropout: false },
      { hour: "10:00", snrMarginDb: 13.8, dropout: false },
      { hour: "11:00", snrMarginDb: 12.4, dropout: false },
      { hour: "12:00", snrMarginDb: 11.2, dropout: false },
      { hour: "13:00", snrMarginDb: 5.9, dropout: true, note: "Dropout 6 — 3 m 04 s, second failed video call" },
      { hour: "14:00", snrMarginDb: 10.7, dropout: false }
    ]
  },

  modem: {
    model: "Optus Ultra WiFi Modem Gen 2",
    firmware: "3.14.7-AU",
    uptimeMinutes: 41,
    wifiRadios: "2.4 GHz and 5 GHz both healthy, no radio faults",
    connectedDevices: 11,
    rebootHistory: [
      { at: "13:52", source: "Manual reboot by customer" },
      { at: "08:11", source: "Manual reboot by customer" },
      { at: "prev day 20:19", source: "Power interruption recovery" }
    ],
    profileRefresh: {
      result: "Completed successfully from the network side",
      corrected: "Provisioning mismatch on the service profile corrected; stale session state cleared"
    }
  },

  diagnostics: {
    totalMs: 10900,
    steps: [
      { id: "d1", order: 1, durationMs: 600, status: "pass", agentId: "cca-customer-data",
        name: "CLI account match", evidence: "Account resolved from calling number, single match",
        detail: [
          { label: "Calling number", value: "+61 400 ••• 417" },
          { label: "Matched account", value: "•••••8214" },
          { label: "Match confidence", value: "Exact, 1 of 1 candidate" }
        ], attributesCaptured: ["at-id-03"] },
      { id: "d2", order: 2, durationMs: 900, status: "pass", agentId: "cx-issue-analyser",
        name: "Area outage check", evidence: "No active outage listed for the service address",
        detail: [
          { label: "Service address", value: "18 Kenmore Street, Ashfield NSW 2131" },
          { label: "Planned works", value: "None in the next 7 days" },
          { label: "Neighbouring fault reports (48 h)", value: "2 reports, below cluster threshold of 6" }
        ], sopRef: "sop-outage", attributesCaptured: ["at-tech-01"] },
      { id: "d3", order: 3, durationMs: 700, status: "pass", agentId: "cx-issue-analyser",
        name: "Modem online status and health", evidence: "Modem online, uptime 41 minutes, WiFi radios healthy",
        detail: [
          { label: "Model / firmware", value: "Optus Ultra WiFi Modem Gen 2 · 3.14.7-AU" },
          { label: "WiFi radios", value: "2.4 GHz and 5 GHz both healthy" },
          { label: "Connected devices", value: "11" },
          { label: "Reboots in 24 h", value: "3 (2 manual by customer)" }
        ], attributesCaptured: ["at-tech-02", "at-tech-03", "at-tech-08"] },
      { id: "d4", order: 4, durationMs: 1100, status: "attention", agentId: "cx-issue-analyser",
        name: "Dropout history, last 24 hours", evidence: "6 dropouts in 24 hours, longest 4 m 12 s, 2 during work hours",
        detail: [
          { label: "Dropout count", value: "6 in 24 hours" },
          { label: "Last disconnect", value: "19 Aug 2026, 1:48 pm" },
          { label: "Pattern", value: "Clustered in evening peak and morning work hours" }
        ], thresholdCrossed: "Exceeds the 3-dropouts-per-24-hours investigation threshold",
        sopRef: "sop-dropouts", attributesCaptured: ["at-tech-04", "at-tech-05"] },
      { id: "d5", order: 5, durationMs: 4200, status: "fault", agentId: "cx-issue-analyser",
        name: "Line quality and telemetry review", evidence: "Intermittent signal instability — SNR margin drops to 5.6 dB against a 9 dB floor",
        detail: [
          { label: "SNR margin range", value: "5.6 dB to 18.0 dB over 24 hours" },
          { label: "Stability floor", value: "9 dB for this access technology" },
          { label: "Speed test", value: "48.6 Mbps down / 17.2 Mbps up against a 100 / 20 tier" },
          { label: "Customer-premise equipment", value: "Healthy — fault is not at the premises" },
          { label: "Timing note", value: "Quoted to the customer as about 20 seconds; compressed for the demo" }
        ], thresholdCrossed: "SNR margin below the stability floor on 6 occasions",
        sopRef: "sop-line-quality", attributesCaptured: ["at-tech-06", "at-tech-07"] },
      { id: "d6", order: 6, durationMs: 2600, status: "pass", agentId: "cx-remediation",
        name: "Network-side modem profile refresh", evidence: "Provisioning mismatch corrected, stale session state cleared",
        detail: [
          { label: "Action", value: "Service profile re-pushed from the network, not a device restart" },
          { label: "Mismatch found", value: "Profile speed template out of step with the provisioned tier" },
          { label: "Result", value: "Corrected. Customer asked to restart the modem to adopt the profile." },
          { label: "Residual issue", value: "Line instability persists — requires assisted handling" }
        ], sopRef: "sop-profile-refresh", attributesCaptured: ["at-tech-09", "at-res-01"] },
      { id: "d7", order: 7, durationMs: 800, status: "pass", agentId: "cx-validation",
        name: "Temporary mobile data backup eligibility", evidence: "Eligible — 20 GB temporary top-up available for 14 days at no charge",
        detail: [
          { label: "Mobile service", value: "+61 400 ••• 908, Optus Choice Plus 60 GB" },
          { label: "Current usage", value: "48 GB of 60 GB used this cycle" },
          { label: "Eligibility basis", value: "Open broadband fault affecting a work-from-home customer" }
        ], sopRef: "sop-topup", attributesCaptured: ["at-res-02"] }
    ]
  },

  eligibility: {
    mobileTopup: { status: "eligible", allowance: "20 GB temporary data", durationDays: 14, cost: "No charge while the broadband fault is open", basis: "Open broadband fault with confirmed work-from-home impact" },
    smartWifiBooster: {
      status: "eligible",
      checks: [
        { label: "Service compatibility", value: "Compatible with Optus Ultra WiFi Modem Gen 2", passed: true },
        { label: "Address eligibility", value: "Available at 18 Kenmore Street, Ashfield NSW", passed: true },
        { label: "Coverage-gap evidence", value: "Customer-confirmed weak WiFi in the back room", passed: true },
        { label: "Plan compatibility", value: "Add-on permitted on the Family Entertainer nbn plan", passed: true }
      ]
    }
  },

  handoff: {
    generatedBy: "cca-summary",
    customerIdentity: "Priya Sharma authenticated successfully using the six-digit account PIN.",
    reasonForCall: "Frequent broadband dropouts impacting work-from-home calls; customer using the Optus mobile hotspot as a workaround.",
    sentiment: "Frustrated but cooperative; urgency high due to work dependence.",
    diagnosticsCompleted: [
      "CLI account match", "Area outage check", "Modem online status and health",
      "Dropout history, last 24 hours", "Line quality and telemetry review",
      "Network-side modem profile refresh", "Temporary mobile data backup eligibility"
    ],
    findings: [
      "No listed area outage at the service address.",
      "Modem hardware appears healthy; WiFi radios and power normal.",
      "Six dropouts in 24 hours, exceeding the investigation threshold.",
      "Line telemetry indicates intermittent instability, SNR margin down to 5.6 dB.",
      "Profile refresh completed; provisioning mismatch corrected by AI."
    ],
    escalationReason: "Partial resolution achieved; remaining line instability requires advanced human-assisted support and ticket creation.",
    rootCauseProbability: "Access-line instability upstream of the premises — 82% likely",
    confidenceScore: 0.82,
    recommendedTicketType: "Network investigation — intermittent access-line instability",
    nextBestActions: [
      { id: "nba1", order: 1, text: "Confirm customer impact and reassure." },
      { id: "nba2", order: 2, text: "Create a network investigation ticket." },
      { id: "nba3", order: 3, text: "Apply the temporary mobile data top-up." },
      { id: "nba4", order: 4, text: "Schedule callback and SMS updates." },
      { id: "nba5", order: 5, text: "After issue resolution, assess Smart WiFi Booster suitability based on the back-room coverage concern.", unlockedBy: "coverageGapConfirmed" }
    ],
    productInsight: "Customer mentioned weak WiFi in the back room and frequent reliance on the mobile hotspot. Agent Assist recommends Smart WiFi Booster.",
    productInsightCondition: "Recommend only if the customer confirms in-home coverage gaps after the immediate service issue is addressed."
  },

  conversation: {
    stage1: [
      { id: "t01", stage: 1, channel: "voice", speaker: "ai", agentId: "cx-orchestration",
        text: "Welcome to Optus. I'm Olivia, your virtual care assistant. I can help with technical support, billing, account changes and service requests. How can I help you today?" },
      { id: "t02", stage: 1, channel: "voice", speaker: "customer",
        text: "My home internet keeps dropping out. I'm working from home and I've already had two video calls fail today. I'm using my mobile hotspot now, but that's not ideal.",
        sentimentAfter: "frustrated", attributesCaptured: ["at-int-01","at-int-02","at-int-03","at-int-04","at-int-05","at-int-06"] },
      { id: "t03", stage: 1, channel: "voice", speaker: "ai", agentId: "cca-customer-data",
        text: "I'm sorry you're experiencing that, Priya. I understand how disruptive this can be when you're working from home. I've identified your Optus account using the number you're calling from, but I'll complete authentication before accessing service details. May I please confirm your full name?",
        emphasis: ["I've identified your Optus account using the number you're calling from, but I'll complete authentication before accessing service details."],
        gate: { buttonId: "btn-confirm-name", labelKey: "Confirm name", sets: ["auth.nameConfirmed"] },
        attributesCaptured: ["at-id-01"] },
      { id: "t04", stage: 1, channel: "voice", speaker: "customer", text: "Priya Sharma.", attributesCaptured: ["at-id-02"] },
      { id: "t05", stage: 1, channel: "voice", speaker: "ai", agentId: "cx-validation",
        text: "Thank you, Priya. For security, please provide your six-digit account PIN.",
        gate: { buttonId: "btn-enter-pin", labelKey: "Enter PIN", sets: ["auth.pinVerified"] } },
      { id: "t06", stage: 1, channel: "voice", speaker: "customer", text: "It's four eight three nine two one.", attributesCaptured: ["at-id-04","at-id-06"] },
      { id: "t07", stage: 1, channel: "voice", speaker: "ai", agentId: "cx-validation",
        text: "Thanks. Your identity has been verified successfully. I can see you have Optus nbn Home Internet and an Optus mobile plan linked to the same account. I'll check your broadband service and run diagnostics now.",
        emphasis: ["Your identity has been verified successfully."],
        attributesCaptured: ["at-id-05","at-prof-01","at-prof-02","at-prof-03","at-prof-04","at-prof-05","at-prof-06","at-prof-07","at-prof-08"] }
    ],
    stage2: [
      { id: "t08", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-issue-analyser",
        text: "I can see the modem is currently online, but there have been six dropouts in the past 24 hours. I'll first check if there is a known outage in your area.",
        gate: { buttonId: "btn-run-diagnostics", labelKey: "Run diagnostics" } },
      { id: "t09", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-issue-analyser",
        text: "There is no active outage listed for your address. I'm going to run a line quality check and review your modem telemetry. This will take about 20 seconds." },
      { id: "t10", stage: 2, channel: "voice", speaker: "customer", text: "Okay." },
      { id: "t11", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-issue-analyser",
        text: "Thanks for waiting. The line test shows intermittent signal instability, but your modem power and WiFi radios are healthy. I'll refresh the modem profile remotely and then ask you to restart the modem.",
        gate: { buttonId: "btn-explain-refresh", labelKey: "Explain the refresh" } },
      { id: "t12", stage: 2, channel: "voice", speaker: "customer", text: "I restarted it twice already. Will this actually help?", sentimentAfter: "concerned" },
      { id: "t13", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-remediation",
        text: "That's a fair question. This is not a basic restart. I'm refreshing the service profile from the network side, which can correct provisioning mismatch or stale session issues. If the instability remains, I'll transfer you to a care specialist with the full diagnostic context so you won't need to repeat everything.",
        emphasis: ["This is not a basic restart. I'm refreshing the service profile from the network side, which can correct provisioning mismatch or stale session issues."],
        sentimentAfter: "reassured" },
      { id: "t14", stage: 2, channel: "voice", speaker: "customer", text: "Alright, please go ahead." },
      { id: "t15", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-remediation",
        text: "The profile refresh is complete. Please restart the modem now. While it comes back online, I'll check whether you're eligible for temporary mobile data support since you're using your Optus mobile hotspot for work.",
        gate: { buttonId: "btn-check-topup-eligibility", labelKey: "Check top-up eligibility", sets: ["eligibility.mobileTopup"] } },
      { id: "t16", stage: 2, channel: "voice", speaker: "ai", agentId: "cx-handoff",
        text: "I can see your mobile service is eligible for a temporary data top-up if needed. Your modem is reconnecting now, but the line instability is still visible. The AI has resolved the provisioning mismatch, but the remaining network instability needs assisted handling. I'll connect you to an Optus specialist and pass over everything I've found.",
        emphasis: ["The AI has resolved the provisioning mismatch, but the remaining network instability needs assisted handling."],
        gate: { buttonId: "btn-transfer-specialist", labelKey: "Transfer to specialist" },
        attributesCaptured: ["at-res-03","at-res-04","at-res-05","at-res-06","at-res-07"] }
    ],
    stage4: [
      { id: "t17", stage: 4, channel: "voice", speaker: "human",
        text: "Hi Priya, this is Daniel from Optus. I can see Olivia has already verified your account, checked for outages, reviewed the modem, refreshed the service profile and detected intermittent line instability. You won't need to repeat the troubleshooting steps. I'll take it from here.",
        emphasis: ["You won't need to repeat the troubleshooting steps."] },
      { id: "t18", stage: 4, channel: "voice", speaker: "customer", text: "That's good, because I really don't want to start from the beginning." },
      { id: "t19", stage: 4, channel: "assist", speaker: "assist", assistKind: "recommendation", agentId: "cx-orchestration",
        text: "Recommended agent response: acknowledge the frustration, confirm continuity, explain the next step in plain language. Next best action: create a network investigation ticket, apply the temporary data top-up, confirm SMS notification preference.",
        emphasis: ["Next best action:"],
        gate: { buttonId: "btn-create-ticket", labelKey: "Create ticket", sets: ["ticket.created"] } },
      { id: "t20", stage: 4, channel: "voice", speaker: "human",
        text: "Absolutely. The diagnostics show your modem itself looks healthy, but the line is showing intermittent instability. I'm creating a network investigation ticket now and I'll also activate a temporary data top-up on your Optus mobile service so your work calls are covered while we stabilise the broadband.",
        gate: { buttonId: "btn-apply-topup", labelKey: "Apply data top-up", requires: ["ticket.created"], sets: ["topup.applied"] } },
      { id: "t21", stage: 4, channel: "voice", speaker: "customer", text: "Thank you. How long will that take?" },
      { id: "t22", stage: 4, channel: "assist", speaker: "assist", assistKind: "knowledge", agentId: "cca-knowledgebase",
        text: "Knowledge retrieval: for intermittent line instability, provide the estimated investigation window, SMS updates and a callback commitment. Avoid over-promising a restoration time.",
        emphasis: ["Avoid over-promising a restoration time."] },
      { id: "t23", stage: 4, channel: "voice", speaker: "human",
        text: "The ticket is created now. You'll receive SMS updates, and if a field or network action is required, we'll confirm it through that channel. I'll also add a callback note because you've told us this is affecting work-from-home calls.",
        attributesCaptured: ["at-int-07"] },
      { id: "t24", stage: 4, channel: "voice", speaker: "customer",
        text: "That helps. But I also get weak WiFi in the back room even when the internet is working. Is that related?",
        gate: { buttonId: "btn-log-coverage-gap", labelKey: "Log coverage gap", sets: ["coverageGapConfirmed"] },
        attributesCaptured: ["at-res-08"] },
      { id: "t25", stage: 4, channel: "assist", speaker: "assist", assistKind: "productInsight", agentId: "cx-orchestration",
        text: "Product insight: the customer has confirmed an in-home WiFi coverage gap. Smart WiFi Booster may be suitable. Compliance guardrail: resolve the service action first; position the product as optional; explain benefit, eligibility and cost transparently.",
        emphasis: ["Compliance guardrail: resolve the service action first; position the product as optional; explain benefit, eligibility and cost transparently."] },
      { id: "t26", stage: 4, channel: "voice", speaker: "human",
        text: "It may be separate. The dropouts we're seeing are network-side instability, but weak coverage in the back room sounds like an in-home WiFi coverage issue. Once the broadband line is stable, an Optus Smart WiFi Booster could help extend coverage to that part of your home." }
    ],
    stage5: [
      { id: "t27", stage: 5, channel: "voice", speaker: "customer", text: "Will a booster fix the dropouts too?" },
      { id: "t28", stage: 5, channel: "assist", speaker: "assist", assistKind: "clarification", agentId: "cca-knowledgebase",
        text: "Clarification guidance: distinguish broadband line stability from in-home WiFi coverage. Do not imply the booster resolves the network fault. Recommend for coverage extension only.",
        emphasis: ["Do not imply the booster resolves the network fault."] },
      { id: "t29", stage: 5, channel: "voice", speaker: "human",
        text: "Great question. The booster is not meant to fix a network line fault, so we're handling that separately through the ticket. The booster helps when the broadband is working but the WiFi signal is weak in parts of the home, such as your back room.",
        emphasis: ["The booster is not meant to fix a network line fault"] },
      { id: "t30", stage: 5, channel: "voice", speaker: "customer", text: "That makes sense. I do need better coverage there. How would it work?" },
      { id: "t31", stage: 5, channel: "assist", speaker: "assist", assistKind: "nextBestAction", agentId: "cx-orchestration",
        text: "Answer support: explain simple setup, signal extension, compatibility check and the confirmation process. Next best action: offer Smart WiFi Booster if eligible and the customer consents.",
        emphasis: ["Next best action: offer Smart WiFi Booster if eligible and the customer consents."],
        gate: { buttonId: "btn-open-offer", labelKey: "Review Booster offer", requires: ["ticket.created","topup.applied","coverageGapConfirmed"] } },
      { id: "t32", stage: 5, channel: "voice", speaker: "human",
        text: "It extends your home WiFi coverage by improving signal reach in areas where the modem signal is weaker. I've checked compatibility with your current service, and you're eligible. I can add the Smart WiFi Booster service today, and you'll receive setup guidance with the confirmation.",
        attributesCaptured: ["at-res-09"] },
      { id: "t33", stage: 5, channel: "voice", speaker: "customer", text: "Before I say yes, will I be locked into anything?" },
      { id: "t34", stage: 5, channel: "assist", speaker: "assist", assistKind: "compliance", agentId: "cx-orchestration",
        text: "Compliance prompt: provide commercial terms, cancellation condition and confirmation requirement. Ask for explicit consent before adding the service.",
        emphasis: ["Ask for explicit consent before adding the service."] },
      { id: "t35", stage: 5, channel: "voice", speaker: "human",
        text: "I'll explain the terms clearly before making any change. It's optional, and I'll only add it if you agree. You'll also receive the terms in writing. Would you like me to go ahead and add the Smart WiFi Booster service to improve coverage in the back room?",
        emphasis: ["It's optional, and I'll only add it if you agree."],
        gate: { buttonId: "btn-offer-add", labelKey: "Add Booster service", sets: ["offer.added"] } },
      { id: "t36", stage: 5, channel: "voice", speaker: "customer", text: "Yes, please add it.", attributesCaptured: ["at-res-10"] },
      { id: "t37", stage: 5, channel: "voice", speaker: "human",
        text: "Done. You'll receive two SMS confirmations: one for the network investigation ticket and temporary mobile data support, and another for the Smart WiFi Booster order. Is there anything else I can help with today?" },
      { id: "t38", stage: 5, channel: "voice", speaker: "customer",
        text: "No, that's everything. Thanks for not making me repeat the whole story.", sentimentAfter: "satisfied", attributesCaptured: ["at-res-11"] },
      { id: "t39", stage: 5, channel: "voice", speaker: "human",
        text: "You're welcome, Priya. Thanks for being with Optus. We'll keep you updated on the ticket and the booster setup.",
        gate: { buttonId: "btn-wrap-call", labelKey: "Wrap up call" } }
    ],
    stage5Decline: [
      { id: "t36d", stage: 5, channel: "voice", speaker: "customer", text: "Not today, thanks. Let's see if the line gets fixed first.", attributesCaptured: ["at-res-10"] },
      { id: "t37d", stage: 5, channel: "voice", speaker: "human",
        text: "That's completely fine, and it's a sensible order to do things in. Nothing has been added to your account. You'll receive one SMS confirming the network investigation ticket and the temporary mobile data support. If you'd like to revisit the coverage question after the line is stable, any Optus agent can see the note I've left.",
        emphasis: ["Nothing has been added to your account."] },
      { id: "t38d", stage: 5, channel: "voice", speaker: "customer", text: "Thanks, that's all I needed.", sentimentAfter: "satisfied", attributesCaptured: ["at-res-11"],
        gate: { buttonId: "btn-wrap-call", labelKey: "Wrap up call" } }
    ]
  },

  offers: {
    smartWifiBooster: {
      id: "OFR-SWB-001", name: "Optus Smart WiFi Booster",
      what: "Extends home WiFi coverage by improving signal reach in areas where the modem signal is weaker, such as rooms at the far end of the home.",
      whatItIsNot: "It does not repair a network line fault. The intermittent dropouts are being handled separately through the network investigation ticket.",
      monthlyCharge: 12.0, currency: "AUD",
      contractTerm: "Month to month, no fixed term",
      cancellation: "Cancel any time before the next billing cycle, no exit fee",
      setup: "Self-install unit posted within 3 business days; setup guidance included in the confirmation",
      suitability: [
        { label: "Service compatibility", value: "Compatible with Optus Ultra WiFi Modem Gen 2", passed: true },
        { label: "Address eligibility", value: "Available at the service address", passed: true },
        { label: "Coverage-gap evidence", value: "Customer-confirmed weak WiFi in the back room", passed: true },
        { label: "Plan compatibility", value: "Add-on permitted on the current nbn plan", passed: true }
      ],
      compliance: [
        { id: "cmp-disclose-terms", required: true, label: "Commercial terms explained: monthly charge, no fixed term", regulatoryNote: "Price and term disclosure before any account change" },
        { id: "cmp-state-optional", required: true, label: "Stated that the service is optional" },
        { id: "cmp-separate-fault", required: true, label: "Clarified the booster does not resolve the network line fault", regulatoryNote: "No misleading representation of product capability" },
        { id: "cmp-written-terms", required: true, label: "Customer will receive the terms in writing" },
        { id: "cmp-explicit-consent", required: true, label: "Explicit customer consent captured before adding the service", regulatoryNote: "Consent must be affirmative, not assumed" }
      ],
      gate: ["ticket.created", "topup.applied", "coverageGapConfirmed"]
    }
  },

  ticketTemplate: {
    id: "NIT-2026-081947",
    type: "Network investigation — intermittent access-line instability",
    priority: "P2 — service degraded, work impact confirmed",
    impactOptions: ["Service unusable", "Service degraded, work impact confirmed", "Service degraded, no work impact", "Intermittent, monitoring only"],
    priorityOptions: ["P1 — critical", "P2 — high", "P3 — standard"],
    slaWindow: "Initial assessment within 2 business days; SMS updates at each milestone",
    description: "Six dropouts in 24 hours on nbn FTTN service. SNR margin falls to 5.6 dB against a 9 dB stability floor. Customer-premise equipment healthy, WiFi radios normal, three reboots recorded. Network-side profile refresh completed by AI and provisioning mismatch corrected; instability persists after refresh. Customer is work-from-home dependent; temporary mobile data support applied.",
    callbackNote: "Customer reports work-from-home video call failures. Callback requested if a field or network action is scheduled."
  },

  topup: { allowance: "20 GB temporary data", durationDays: 14, cost: "No charge while the network investigation is open", reference: "TDT-2026-044912" },

  notifications: [
    { id: "sms1", sender: "Optus", to: "+61 400 ••• 908", sentAt: "14:48",
      body: "Optus: we've raised network investigation NIT-2026-081947 for your nbn service at 18 Kenmore St. Initial assessment within 2 business days. We'll SMS you at each update. No action needed from you." },
    { id: "sms2", sender: "Optus", to: "+61 400 ••• 908", sentAt: "14:50",
      body: "Optus: 20 GB temporary data has been added to your mobile service for 14 days at no charge while we investigate your broadband. Ref TDT-2026-044912." },
    { id: "sms3", sender: "Optus", to: "+61 400 ••• 908", sentAt: "14:57", condition: "offerAdded",
      body: "Optus: your Smart WiFi Booster is confirmed at A$12.00/mo, month to month, cancel any time. Unit posts within 3 business days with setup guidance. Full terms sent to your email." }
  ],

  knowledge: {
    sops: [
      { id: "sop-outage", title: "Area outage verification", body: "Check planned works and unplanned outages against the service address before any premise-level troubleshooting. A cluster threshold of 6 neighbouring reports in 48 hours indicates a probable area fault.", source: "Optus troubleshooting SOP, broadband section" },
      { id: "sop-dropouts", title: "Dropout investigation threshold", body: "More than three dropouts in 24 hours on a fixed-line service warrants a network investigation ticket, even when customer-premise equipment tests healthy.", source: "Ticketing thresholds" },
      { id: "sop-line-quality", title: "Line quality interpretation", body: "An SNR margin below the 9 dB stability floor on FTTN indicates access-line instability upstream of the premises. Do not attribute this to customer equipment or WiFi.", source: "Telemetry interpretation guide" },
      { id: "sop-profile-refresh", title: "Network-side profile refresh", body: "A profile refresh re-pushes the service configuration from the network and clears stale session state. It is not equivalent to a device restart and should be explained to the customer as a distinct action.", source: "Remediation playbook" },
      { id: "sop-topup", title: "Temporary data support eligibility", body: "Customers with an open fixed-line fault and confirmed work-from-home impact are eligible for a 20 GB temporary mobile data allowance for 14 days at no charge.", source: "Goodwill and continuity policy" },
      { id: "sop-booster", title: "WiFi coverage product positioning", body: "Coverage extension products address in-home signal reach only. They must not be positioned as a remedy for access-line faults. Disclose price, term and cancellation before any account change, and capture affirmative consent.", source: "Product eligibility and compliant selling rules" }
    ]
  },

  dataAttributes: [
    { id: "at-id-01", category: "identity", capturedAtStage: 1, label: "Calling number", value: "+61 400 ••• 417", masked: true },
    { id: "at-id-02", category: "identity", capturedAtStage: 1, label: "Customer name", value: "Priya Sharma" },
    { id: "at-id-03", category: "identity", capturedAtStage: 1, label: "Account number", value: "•••••8214", masked: true },
    { id: "at-id-04", category: "identity", capturedAtStage: 1, label: "Six-digit PIN validation status", value: "Validated", masked: true },
    { id: "at-id-05", category: "identity", capturedAtStage: 1, label: "Authentication outcome", value: "Verified — full account access granted" },
    { id: "at-id-06", category: "identity", capturedAtStage: 1, label: "Failed attempt count", value: "0 of 3 allowed" },
    { id: "at-prof-01", category: "profile", capturedAtStage: 1, label: "Tenure", value: "47 months" },
    { id: "at-prof-02", category: "profile", capturedAtStage: 1, label: "Active services", value: "Optus nbn Home Internet, Optus Mobile" },
    { id: "at-prof-03", category: "profile", capturedAtStage: 1, label: "Plan type", value: "Family Entertainer nbn plan" },
    { id: "at-prof-04", category: "profile", capturedAtStage: 1, label: "Home broadband speed tier", value: "nbn 100 / 20 Mbps (FTTN)" },
    { id: "at-prof-05", category: "profile", capturedAtStage: 1, label: "Mobile plan", value: "Optus Choice Plus 60 GB, 48 GB used" },
    { id: "at-prof-06", category: "profile", capturedAtStage: 1, label: "Billing status", value: "Current, no overdue balance" },
    { id: "at-prof-07", category: "profile", capturedAtStage: 1, label: "Service address", value: "18 Kenmore Street, Ashfield NSW 2131" },
    { id: "at-prof-08", category: "profile", capturedAtStage: 1, label: "Consent flags", value: "Marketing: yes · Data use: yes · Call recording: yes" },
    { id: "at-int-01", category: "interaction", capturedAtStage: 1, label: "Intent", value: "Technical support" },
    { id: "at-int-02", category: "interaction", capturedAtStage: 1, label: "Sub-intent", value: "Broadband intermittent dropouts" },
    { id: "at-int-03", category: "interaction", capturedAtStage: 1, label: "Customer sentiment", value: "Frustrated, moving to reassured" },
    { id: "at-int-04", category: "interaction", capturedAtStage: 1, label: "Urgency", value: "High — work-from-home dependency" },
    { id: "at-int-05", category: "interaction", capturedAtStage: 1, label: "Repeat contact indicator", value: "Yes — second contact in 9 days on the same service" },
    { id: "at-int-06", category: "interaction", capturedAtStage: 1, label: "Reason for call", value: "Dropouts during work video calls; hotspot workaround in use" },
    { id: "at-int-07", category: "interaction", capturedAtStage: 4, label: "Preferred communication channel confirmed", value: "SMS updates plus a callback note" },
    { id: "at-tech-01", category: "technical", capturedAtStage: 2, label: "Outage check", value: "No active outage at the service address" },
    { id: "at-tech-02", category: "technical", capturedAtStage: 2, label: "Modem online status", value: "Online, uptime 41 minutes" },
    { id: "at-tech-03", category: "technical", capturedAtStage: 2, label: "Reboot history", value: "3 reboots in 24 hours, 2 manual by the customer" },
    { id: "at-tech-04", category: "technical", capturedAtStage: 2, label: "Dropout history", value: "6 dropouts in 24 hours, longest 4 m 12 s" },
    { id: "at-tech-05", category: "technical", capturedAtStage: 2, label: "Last disconnect timestamp", value: "19 Aug 2026, 1:48 pm" },
    { id: "at-tech-06", category: "technical", capturedAtStage: 2, label: "Line telemetry", value: "SNR margin 5.6–18.0 dB against a 9 dB floor" },
    { id: "at-tech-07", category: "technical", capturedAtStage: 2, label: "Speed-test result", value: "48.6 Mbps down / 17.2 Mbps up" },
    { id: "at-tech-08", category: "technical", capturedAtStage: 2, label: "Connected device count", value: "11 devices" },
    { id: "at-tech-09", category: "technical", capturedAtStage: 2, label: "Profile refresh result", value: "Provisioning mismatch corrected; instability persists" },
    { id: "at-res-01", category: "resolution", capturedAtStage: 2, label: "Steps completed by AI", value: "7 diagnostic and remediation steps" },
    { id: "at-res-02", category: "resolution", capturedAtStage: 2, label: "Temporary data backup eligibility", value: "Eligible — 20 GB for 14 days at no charge" },
    { id: "at-res-03", category: "resolution", capturedAtStage: 2, label: "Probability of root cause", value: "Access-line instability upstream of the premises — 82%" },
    { id: "at-res-04", category: "resolution", capturedAtStage: 2, label: "Confidence score", value: "0.82" },
    { id: "at-res-05", category: "resolution", capturedAtStage: 2, label: "Unresolved issue notes", value: "Line instability persists after the profile refresh" },
    { id: "at-res-06", category: "resolution", capturedAtStage: 2, label: "Escalation reason", value: "Remaining instability requires human-assisted support and ticket creation" },
    { id: "at-res-07", category: "resolution", capturedAtStage: 2, label: "Recommended ticket type", value: "Network investigation — intermittent access-line instability" },
    { id: "at-res-08", category: "resolution", capturedAtStage: 4, label: "Coverage-gap evidence", value: "Customer-confirmed weak WiFi in the back room" },
    { id: "at-res-09", category: "resolution", capturedAtStage: 5, label: "Offer suitability outcome", value: "Eligible on 4 of 4 suitability checks" },
    { id: "at-res-10", category: "resolution", capturedAtStage: 5, label: "Explicit consent capture", value: "Affirmative consent recorded at 14:56" },
    { id: "at-res-11", category: "resolution", capturedAtStage: 5, label: "Journey outcome", value: "Issue actioned, ticket open, top-up applied, booster added" }
  ],

  metrics: {
    scopeNote: "Measured from this single simulated interaction. Not a benchmark and not a projection.",
    groups: [
      { id: "mg-cx", label: "Customer experience", tiles: [
        { id: "m-cx-1", label: "Steps the customer did not repeat", value: "6", basis: "Diagnostics 2 to 7 were carried into the handoff package.", tone: "good" },
        { id: "m-cx-2", label: "Time to authenticate", value: "34 seconds", basis: "Call connected 14:32, identity verified 14:34, two factors.", tone: "good" },
        { id: "m-cx-3", label: "Repeat explanations required", value: "0", basis: "Daniel's opening line restates the AI's work; the customer confirms this at the close.", tone: "good" }
      ]},
      { id: "mg-service", label: "Service performance", tiles: [
        { id: "m-sv-1", label: "First-contact diagnosis", value: "Achieved", basis: "Root cause domain identified at 82% confidence before human involvement.", tone: "good" },
        { id: "m-sv-2", label: "Avoidable transfers avoided", value: "1", basis: "No re-transfer required; the first specialist had full context.", tone: "good" },
        { id: "m-sv-3", label: "Issues resolved without human involvement", value: "1 of 2", basis: "Provisioning mismatch resolved by AI. Line instability remains open under NIT-2026-081947.", tone: "open" }
      ]},
      { id: "mg-productivity", label: "Agent productivity", tiles: [
        { id: "m-pr-1", label: "Agent research time saved", value: "4 m 10 s", basis: "Seven diagnostics and one summary supplied at handoff instead of re-run.", tone: "good" },
        { id: "m-pr-2", label: "Assist prompts used", value: "6", basis: "Recommendation, knowledge, product insight, clarification, next best action, compliance.", tone: "neutral" },
        { id: "m-pr-3", label: "Knowledge lookups avoided", value: "3", basis: "SLA window, top-up policy and product positioning surfaced in the rail.", tone: "good" }
      ]},
      { id: "mg-trust", label: "Trust and risk", tiles: [
        { id: "m-tr-1", label: "Authentication controls passed", value: "3 of 3", basis: "CLI match, name confirmation, six-digit PIN. Profile data stayed locked until all three passed.", tone: "good" },
        { id: "m-tr-2", label: "Consent captured", value: "Yes, affirmative", basis: "Recorded at 14:56 before any account change.", tone: "good" },
        { id: "m-tr-3", label: "Compliance items evidenced", value: "5 of 5", basis: "Terms, optionality, fault separation, written terms, explicit consent.", tone: "good" },
        { id: "m-tr-4", label: "Audit events logged", value: "34", basis: "Every state change recorded with actor, agent and data touched.", tone: "neutral" }
      ]},
      { id: "mg-commercial", label: "Commercial value", tiles: [
        { id: "m-cm-1", label: "Needs-led offers accepted after service resolution", value: "1", basis: "Smart WiFi Booster, A$12.00 per month, month to month.", tone: "good" },
        { id: "m-cm-2", label: "Offers positioned before resolution", value: "0", basis: "The offer control stayed locked until the ticket, the top-up and the customer-confirmed coverage gap were all in place.", tone: "good" }
      ]}
    ],
    workSplit: [
      { stage: "Greeting and authentication", aiUnits: 5, humanUnits: 0 },
      { stage: "Diagnostics", aiUnits: 7, humanUnits: 0 },
      { stage: "Handoff", aiUnits: 2, humanUnits: 1 },
      { stage: "Remediation and ticketing", aiUnits: 3, humanUnits: 4 },
      { stage: "Clarification and assisted sale", aiUnits: 4, humanUnits: 5 }
    ]
  },

  tcsAgents: [
    { id: "cx-orchestration", suiteId: "cx-transformer", usedInDemo: true, fireCount: 4, firedAtStages: [1,4,5], name: "Orchestration Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Captures intent, sequences the diagnostic playbook, and produces next-best-action and compliance guardrail prompts for the human agent.", inputs: ["Customer utterance","Account and service context","Diagnostic results"], outputs: ["Intent and sub-intent","Next best actions","Compliance guardrails"] },
    { id: "cx-validation", suiteId: "cx-transformer", usedInDemo: true, fireCount: 2, firedAtStages: [1,2], name: "Validation Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Validates the six-digit account PIN and checks temporary mobile data top-up eligibility.", inputs: ["Submitted PIN","Service and usage data"], outputs: ["Authentication outcome","Eligibility decision"] },
    { id: "cx-issue-analyser", suiteId: "cx-transformer", usedInDemo: true, fireCount: 4, firedAtStages: [2], name: "Issue Analyser Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Runs the outage check, modem health check, dropout history review and line telemetry analysis.", inputs: ["Service identifier","24-hour telemetry window"], outputs: ["Diagnostic evidence","Threshold breaches"] },
    { id: "cx-remediation", suiteId: "cx-transformer", usedInDemo: true, fireCount: 2, firedAtStages: [2], name: "Remediation Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Performs the network-side service profile refresh that corrects the provisioning mismatch.", inputs: ["Provisioned tier and profile template"], outputs: ["Refresh result","Residual issue statement"] },
    { id: "cx-ticketing", suiteId: "cx-transformer", usedInDemo: true, fireCount: 1, firedAtStages: [4], name: "Ticketing Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Pre-fills and raises the network investigation ticket with the diagnostic evidence attached.", inputs: ["Findings and impact selection"], outputs: ["Ticket reference and SLA window"] },
    { id: "cx-handoff", suiteId: "cx-transformer", usedInDemo: true, fireCount: 1, firedAtStages: [2,4], name: "Hand off Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud", roleInDemo: "Transfers the call to the care specialist with the full context package attached and no loss of state.", inputs: ["Handoff package","Queue and skill routing"], outputs: ["Routed call with context"] },
    { id: "cx-billing", suiteId: "cx-transformer", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Billing Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised in this use case. Handles billing enquiries, adjustments and credits.", inputs: [], outputs: [] },
    { id: "cx-bill-explainer", suiteId: "cx-transformer", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Bill Explainer Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would explain the first bill containing the new booster charge.", inputs: [], outputs: [] },
    { id: "cx-scheduling", suiteId: "cx-transformer", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Scheduling Agent", suite: "CX Transformer for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would book the callback or a technician window if the investigation requires one.", inputs: [], outputs: [] },
    { id: "cca-customer-data", suiteId: "contact-centre", usedInDemo: true, fireCount: 2, firedAtStages: [1], name: "Customer Data Agent", suite: "Contact Centre Assistant", availability: "Available on Google Cloud", roleInDemo: "Resolves the account from the calling number and retrieves the Customer 360 profile only after authentication passes.", inputs: ["Calling line identity","Authentication state"], outputs: ["Account match","Customer 360 profile"] },
    { id: "cca-knowledgebase", suiteId: "contact-centre", usedInDemo: true, fireCount: 3, firedAtStages: [4,5], name: "Knowledgebase Assist Agent", suite: "Contact Centre Assistant", availability: "Available on Google Cloud", roleInDemo: "Retrieves the SLA guidance, the top-up policy and the product positioning rules that keep the agent accurate.", inputs: ["Conversation context","SOP corpus"], outputs: ["Grounded knowledge prompts"] },
    { id: "cca-summary", suiteId: "contact-centre", usedInDemo: true, fireCount: 1, firedAtStages: [2], name: "Summary Agent", suite: "Contact Centre Assistant", availability: "Available on Google Cloud", roleInDemo: "Generates the eight-row handoff package from accumulated interaction state, not from a template.", inputs: ["Full interaction state"], outputs: ["Handoff summary","Escalation reason"] },
    { id: "cca-sentiment", suiteId: "contact-centre", usedInDemo: true, fireCount: 3, firedAtStages: [1,2,5], name: "Sentiment Agent", suite: "Contact Centre Assistant", availability: "Available on Google Cloud", roleInDemo: "Scores sentiment at each customer turn and records the shift from frustrated to satisfied.", inputs: ["Customer utterances"], outputs: ["Sentiment level and trend"] },
    { id: "cca-email", suiteId: "contact-centre", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Email Agent", suite: "Contact Centre Assistant", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would issue the written terms email that follows the SMS confirmation.", inputs: [], outputs: [] },
    { id: "ano-monitoring", suiteId: "auto-network", usedInDemo: true, fireCount: 1, firedAtStages: [2], name: "Monitoring Agent", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud", roleInDemo: "Supplies the 24-hour line telemetry window and flags the SNR margin excursions below the stability floor.", inputs: ["Access-line counters"], outputs: ["Telemetry series and anomaly flags"] },
    { id: "ano-analysis", suiteId: "auto-network", usedInDemo: true, fireCount: 1, firedAtStages: [2], name: "Analysis Agent", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud", roleInDemo: "Attributes the fault domain to the access line upstream of the premises with an 82% confidence score.", inputs: ["Telemetry series","Premise equipment health"], outputs: ["Root-cause domain and confidence"] },
    { id: "ano-orchestration", suiteId: "auto-network", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Orchestration Agent (network)", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would coordinate an autonomous network-side fix once the investigation isolates the fault.", inputs: [], outputs: [] },
    { id: "ano-ticketing", suiteId: "auto-network", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Ticketing Agent (network)", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would raise the downstream network work order from the investigation ticket.", inputs: [], outputs: [] },
    { id: "ano-remediation", suiteId: "auto-network", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Remediation Agent (network)", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would apply the network-side correction once the fault is isolated.", inputs: [], outputs: [] },
    { id: "ano-rollback", suiteId: "auto-network", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Rollback Agent", suite: "Autonomous Network Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would revert a network change that degrades service.", inputs: [], outputs: [] },
    { id: "ifo-job-analysis", suiteId: "field-ops", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Job Analysis Agent", suite: "Intelligent Field Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Becomes relevant if the investigation results in a truck roll.", inputs: [], outputs: [] },
    { id: "ifo-job-scheduling", suiteId: "field-ops", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Job Scheduling Agent", suite: "Intelligent Field Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would schedule the technician against the customer's stated availability.", inputs: [], outputs: [] },
    { id: "ifo-field-assistance", suiteId: "field-ops", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Field Assistance Agent", suite: "Intelligent Field Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would give the technician the same diagnostic package the agent received.", inputs: [], outputs: [] },
    { id: "ifo-job-closure", suiteId: "field-ops", usedInDemo: false, fireCount: 0, firedAtStages: [], name: "Job Closure Agent", suite: "Intelligent Field Operations Services for Telcos", availability: "Available on Google Cloud, not used in this demo", roleInDemo: "Not exercised. Would close the loop between the field fix and the customer notification.", inputs: [], outputs: [] }
  ],

  auditLog: [
    { seq: 1, at: "14:32:04", actor: "system", event: "Voice call connected to virtual care assistant" },
    { seq: 2, at: "14:32:06", actor: "ai", agentId: "cca-customer-data", event: "Calling line identity matched to a single account" },
    { seq: 3, at: "14:32:12", actor: "ai", agentId: "cx-orchestration", event: "Intent captured: technical support, broadband dropouts" },
    { seq: 4, at: "14:32:13", actor: "ai", agentId: "cca-sentiment", event: "Sentiment scored: frustrated, urgency high" },
    { seq: 5, at: "14:32:40", actor: "customer", event: "Full name confirmed by the customer" },
    { seq: 6, at: "14:33:52", actor: "customer", event: "Six-digit account PIN submitted" },
    { seq: 7, at: "14:33:54", actor: "ai", agentId: "cx-validation", event: "PIN validated, authentication successful" },
    { seq: 8, at: "14:34:00", actor: "ai", agentId: "cca-customer-data", event: "Customer 360 profile unlocked after authentication" },
    { seq: 9, at: "14:35:02", actor: "ai", agentId: "cca-customer-data", event: "Diagnostic 1 complete: CLI account match" },
    { seq: 10, at: "14:35:05", actor: "ai", agentId: "cx-issue-analyser", event: "Diagnostic 2 complete: no active area outage" },
    { seq: 11, at: "14:35:07", actor: "ai", agentId: "cx-issue-analyser", event: "Diagnostic 3 complete: modem online and healthy" },
    { seq: 12, at: "14:35:10", actor: "ai", agentId: "cx-issue-analyser", event: "Diagnostic 4 attention: 6 dropouts in 24 hours, threshold exceeded" },
    { seq: 13, at: "14:35:14", actor: "ai", agentId: "ano-monitoring", event: "Telemetry window retrieved, 24 hourly samples" },
    { seq: 14, at: "14:36:20", actor: "ai", agentId: "cx-issue-analyser", event: "Diagnostic 5 fault: SNR margin below stability floor on 6 occasions" },
    { seq: 15, at: "14:36:24", actor: "ai", agentId: "ano-analysis", event: "Fault domain attributed to access line upstream, confidence 0.82" },
    { seq: 16, at: "14:37:10", actor: "ai", agentId: "cx-issue-analyser", event: "Speed test recorded: 48.6 down / 17.2 up against a 100 / 20 tier" },
    { seq: 17, at: "14:38:02", actor: "ai", agentId: "cx-remediation", event: "Diagnostic 6 complete: network-side profile refresh, provisioning mismatch corrected" },
    { seq: 18, at: "14:38:30", actor: "ai", agentId: "cca-sentiment", event: "Sentiment updated: reassured after remediation explanation" },
    { seq: 19, at: "14:39:40", actor: "ai", agentId: "cx-validation", event: "Diagnostic 7 complete: 20 GB temporary top-up eligibility confirmed" },
    { seq: 20, at: "14:40:00", actor: "ai", agentId: "cca-summary", event: "Handoff package generated from interaction state" },
    { seq: 21, at: "14:40:12", actor: "ai", agentId: "cx-orchestration", event: "Product insight raised with a conditional guardrail attached" },
    { seq: 22, at: "14:41:00", actor: "ai", agentId: "cx-handoff", event: "Call transferred to care specialist with full context" },
    { seq: 23, at: "14:41:20", actor: "human", event: "Specialist opened the AI summary before speaking" },
    { seq: 24, at: "14:42:30", actor: "ai", agentId: "cx-orchestration", event: "Next-best-action queue presented to the agent" },
    { seq: 25, at: "14:47:00", actor: "human", agentId: "cx-ticketing", event: "Network investigation ticket NIT-2026-081947 created, P2" },
    { seq: 26, at: "14:48:00", actor: "system", event: "SMS 1 sent: ticket confirmation" },
    { seq: 27, at: "14:49:00", actor: "human", event: "Temporary 20 GB data support applied, ref TDT-2026-044912" },
    { seq: 28, at: "14:50:00", actor: "system", event: "SMS 2 sent: temporary data support confirmation" },
    { seq: 29, at: "14:51:30", actor: "customer", event: "Customer confirmed an in-home coverage gap in the back room" },
    { seq: 30, at: "14:51:34", actor: "ai", agentId: "cx-orchestration", event: "Offer gate satisfied: ticket raised, support applied, coverage gap confirmed" },
    { seq: 31, at: "14:53:00", actor: "ai", agentId: "cca-knowledgebase", event: "Product positioning rules retrieved: coverage extension only" },
    { seq: 32, at: "14:55:10", actor: "human", event: "All five compliance items evidenced before any account change" },
    { seq: 33, at: "14:56:00", actor: "customer", event: "Affirmative consent captured for the Smart WiFi Booster" },
    { seq: 34, at: "14:58:00", actor: "system", event: "Interaction wrapped. Network investigation remains open." }
  ]
};
