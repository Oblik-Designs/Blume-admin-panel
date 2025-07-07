export const DISPUTE_TYPES = {
    PLAN_NOT_HAPPENED: {
        key: "plan_not_happened",
        label: "Plan Did Not Happen",
        description: "The planned activity did not occur as scheduled",
        severity: "high",
        color: "red",
    },
    HOST_ISSUES: {
        key: "host_issues",
        label: "Host Issues",
        description: "Problems with the host behavior or service",
        severity: "medium",
        color: "orange",
    },
    JOINER_ISSUES: {
        key: "joiner_issues",
        label: "Joiner Issues",
        description: "Problems with participant behavior",
        severity: "medium",
        color: "orange",
    },
    PAYMENT_PROBLEMS: {
        key: "payment_problems",
        label: "Payment Problems",
        description: "Issues with BlumePoints transactions",
        severity: "high",
        color: "red",
    },
    FALSE_ADVERTISING: {
        key: "false_advertising",
        label: "False Advertising",
        description: "Plan description did not match reality",
        severity: "medium",
        color: "orange",
    },
    SAFETY_CONCERNS: {
        key: "safety_concerns",
        label: "Safety Concerns",
        description: "Safety or security issues during the plan",
        severity: "critical",
        color: "purple",
    },
};
export const DISPUTE_STATUS_OPTIONS = [
    { value: "open", label: "Open", color: "red" },
    { value: "investigating", label: "Investigating", color: "orange" },
    { value: "awaiting_response", label: "Awaiting Response", color: "blue" },
    { value: "resolved", label: "Resolved", color: "green" },
    { value: "closed", label: "Closed", color: "default" },
    { value: "escalated", label: "Escalated", color: "purple" },
];
export const DISPUTE_RESOLUTION_ACTIONS = {
    FULL_REFUND: {
        key: "full_refund",
        label: "Full Refund",
        description: "Refund all BlumePoints to the participant",
    },
    PARTIAL_REFUND: {
        key: "partial_refund",
        label: "Partial Refund",
        description: "Refund partial BlumePoints to the participant",
    },
    HOST_PENALTY: {
        key: "host_penalty",
        label: "Host Penalty",
        description: "Apply penalty to the host account",
    },
    WARNING: {
        key: "warning",
        label: "Warning",
        description: "Issue a warning to the involved party",
    },
    NO_ACTION: {
        key: "no_action",
        label: "No Action",
        description: "Close dispute without any action",
    },
    ESCALATE: {
        key: "escalate",
        label: "Escalate",
        description: "Escalate to senior admin",
    },
};
