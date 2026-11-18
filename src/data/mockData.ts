export type Stage = "Discover" | "Assess" | "Migrate" | "Validate" | "Modernize";
export type Validation =
  | "Validated"
  | "In progress"
  | "Failed checks"
  | "Blocked"
  | "Not started"
  | "Not run"
  | "Awaiting approval"
  | "Retired";
export type Decision = "Migrate" | "Rebuild" | "Retire";

export type Asset = {
  id: string;
  name: string;
  type: "Dashboard" | "Report" | "Data model" | "Script";
  source: string;
  owner: string;
  initials: string;
  views: number;
  complexity: "Low" | "Med" | "High";
  decision: Decision;
  stage: Stage;
  validation: Validation;
  updated: string;
  dataSources?: string[];
  dependents?: number;
  usageTrend?: number[];
};

export const assets: Asset[] = [
  {
    id: "AST-1042",
    name: "Executive Claims Overview",
    type: "Dashboard",
    source: "Claims Command",
    owner: "Rahul Nair",
    initials: "RN",
    views: 1842,
    complexity: "High",
    decision: "Migrate",
    stage: "Validate",
    validation: "Failed checks",
    updated: "2h ago",
  },
  {
    id: "AST-1078",
    name: "Loss Ratio by Region",
    type: "Report",
    source: "Underwriting Analytics",
    owner: "Priya Shah",
    initials: "PS",
    views: 963,
    complexity: "Med",
    decision: "Rebuild",
    stage: "Migrate",
    validation: "In progress",
    updated: "5h ago",
  },
  {
    id: "AST-1124",
    name: "Policy Renewal Monitor",
    type: "Dashboard",
    source: "Policy Operations",
    owner: "Rahul Nair",
    initials: "RN",
    views: 1456,
    complexity: "Med",
    decision: "Migrate",
    stage: "Validate",
    validation: "Validated",
    updated: "Yesterday",
  },
  {
    id: "AST-1191",
    name: "Broker Performance Extract",
    type: "Script",
    source: "Distribution Hub",
    owner: "Kavya Iyer",
    initials: "KI",
    views: 82,
    complexity: "High",
    decision: "Rebuild",
    stage: "Assess",
    validation: "Not started",
    updated: "2d ago",
  },
  {
    id: "AST-1235",
    name: "Monthly Premium Bordereau",
    type: "Report",
    source: "Finance Reporting",
    owner: "James Cole",
    initials: "JC",
    views: 724,
    complexity: "Low",
    decision: "Migrate",
    stage: "Migrate",
    validation: "In progress",
    updated: "2d ago",
  },
  {
    id: "AST-1277",
    name: "Legacy Agent Scorecard",
    type: "Dashboard",
    source: "Agent Portal v1",
    owner: "Priya Shah",
    initials: "PS",
    views: 4,
    complexity: "Low",
    decision: "Retire",
    stage: "Assess",
    validation: "Retired",
    updated: "4d ago",
  },
  {
    id: "AST-1304",
    name: "Catastrophe Exposure Model",
    type: "Data model",
    source: "Risk Modelling",
    owner: "Aman Verma",
    initials: "AV",
    views: 612,
    complexity: "High",
    decision: "Migrate",
    stage: "Discover",
    validation: "Blocked",
    updated: "5d ago",
  },
  {
    id: "AST-1358",
    name: "Customer Retention Cohorts",
    type: "Data model",
    source: "Customer 360",
    owner: "Rahul Nair",
    initials: "RN",
    views: 418,
    complexity: "High",
    decision: "Rebuild",
    stage: "Migrate",
    validation: "Failed checks",
    updated: "6d ago",
  },
  {
    id: "AST-1399",
    name: "Open Claims Ageing",
    type: "Report",
    source: "Claims Command",
    owner: "Kavya Iyer",
    initials: "KI",
    views: 1108,
    complexity: "Med",
    decision: "Migrate",
    stage: "Validate",
    validation: "Validated",
    updated: "1w ago",
  },
  {
    id: "AST-1421",
    name: "Reinsurance Treaty Summary",
    type: "Dashboard",
    source: "Reinsurance Desk",
    owner: "James Cole",
    initials: "JC",
    views: 286,
    complexity: "High",
    decision: "Migrate",
    stage: "Assess",
    validation: "Not started",
    updated: "1w ago",
  },
  {
    id: "AST-1450",
    name: "Dormant Policy Lookup",
    type: "Script",
    source: "Policy Archive",
    owner: "Aman Verma",
    initials: "AV",
    views: 0,
    complexity: "Low",
    decision: "Retire",
    stage: "Discover",
    validation: "Retired",
    updated: "2w ago",
  },
  {
    id: "AST-1503",
    name: "Sales Pipeline Forecast",
    type: "Dashboard",
    source: "Commercial Sales",
    owner: "Priya Shah",
    initials: "PS",
    views: 875,
    complexity: "Med",
    decision: "Migrate",
    stage: "Migrate",
    validation: "In progress",
    updated: "2w ago",
  },
];

export const attentionItems = [
  {
    asset: "Executive Claims Overview",
    id: "AST-1042",
    issue: "3 visual totals differ from source",
    owner: "Rahul Nair",
    initials: "RN",
    age: "6h",
    severity: "Failed checks",
  },
  {
    asset: "Catastrophe Exposure Model",
    id: "AST-1304",
    issue: "Gateway credentials expired",
    owner: "Aman Verma",
    initials: "AV",
    age: "1d",
    severity: "Blocked",
  },
  {
    asset: "Customer Retention Cohorts",
    id: "AST-1358",
    issue: "Row count variance exceeds 2%",
    owner: "Rahul Nair",
    initials: "RN",
    age: "2d",
    severity: "Failed checks",
  },
  {
    asset: "Legacy Agent Scorecard",
    id: "AST-1277",
    issue: "Retirement approval pending",
    owner: "Pravin Wilson",
    initials: "PW",
    age: "3d",
    severity: "In progress",
  },
];

export const activities = [
  {
    initials: "PS",
    name: "Priya Shah",
    action: "validated Policy Renewal Monitor",
    time: "18 min ago",
    tone: "success",
  },
  {
    initials: "RN",
    name: "Rahul Nair",
    action: "re-ran 12 validation checks",
    time: "1h ago",
    tone: "info",
  },
  {
    initials: "PW",
    name: "Pravin Wilson",
    action: "approved Wave 2 for cutover",
    time: "3h ago",
    tone: "primary",
  },
  {
    initials: "AV",
    name: "Aman Verma",
    action: "flagged a gateway dependency",
    time: "Yesterday",
    tone: "warning",
  },
];
