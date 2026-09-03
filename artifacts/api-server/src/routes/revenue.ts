import { Router, type IRouter } from "express";
import {
  Analytics,
  DashboardMetrics,
  GetAgentsStatusResponse,
  GetAnalyticsResponse,
  GetCustomersResponse,
  GetDashboardActivityResponse,
  GetDashboardStrategiesResponse,
  GetDashboardMetricsResponse,
  GetPaymentsResponse,
  GetRecoveriesResponse,
  GetRecoveryResponse,
  RecoveryCase,
  SimulatePaymentFailureBody,
} from "@workspace/api-zod";
import type {
  ActivityItem,
  AgentStatus,
  Customer,
  Payment,
  StrategyPerformance,
} from "@workspace/api-zod";

const router: IRouter = Router();

const now = Date.now();
const minutesAgo = (minutes: number) =>
  new Date(now - minutes * 60_000).toISOString();

const customerSeed: Customer[] = [
  {
    id: "CUS_001",
    name: "Aarav Mehta",
    email: "aarav@northstar.co",
    segment: "High value",
    lifetimeValue: 248000,
    totalPayments: 42,
    successfulPayments: 39,
    failedPayments: 3,
    previousRecoveryRate: 0.86,
    preferredMethod: "UPI",
    preferredTime: "19:30",
    riskLevel: "Low",
  },
  {
    id: "CUS_002",
    name: "Maya Iyer",
    email: "maya@orbitstudio.in",
    segment: "Growing",
    lifetimeValue: 98000,
    totalPayments: 18,
    successfulPayments: 15,
    failedPayments: 3,
    previousRecoveryRate: 0.67,
    preferredMethod: "Card",
    preferredTime: "09:00",
    riskLevel: "Medium",
  },
  {
    id: "CUS_003",
    name: "Kabir Shah",
    email: "kabir@atlaslabs.dev",
    segment: "High value",
    lifetimeValue: 186000,
    totalPayments: 31,
    successfulPayments: 29,
    failedPayments: 2,
    previousRecoveryRate: 0.92,
    preferredMethod: "Card",
    preferredTime: "14:00",
    riskLevel: "Low",
  },
  {
    id: "CUS_004",
    name: "Nisha Kapoor",
    email: "nisha@tulipcommerce.com",
    segment: "At risk",
    lifetimeValue: 52000,
    totalPayments: 12,
    successfulPayments: 8,
    failedPayments: 4,
    previousRecoveryRate: 0.42,
    preferredMethod: "Netbanking",
    preferredTime: "11:30",
    riskLevel: "High",
  },
];

