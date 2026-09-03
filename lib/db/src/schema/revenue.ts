import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("operator"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchantsTable = pgTable("merchants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("INR"),
  recoveryPolicy: jsonb("recovery_policy").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customersTable = pgTable("customers", {
  id: text("id").primaryKey(),
  merchantId: text("merchant_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  segment: text("segment").notNull(),
  lifetimeValue: numeric("lifetime_value", { precision: 14, scale: 2 }).notNull(),
  totalPayments: integer("total_payments").notNull().default(0),
  successfulPayments: integer("successful_payments").notNull().default(0),
  failedPayments: integer("failed_payments").notNull().default(0),
  previousRecoveryRate: numeric("previous_recovery_rate", { precision: 5, scale: 4 }).notNull().default("0"),
  preferredMethod: text("preferred_method").notNull(),
  preferredTime: text("preferred_time"),
  riskLevel: text("risk_level").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  merchantId: text("merchant_id").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull(),
  failureReason: text("failure_reason"),
  paymentMethod: text("payment_method").notNull(),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const recoveryCasesTable = pgTable("recovery_cases", {
  id: text("id").primaryKey(),
  paymentId: text("payment_id").notNull(),
  customerId: text("customer_id").notNull(),
  recoveryScore: integer("recovery_score").notNull(),
  recoveryProbability: numeric("recovery_probability", { precision: 5, scale: 4 }).notNull(),
  strategy: text("strategy").notNull(),
  status: text("status").notNull(),
  recommendedTime: text("recommended_time"),
  riskLevel: text("risk_level").notNull(),
  requiresApproval: boolean("requires_approval").notNull().default(false),
  approvalStatus: text("approval_status"),
  outcome: text("outcome"),
  reasoning: text("reasoning"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agentActionsTable = pgTable("agent_actions", {
  id: text("id").primaryKey(),
  recoveryCaseId: text("recovery_case_id").notNull(),
  agentName: text("agent_name").notNull(),
  action: text("action").notNull(),
  reasoning: text("reasoning"),
  confidence: numeric("confidence", { precision: 5, scale: 4 }),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const recoveryOutcomesTable = pgTable("recovery_outcomes", {
  id: text("id").primaryKey(),
  recoveryCaseId: text("recovery_case_id").notNull(),
  status: text("status").notNull(),
  recoveredAmount: numeric("recovered_amount", { precision: 14, scale: 2 }),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const humanApprovalsTable = pgTable("human_approvals", {
  id: text("id").primaryKey(),
  recoveryCaseId: text("recovery_case_id").notNull(),
  action: text("action").notNull(),
  status: text("status").notNull(),
  approvedBy: text("approved_by"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id"),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true });
export const insertMerchantSchema = createInsertSchema(merchantsTable).omit({ createdAt: true });
export const insertCustomerSchema = createInsertSchema(customersTable).omit({ createdAt: true });
export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ createdAt: true });
export const insertRecoveryCaseSchema = createInsertSchema(recoveryCasesTable).omit({ createdAt: true, updatedAt: true });
export const insertAgentActionSchema = createInsertSchema(agentActionsTable).omit({ createdAt: true });
export const insertRecoveryOutcomeSchema = createInsertSchema(recoveryOutcomesTable).omit({ createdAt: true });
export const insertHumanApprovalSchema = createInsertSchema(humanApprovalsTable).omit({ createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({ createdAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Merchant = typeof merchantsTable.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;
export type Customer = typeof customersTable.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type RecoveryCase = typeof recoveryCasesTable.$inferSelect;
export type InsertRecoveryCase = z.infer<typeof insertRecoveryCaseSchema>;
export type AgentAction = typeof agentActionsTable.$inferSelect;
export type InsertAgentAction = z.infer<typeof insertAgentActionSchema>;
export type RecoveryOutcome = typeof recoveryOutcomesTable.$inferSelect;
export type InsertRecoveryOutcome = z.infer<typeof insertRecoveryOutcomeSchema>;
export type HumanApproval = typeof humanApprovalsTable.$inferSelect;
export type InsertHumanApproval = z.infer<typeof insertHumanApprovalSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;