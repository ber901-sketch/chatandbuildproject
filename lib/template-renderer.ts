import { EventPlan } from '@/types/schemas';

interface TemplateSection {
  id: string;
  label: string;
  content?: string;
  table?: {
    headers: string[];
    rows: string;
  };
}

const masterPlanTemplate: TemplateSection[] = [
  {
    id: 'header',
    label: 'Event Overview',
    content: '{{title}}\n{{subtitle}}\nTone: {{tone}}'
  },
  {
    id: 'objectives',
    label: 'Objectives & Success Metrics',
    content: '{{#each objectives}}• {{this}}\n{{/each}}\nKPIs:\n{{#each KPIs}}- {{key}} → {{target}}\n{{/each}}'
  },
  {
    id: 'audience',
    label: 'Target Audience',
    content: '{{#each audiencePersonas}}Role: {{role}}\nPain Points: {{painPoints}}\nValue Props: {{valueProps}}\n\n{{/each}}'
  },
  {
    id: 'agenda_table',
    label: 'Programme Outline',
    table: {
      headers: ['Start (min)', 'End (min)', 'Session', 'Speaker', 'Notes'],
      rows: '{{agenda}}'
    }
  },
  {
    id: 'roles',
    label: 'Roles & Responsibilities',
    content: 'Organizer: {{approval.companyA_contact.name}}\nPartner: {{approval.companyB_contact.name}}\nSpeakers:\n{{#each speakerBriefs}}- {{role}} → {{bullets}}\n{{/each}}'
  },
  {
    id: 'marketing_plan',
    label: 'Marketing Workflow',
    content: 'Landing Hero:\n{{marketingAssets.landingHero}}\nEmails:\n{{marketingAssets.emailSubjects}}\nSocial Posts:\n{{marketingAssets.socialPosts}}'
  },
  {
    id: 'registration_plan',
    label: 'Registration Workflow',
    content: 'Eventbrite Event ID: {{eventbrite.eventId}}\nURL: {{eventbrite.url}}'
  },
  {
    id: 'logistics',
    label: 'Packing List',
    content: '{{#each logistics}}• {{this}}\n{{/each}}'
  },
  {
    id: 'followup_plan',
    label: 'Post-Event Follow-Up',
    content: 'Pilot Objective: {{pilotTemplate.objective}}\nMetrics: {{pilotTemplate.metrics}}'
  }
];

function renderHandlebars(template: string, data: any): string {
  // Simple Handlebars-like rendering
  let result = template;

  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
    return value !== undefined ? String(value) : '';
  });

  // Replace each loops {{#each array}}...{{/each}}
  result = result.replace(/\{\{#each (\w+)\}\}(.*?)\{\{\/each\}\}/gs, (_, arrayName, content) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';
    return array.map(item => {
      if (typeof item === 'string') {
        return content.replace(/\{\{this\}\}/g, item);
      }
      return content.replace(/\{\{(\w+)\}\}/g, (_: any, key: string) => item[key] || '');
    }).join('');
  });

  return result;
}

export function renderMasterPlan(eventPlan: EventPlan): string {
  let output = '# Event Master Plan\n\n';

  for (const section of masterPlanTemplate) {
    output += `## ${section.label}\n\n`;

    if (section.content) {
      output += renderHandlebars(section.content, eventPlan) + '\n\n';
    }

    if (section.table) {
      output += '| ' + section.table.headers.join(' | ') + ' |\n';
      output += '| ' + section.table.headers.map(() => '---').join(' | ') + ' |\n';
      
      if (eventPlan.agenda) {
        for (const item of eventPlan.agenda) {
          output += `| ${item.startMin} | ${item.endMin} | ${item.title} | ${item.speaker || ''} | ${item.notes || ''} |\n`;
        }
      }
      output += '\n';
    }
  }

  return output;
}