const baseCases: RecoveryCase[] = [
  makeCase({
    id: "RCV_1042",
    paymentId: "PAY_8842",
    customerId: "CUS_001",
    customerName: "Aarav Mehta",
    amount: 50000,
    failureReason: "Insufficient funds",
    paymentMethod: "UPI",
    score: 91,
    probability: 0.89,
    risk: "Low",
    strategy: "Retry later",
    time: "19:30 today",
    status: "RECOVERING",
    requiresApproval: false,
    createdAt: minutesAgo(12),
    reasoning:
      "Strong payment history and a consistent evening payment pattern. A smart retry at 19:30 gives this case the highest predicted success.",
  }),
  makeCase({
    id: "RCV_1041",
    paymentId: "PAY_8841",
    customerId: "CUS_002",
    customerName: "Maya Iyer",
    amount: 18500,
    failureReason: "Card declined",
    paymentMethod: "Card",
    score: 74,
    probability: 0.68,
    risk: "Medium",
    strategy: "Send payment link",
    time: "Now",
    status: "ACTION_PENDING",
    requiresApproval: false,
    createdAt: minutesAgo(38),
    reasoning:
      "Recent card decline with a healthy fallback history. Sending a hosted payment link avoids another immediate decline.",
  }),
  makeCase({
    id: "RCV_1039",
    paymentId: "PAY_8839",
    customerId: "CUS_004",
    customerName: "Nisha Kapoor",
    amount: 72000,
    failureReason: "Subscription renewal failed",
    paymentMethod: "Netbanking",
    score: 58,
    probability: 0.47,
    risk: "High",
    strategy: "Offer discount",
    time: "Approval required",
    status: "ESCALATED",
    requiresApproval: true,
    approvalStatus: "pending",
    createdAt: minutesAgo(94),
    reasoning:
      "High churn risk and four failed payments in the last quarter. A targeted 15% save offer is recommended, pending approval.",
  }),
  makeCase({
    id: "RCV_1037",
    paymentId: "PAY_8837",
    customerId: "CUS_003",
    customerName: "Kabir Shah",
    amount: 128000,
    failureReason: "Expired payment method",
    paymentMethod: "Card",
    score: 83,
    probability: 0.81,
    risk: "Low",
    strategy: "Send email",
    time: "Now",
    status: "RECOVERED",
    requiresApproval: false,
    outcome: "Recovered in 4h 12m",
    createdAt: minutesAgo(155),
    reasoning:
      "Customer has a 94% successful payment rate. A payment-method update email recovered the invoice before the grace period ended.",
  }),
  makeCase({
    id: "RCV_1035",
    paymentId: "PAY_8835",
    customerId: "CUS_002",
    customerName: "Maya Iyer",
    amount: 9400,
    failureReason: "Network error",
    paymentMethod: "UPI",
    score: 66,
    probability: 0.61,
    risk: "Medium",
    strategy: "Retry now",
    time: "Executed",
    status: "FAILED",
    requiresApproval: false,
    outcome: "Retry exhausted",
    createdAt: minutesAgo(218),
    reasoning:
      "Transient errors usually clear quickly, but repeated network responses lowered confidence after two retries.",
  }),
];

let cases = [...baseCases];
let activity: ActivityItem[] = [
  {
    id: "ACT_01",
    title: "Payment recovered",
    description: "₹1,28,000 recovered from Kabir Shah",
    type: "success",
    createdAt: minutesAgo(4),
    caseId: "RCV_1037",
  },
  {
    id: "ACT_02",
    title: "Smart retry scheduled",
    description: "RCV_1042 queued for 19:30 today",
    type: "schedule",
    createdAt: minutesAgo(10),
    caseId: "RCV_1042",
  },
  {
    id: "ACT_03",
    title: "Approval requested",
    description: "15% save offer needs your review",
    type: "approval",
    createdAt: minutesAgo(58),
    caseId: "RCV_1039",
  },
  {
    id: "ACT_04",
    title: "Customer intelligence updated",
    description: "Maya Iyer moved to medium risk",
    type: "insight",
    createdAt: minutesAgo(86),
    caseId: "RCV_1041",
  },
];

