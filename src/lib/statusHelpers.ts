export function getUniversalStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Active';
    case 'in-progress': return 'In Progress';
    case 'concept': return 'Concept';
    case 'completed': return 'Completed';
    case 'current': return 'Current';
    case 'past': return 'Past';
    case 'earned': return 'Earned';
    case 'training': return 'Training';
    case 'facilitated': return 'Facilitated';
    case 'presented': return 'Presented';
    case 'attended': return 'Attended';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getUniversalStatusClass(status: string): string {
  switch (status) {
    case 'active': return 'status-active';
    case 'in-progress': return 'status-progress';
    case 'concept': return 'status-concept';
    case 'completed': return 'status-completed';
    case 'current': return 'status-current';
    case 'past': return 'status-past';
    case 'earned': return 'status-earned';
    case 'training': return 'status-training';
    case 'facilitated': return 'status-facilitated';
    case 'presented': return 'status-presented';
    case 'attended': return 'status-attended';
    default: return 'bg-gray-800 text-gray-400';
  }
}
