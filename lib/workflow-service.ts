import { EventPlan } from '@/types/schemas';

type ApprovalState = 'draft' | 'awaiting_review_A' | 'awaiting_review_B' | 'approved' | 'published';

interface WorkflowTransition {
  from: ApprovalState;
  to: ApprovalState;
  trigger: string;
}

const transitions: WorkflowTransition[] = [
  { from: 'draft', to: 'awaiting_review_A', trigger: 'generate' },
  { from: 'awaiting_review_A', to: 'awaiting_review_B', trigger: 'approve_A' },
  { from: 'awaiting_review_B', to: 'approved', trigger: 'approve_B' },
  { from: 'approved', to: 'published', trigger: 'publish' }
];

export function getNextState(currentState: ApprovalState, trigger: string): ApprovalState | null {
  const transition = transitions.find(t => t.from === currentState && t.trigger === trigger);
  return transition ? transition.to : null;
}

export function canApprove(eventPlan: EventPlan, userEmail: string): 'A' | 'B' | null {
  if (eventPlan.approval.state === 'awaiting_review_A' && 
      eventPlan.approval.companyA_contact.email === userEmail) {
    return 'A';
  }
  if (eventPlan.approval.state === 'awaiting_review_B' && 
      eventPlan.approval.companyB_contact.email === userEmail) {
    return 'B';
  }
  return null;
}

export function recordApproval(eventPlan: EventPlan, company: 'A' | 'B', approverEmail: string): EventPlan {
  const now = new Date().toISOString();
  
  return {
    ...eventPlan,
    approval: {
      ...eventPlan.approval,
      approvers: [
        ...(eventPlan.approval.approvers || []),
        {
          company: `Company ${company}`,
          approvedAt: now,
          approvedBy: approverEmail
        }
      ],
      approvalHistory: [
        ...(eventPlan.approval.approvalHistory || []),
        {
          timestamp: now,
          action: `Approved by Company ${company}`,
          by: approverEmail
        }
      ]
    },
    updatedAt: now
  };
}