function makeCase(input: {
  id: string;
  paymentId: string;
  customerId: string;
  customerName: string;
  amount: number;
  failureReason: string;
  paymentMethod: string;
  score: number;
  probability: number;
  risk: string;
  strategy: string;
  time: string;
  status: string;
  requiresApproval: boolean;
  createdAt: string;
  approvalStatus?: string;
  outcome?: string;
  reasoning: string;
}): RecoveryCase {
  return {
    id: input.id,
    paymentId: input.paymentId,
    customerId: input.customerId,
    customerName: input.customerName,
    amount: input.amount,
    currency: "INR",
    failureReason: input.failureReason,
    paymentMethod: input.paymentMethod,
    retryCount: input.status === "FAILED" ? 3 : 1,
    recoveryScore: input.score,
    recoveryProbability: input.probability,
    riskLevel: input.risk,
    strategy: input.strategy,
    recommendedTime: input.time,
    status: input.status,
    reasoning: input.reasoning,
    createdAt: input.createdAt,
    requiresApproval: input.requiresApproval,
    approvalStatus: input.approvalStatus ?? null,
    outcome: input.outcome ?? null,
    timeline: [
      {
        id: `${input.id}_01`,
        label: "Payment failed",
        detail: `${input.failureReason} · ${input.paymentMethod}`,
        timestamp: input.createdAt,
        completed: true,
      },
      {
        id: `${input.id}_02`,
        label: "AI detected failure",
        detail: "Failure Analysis Agent classified the event",
        timestamp: input.createdAt,
        completed: true,
      },
      {
        id: `${input.id}_03`,
        label: "Recovery score generated",
        detail: `${input.score}/100 · ${Math.round(input.probability * 100)}% probability`,
        timestamp: new Date(new Date(input.createdAt).getTime() + 60_000).toISOString(),
        completed: true,
      },
      {
        id: `${input.id}_04`,
        label: "Strategy selected",
        detail: input.strategy,
        timestamp: new Date(new Date(input.createdAt).getTime() + 120_000).toISOString(),
        completed: true,
      },
      {
        id: `${input.id}_05`,
        label: input.status === "RECOVERED" ? "Payment recovered" : "Action execution",
        detail:
          input.status === "RECOVERED"
            ? input.outcome ?? "Recovery confirmed"
            : input.status === "ESCALATED"
              ? "Waiting for human approval"
              : `${input.strategy} · ${input.time}`,
        timestamp: new Date(new Date(input.createdAt).getTime() + 300_000).toISOString(),
        completed: input.status !== "ACTION_PENDING",
      },
    ],
    insights: [
      {
        agent: "Failure Analysis Agent",
        status: "complete",
        summary: `${input.failureReason} is ${input.risk === "Low" ? "highly recoverable" : "recoverable with a targeted intervention"}.`,
        confidence: Math.min(0.98, input.probability + 0.07),
      },
      {
        agent: "Customer Intelligence Agent",
        status: "complete",
        summary:
          input.risk === "Low"
            ? "Reliable customer with strong lifetime value and repeat behavior."
            : "Customer needs a lower-friction recovery path to reduce churn risk.",
        confidence: 0.91,
      },
      {
        agent: "ML Prediction Engine",
        status: "complete",
        summary: `Predicted ${Math.round(input.probability * 100)}% recovery probability from payment and behavior signals.`,
        confidence: 0.87,
      },
      {
        agent: "Recovery Decision Agent",
        status: input.requiresApproval ? "approval required" : "complete",
        summary: input.reasoning,
        confidence: input.probability,
      },
    ],
  };
}

function paymentFromCase(item: RecoveryCase): Payment {
  return {
    id: item.paymentId,
    customerId: item.customerId,
    customerName: item.customerName,
    amount: item.amount,
    currency: item.currency,
    status: item.outcome?.startsWith("Recovered") ? "recovered" : "failed",
    failureReason: item.failureReason,
    paymentMethod: item.paymentMethod,
    retryCount: item.retryCount,
    createdAt: item.createdAt,
  };
}

function metrics(): DashboardMetrics {
  const failedRevenue = 1_000_000 + cases.reduce((sum, item) => sum + item.amount, 0);
  const recoveredRevenue =
    620_000 +
    cases
      .filter((item) => item.status === "RECOVERED")
      .reduce((sum, item) => sum + item.amount, 0);
  const revenueAtRisk = Math.max(0, failedRevenue - recoveredRevenue);
  return {
    failedRevenue,
    recoveredRevenue,
    recoveryRate: recoveredRevenue / failedRevenue,
    revenueAtRisk,
    activeCases: cases.filter((item) =>
      ["ANALYZING", "ACTION_PENDING", "RECOVERING", "ESCALATED"].includes(item.status),
    ).length,
    recoveredThisMonth: recoveredRevenue,
    additionalRevenue: 270_000 + Math.round(recoveredRevenue * 0.08),
  };
}

router.get("/dashboard/metrics", (_req, res) => {
  res.json(GetDashboardMetricsResponse.parse(metrics()));
});

router.get("/dashboard/activity", (_req, res) => {
  res.json(GetDashboardActivityResponse.parse(activity));
});

