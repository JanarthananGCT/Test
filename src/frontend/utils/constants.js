export const PAGES = {
  UNAUTHORIZED: { page: "Unauthorized", id: 1 },
  NO_MAPPINGS: { page: "authorized but no mappings", id: 2 },
  DASHBOARD: { page: "authorized and mappings", id: 3 },
  NEW_MAPPING: { page: "authorized new mapping", id: 4 },
  NEW_TRIGGER: { page: "authorized new trigger", id: 5 },
  LOADING: { page: "Loading", id: 6 }
};

export const TICKET_TYPES = [
  { value: "Bug", label: "Bug" },
  { value: "Task", label: "Task" },
  { value: "Epic", label: "Epic" },
  { value: "Story", label: "Story" }
];

export const SHARE_TYPES = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "LINK", label: "Link" }
];

export const JIRA_EVENTS = [
  { value: "issue_created", label: "Issue Created" },
  { value: "issue_updated", label: "Issue Updated" },
  { value: "issue_deleted", label: "Issue Deleted" },
  // ... other events
];

export const JIRA_FIELDS = [
  { value: "summary", label: "Summary", isRequired: true },
  { value: "description", label: "Description", isRequired: true },
  { value: "priority", label: "Priority" },
  { value: "labels", label: "Labels" },
  { value: "environment", label: "Environment" },
  { value: "duedate", label: "Due Date" }
];
