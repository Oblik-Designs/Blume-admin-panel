export const PLAN_TYPES = {
    1: {
        label: "Host Pays Joiners",
        color: "purple",
        description: "Host compensates participants",
    },
    2: {
        label: "Joiners Pay Host",
        color: "blue",
        description: "Participants pay for experience",
    },
    3: {
        label: "Bidding Plan",
        color: "gold",
        description: "Users bid for exclusive spots",
    },
};

export const PLAN_STATUS_OPTIONS = [
    { value: "draft", label: "Draft", color: "default" },
    { value: "published", label: "Published", color: "blue" },
    { value: "applications_open", label: "Applications Open", color: "green" },
    {
        value: "applications_closed",
        label: "Applications Closed",
        color: "orange",
    },
    { value: "active", label: "Active", color: "processing" },
    { value: "completed", label: "Completed", color: "success" },
    { value: "cancelled", label: "Cancelled", color: "error" },
];
