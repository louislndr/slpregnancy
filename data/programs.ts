export interface ProgramSession {
  id: string;
  sessionNumber: number;
  title: string;
  duration: number;
  protocolId: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  journey: string;
  totalSessions: number;
  sessions: ProgramSession[];
  color: string;
}

export const programs: Program[] = [
  {
    id: 'ivf-journey',
    title: 'IVF Journey',
    description: 'Support through every stage of IVF — from preparation to the two-week wait.',
    journey: 'trying-to-conceive',
    totalSessions: 4,
    color: '#BEB5DA',
    sessions: [
      { id: 'ivf-1', sessionNumber: 1, title: 'Grounding Before Your Appointment', duration: 10, protocolId: 'waiting-room-calm' },
      { id: 'ivf-2', sessionNumber: 2, title: 'Before Egg Retrieval', duration: 8, protocolId: 'before-ultrasound' },
      { id: 'ivf-3', sessionNumber: 3, title: 'Waiting Room Calm', duration: 5, protocolId: 'waiting-room-calm' },
      { id: 'ivf-4', sessionNumber: 4, title: 'After the Transfer — Waiting in Hope', duration: 10, protocolId: 'waiting-for-results' },
    ],
  },
  {
    id: 'pregnancy-after-loss',
    title: 'Pregnancy After Loss',
    description: 'Gentle support for navigating a new pregnancy after the experience of loss.',
    journey: 'pregnancy-recovery',
    totalSessions: 4,
    color: '#699BA9',
    sessions: [
      { id: 'pal-1', sessionNumber: 1, title: 'Gentle Return', duration: 10, protocolId: 'gentle-return' },
      { id: 'pal-2', sessionNumber: 2, title: 'Meeting Your Body Again', duration: 10, protocolId: 'safe-in-this-moment' },
      { id: 'pal-3', sessionNumber: 3, title: 'Holding Two Truths', duration: 15, protocolId: 'releasing-fear' },
      { id: 'pal-4', sessionNumber: 4, title: 'Preparing for What\'s Next', duration: 10, protocolId: 'confidence-boost' },
    ],
  },
  {
    id: 'preparing-for-birth',
    title: 'Preparing For Birth',
    description: 'Build confidence, calm and connection as you approach the birth of your baby.',
    journey: 'pregnancy',
    totalSessions: 4,
    color: '#FFC299',
    sessions: [
      { id: 'pfb-1', sessionNumber: 1, title: 'Birth Preparation', duration: 15, protocolId: 'releasing-fear' },
      { id: 'pfb-2', sessionNumber: 2, title: 'Releasing Fear', duration: 15, protocolId: 'releasing-fear' },
      { id: 'pfb-3', sessionNumber: 3, title: 'Connecting with Baby', duration: 10, protocolId: 'connection-with-baby' },
      { id: 'pfb-4', sessionNumber: 4, title: 'The Birth Space', duration: 10, protocolId: 'confidence-boost' },
    ],
  },
  {
    id: 'returning-to-myself',
    title: 'Returning To Myself',
    description: 'A postpartum journey back to yourself — body, mind and identity.',
    journey: 'postpartum',
    totalSessions: 4,
    color: '#FFE6D5',
    sessions: [
      { id: 'rtm-1', sessionNumber: 1, title: 'Welcome Back', duration: 10, protocolId: 'postpartum-welcome-back' },
      { id: 'rtm-2', sessionNumber: 2, title: 'Gentle Awakening', duration: 10, protocolId: 'morning-gentle-start' },
      { id: 'rtm-3', sessionNumber: 3, title: 'Rebuilding Strength', duration: 15, protocolId: 'gentle-movement' },
      { id: 'rtm-4', sessionNumber: 4, title: 'Finding Your New Self', duration: 15, protocolId: 'moment-for-myself' },
    ],
  },
];

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}
