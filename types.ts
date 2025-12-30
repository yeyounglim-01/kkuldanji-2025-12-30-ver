
export interface SourceFile {
  id: string;
  name: string;
  type: string;
  content: string; // base64
  mimeType: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

export interface HandoverData {
  overview: {
    transferor: { name: string; position: string; contact: string };
    transferee: { name: string; position: string; contact: string; startDate: string };
    reason: string;
    background: string;
    period: string;
    schedule: { date: string; activity: string }[];
  };
  jobStatus: {
    title: string;
    responsibilities: string[];
    authority: string;
    reportingLine: string;
    teamMission: string;
    teamGoals: string[];
  };
  priorities: {
    rank: number;
    title: string;
    status: string;
    solution: string;
    deadline: string;
  }[];
  stakeholders: {
    manager: string;
    internal: { name: string; role: string }[];
    external: { name: string; role: string }[];
  };
  teamMembers: {
    name: string;
    position: string;
    role: string;
    notes: string;
  }[];
  ongoingProjects: {
    name: string;
    owner: string;
    status: string;
    progress: number;
    deadline: string;
    description: string;
  }[];
  risks: {
    issues: string;
    risks: string;
  };
  roadmap: {
    shortTerm: string;
    longTerm: string;
  };
  resources: {
    docs: { category: string; name: string; location: string }[];
    systems: { name: string; usage: string; contact: string }[];
    contacts: { category: string; name: string; position: string; contact: string }[];
  };
  checklist: { text: string; completed: boolean }[];
}

export enum ViewMode {
  CHAT = 'CHAT',
  ROOMS = 'ROOMS',
  HANDOVER = 'HANDOVER'
}
