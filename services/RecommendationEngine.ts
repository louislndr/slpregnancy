import { protocols, Protocol, supportNowMap, getProtocol } from '@/data/protocols';
import { programs, Program } from '@/data/programs';

export interface RecommendationInput {
  journey: string;
  emotionalState: string;
  need: string;
  availableTime: number;
  position: string;
  guidanceMode: string;
}

export interface RecommendationOutput {
  primary: Protocol;
  alternatives: Protocol[];
  suggestedProgram?: Program;
}

function scoreProtocol(protocol: Protocol, input: RecommendationInput): number {
  let score = 0;

  if (protocol.journeys.includes(input.journey)) score += 3;
  if (protocol.emotionalStates.includes(input.emotionalState)) score += 3;
  if (protocol.needs.includes(input.need)) score += 2;
  if (protocol.positions.includes(input.position as any)) score += 1;
  if (protocol.duration <= input.availableTime) score += 2;
  if (input.guidanceMode === 'audio-visual' && protocol.hasVisual) score += 1;
  if (input.guidanceMode === 'audio-only' && !protocol.hasVisual) score += 1;

  return score;
}

export class RecommendationEngine {
  static recommend(input: RecommendationInput): RecommendationOutput {
    const scored = protocols
      .filter((p) => !p.isSupportNow)
      .map((p) => ({ protocol: p, score: scoreProtocol(p, input) }))
      .sort((a, b) => b.score - a.score);

    const primary = scored[0]?.protocol ?? protocols[0];
    const alternatives = scored.slice(1, 3).map((s) => s.protocol);

    const suggestedProgram = programs.find((p) => p.journey === input.journey);

    return { primary, alternatives, suggestedProgram };
  }

  static supportNow(key: string): { primary: Protocol; alternatives: Protocol[] } {
    const primaryId = supportNowMap[key];
    const primary = getProtocol(primaryId) ?? protocols[0];
    const alternatives = protocols
      .filter((p) => p.isSupportNow && p.id !== primaryId)
      .slice(0, 2);
    return { primary, alternatives };
  }
}
