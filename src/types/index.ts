export interface PositionBase {
  company: string
  position: string
  status: 'pending' | 'interviewing' | 'rejected' | 'offered'
  appliedDate: string
  notes?: string
}

export interface Position extends PositionBase {
  id: string
}
export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tooling' | 'foundation'
  targetHours: number
  completedHours: number
  dependencies?: string[]
}

export interface LearningPlan {
  id: string
  skillId: string
  date: string
  duration: number
  note: string
}

export interface IStatusStyle {
  [key: string]: { type: string; label: string };
  pending: { type: string; label: string };
  interviewing: { type: string; label: string };
  rejected: { type: string; label: string };
  offered: { type: string; label: string };
}