router.get("/dashboard/strategies", (_req, res) => {
  const data: StrategyPerformance[] = [
    { strategy: "Retry later", attempts: 38, recovered: 31, successRate: 0.82, revenue: 412000 },
    { strategy: "Payment link", attempts: 27, recovered: 19, successRate: 0.7, revenue: 188000 },
    { strategy: "Email", attempts: 22, recovered: 15, successRate: 0.68, revenue: 142000 },
    { strategy: "Retry now", attempts: 19, recovered: 10, successRate: 0.53, revenue: 76000 },
  ];
  res.json(GetDashboardStrategiesResponse.parse(data));
});

router.get("/payments", (_req, res) => {
  res.json(GetPaymentsResponse.parse(cases.map(paymentFromCase)));
});

router.get("/customers", (_req, res) => {
  res.json(GetCustomersResponse.parse(customerSeed));
});

router.get("/recoveries", (_req, res) => {
  res.json(GetRecoveriesResponse.parse(cases));
});

router.get("/recoveries/:id", (req, res) => {
  const item = cases.find((candidate) => candidate.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Recovery case not found" });
    return;
  }
  res.json(GetRecoveryResponse.parse(item));
});

router.post("/payments/simulate-failure", (req, res) => {
  const parsed = SimulatePaymentFailureBody.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid simulation input" });
    return;
  }
  const input = parsed.data;
  const amount = input.amount ?? 50000;
  const paymentMethod = input.paymentMethod ?? "UPI";
  const reason = input.failureReason ?? "Insufficient funds";
  const serial = 1043 + cases.length;
  const customer = customerSeed[0];
  const createdAt = new Date().toISOString();
  const score = paymentMethod === "UPI" ? 91 : 84;
  const item = makeCase({
    id: `RCV_${serial}`,
    paymentId: `PAY_${8842 + cases.length}`,
    customerId: customer.id,
    customerName: customer.name,
    amount,
    failureReason: reason,
    paymentMethod,
    score,
    probability: score / 100,
    risk: "Low",
    strategy: "Retry later",
    time: customer.preferredTime ?? "19:30 today",
    status: "RECOVERING",
    requiresApproval: false,
    createdAt,
    reasoning:
      "Simulation complete. The customer has a reliable payment history, so the agent selected their most successful payment window for a smart retry.",
  });
  cases = [item, ...cases];
  activity = [
    {
      id: `ACT_${Date.now()}`,
      title: "Recovery case created",
      description: `₹${amount.toLocaleString("en-IN")} payment failure analyzed`,
      type: "analysis",
      createdAt,
      caseId: item.id,
    },
    ...activity,
  ];
  setTimeout(() => {
    const current = cases.find((candidate) => candidate.id === item.id);
    if (!current || current.status !== "RECOVERING") return;
    current.status = "RECOVERED";
    current.outcome = "Recovered just now";
    current.timeline = current.timeline.map((event) =>
      event.id.endsWith("_05")
        ? { ...event, label: "Payment recovered", detail: "Smart retry succeeded", completed: true }
        : event,
    );
    activity = [
      {
        id: `ACT_${Date.now()}_success`,
        title: "Payment recovered",
        description: `₹${amount.toLocaleString("en-IN")} recovered from ${customer.name}`,
        type: "success",
        createdAt: new Date().toISOString(),
        caseId: item.id,
      },
      ...activity,
    ];
  }, 3500);
  res.status(201).json(item);
});

router.post("/recoveries/:id/analyze", (req, res) => {
  const item = cases.find((candidate) => candidate.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Recovery case not found" });
    return;
  }
  item.status = item.requiresApproval ? "ESCALATED" : "ACTION_PENDING";
  item.timeline = item.timeline.map((event) => ({ ...event, completed: true }));
  res.json(item);
});

