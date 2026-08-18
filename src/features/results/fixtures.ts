import type {
  Archetype,
  ModalityResult,
  RIASECProfile,
  ScoringResult,
} from "@/lib/scoring/types";
import { programs } from "@/lib/programs";
import { ARCHETYPES } from "@/lib/scoring/archetypes";
import { PROGRAM_PROFILES } from "@/lib/scoring/programs-matrix";

export const archetype: Archetype = ARCHETYPES[0];

export const profile: RIASECProfile = {
  R: 0.8,
  I: 0.6,
  A: 0.3,
  S: 0.2,
  E: 0.4,
  C: 0.5,
};

export const program = programs[0];

export const programProfile = PROGRAM_PROFILES[0].riasec;

export const modality: ModalityResult = {
  recommendation: "presencial",
  confidence: "high",
  explanation:
    "Tu perfil se beneficia del contacto directo con empresas y laboratorios.",
};

export const results: ScoringResult[] = [
  {
    programId: "ing-software",
    overallScore: 92,
    fitBreakdown: { personality: 90, technical: 95, lifestyle: 88 },
  },
  {
    programId: "admin-empresas",
    overallScore: 78,
    fitBreakdown: { personality: 80, technical: 75, lifestyle: 76 },
  },
  {
    programId: "marketing",
    overallScore: 71,
    fitBreakdown: { personality: 72, technical: 68, lifestyle: 74 },
  },
];

export const topProgramIds = ["ing-software", "admin-empresas", "marketing"];