router.post("/recoveries/:id/approve", (req, res) => {
  const item = cases.find((candidate) => candidate.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Recovery case not found" });
    return;
  }
  item.approvalStatus = req.body?.decision === "reject" ? "rejected" : "approved";
  item.status = req.body?.decision === "reject" ? "FAILED" : "ACTION_PENDING";
  item.requiresApproval = false;
  activity = [
    {
      id: `ACT_${Date.now()}`,
      title: req.body?.decision === "reject" ? "Action rejected" : "Action approved",
      description: `${item.strategy} for ${item.customerName}`,
      type: req.body?.decision === "reject" ? "warning" : "approval",
      createdAt: new Date().toISOString(),
      caseId: item.id,
    },
    ...activity,
  ];
  res.json(item);
});

router.post("/recoveries/:id/reject", (req, res) => {
  const item = cases.find((candidate) => candidate.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Recovery case not found" });
    return;
  }
  item.approvalStatus = "rejected";
  item.status = "FAILED";
  item.requiresApproval = false;
  res.json(item);
});

router.post("/recoveries/:id/execute", (req, res) => {
  const item = cases.find((candidate) => candidate.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Recovery case not found" });
    return;
  }
  item.status = "RECOVERED";
  item.outcome = "Recovered just now";
  item.timeline = item.timeline.map((event) =>
    event.id.endsWith("_05")
      ? { ...event, label: "Payment recovered", detail: "Action executed successfully", completed: true }
      : event,
  );
  activity = [
    {
      id: `ACT_${Date.now()}`,
      title: "Payment recovered",
      description: `₹${item.amount.toLocaleString("en-IN")} recovered from ${item.customerName}`,
      type: "success",
      createdAt: new Date().toISOString(),
      caseId: item.id,
    },
    ...activity,
  ];
  res.json(item);
});

router.get("/analytics", (_req, res) => {
  const data: Analytics = {
    trend: [
      { label: "Apr 01", failed: 980000, recovered: 560000, rate: 0.57 },
      { label: "Apr 08", failed: 1040000, recovered: 626000, rate: 0.6 },
      { label: "Apr 15", failed: 1110000, recovered: 732000, rate: 0.66 },
      { label: "Apr 22", failed: 1080000, recovered: 745000, rate: 0.69 },
      { label: "Apr 29", failed: 1170000, recovered: 842000, rate: 0.72 },
      { label: "May 06", failed: 1250000, recovered: 930000, rate: 0.74 },
    ],
    failureReasons: [
      { label: "Insufficient funds", value: 39, amount: 480000 },
      { label: "Card declined", value: 24, amount: 302000 },
      { label: "Expired method", value: 18, amount: 224000 },
      { label: "Network error", value: 11, amount: 138000 },
      { label: "Other", value: 8, amount: 98000 },
    ],
    paymentMethods: [
      { label: "UPI", value: 46, amount: 574000 },
      { label: "Card", value: 34, amount: 424000 },
      { label: "Netbanking", value: 12, amount: 150000 },
      { label: "Wallet", value: 8, amount: 94000 },
    ],
    comparison: { traditional: 35, ai: 62, additionalRevenue: 344000 },
  };
  res.json(GetAnalyticsResponse.parse(data));
});

router.get("/agents/status", (_req, res) => {
  const data: AgentStatus = {
    overall: "operational",
    updatedAt: new Date().toISOString(),
    agents: [
      { id: "failure", name: "Failure Analysis", role: "Classifies decline signals", status: "active", confidence: 0.96, processed: 1284 },
      { id: "customer", name: "Customer Intelligence", role: "Understands payment behavior", status: "active", confidence: 0.91, processed: 1284 },
      { id: "ml", name: "ML Prediction Engine", role: "Predicts recovery probability", status: "active", confidence: 0.87, processed: 1284 },
      { id: "decision", name: "Recovery Decision", role: "Selects the next best action", status: "active", confidence: 0.93, processed: 1284 },
      { id: "execution", name: "Action Execution", role: "Runs approved recovery actions", status: "active", confidence: 0.98, processed: 987 },
    ],
  };
  res.json(GetAgentsStatusResponse.parse(data));
});

export default router;