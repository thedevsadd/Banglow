export interface ProgressStage {
  label: string;
  description: string;
  status: "upcoming" | "current" | "complete";
}

export interface ProgressResult {
  percent: number;
  currentStageIndex: number;
  stages: ProgressStage[];
}

const MEETING_STAGES = [
  { label: "Requested", description: "Your meeting request has been submitted." },
  { label: "Confirmed", description: "Our agent has reviewed and confirmed the slot." },
  { label: "Meeting Scheduled", description: "Preparation is underway for your physical property visit." },
  { label: "Completed", description: "The site visit has been successfully conducted." }
];

const BOOKING_STAGES = [
  { label: "Booking Money Received", description: "The token reservation payment has been logged." },
  { label: "Verification", description: "Bank or MFS transaction reference is being verified." },
  { label: "Confirmed", description: "Unit is officially reserved under your profile." },
  { label: "Documentation", description: "Drafting the legal allotment papers and installment schedules." }
];

export function calculateProgress(createdAtIsoStr: string, type: "meeting" | "booking"): ProgressResult {
  const created = new Date(createdAtIsoStr).getTime();
  const now = new Date().getTime();
  
  // Elapsed time in milliseconds
  const elapsedMs = now - created;
  const elapsedMins = elapsedMs / (1000 * 60);

  // Deterministic stages based on elapsed time for interactive demo purposes:
  // - Stage 0 (25%): 0 to 2 minutes
  // - Stage 1 (50%): 2 to 5 minutes
  // - Stage 2 (75%): 5 to 10 minutes
  // - Stage 3 (100%): >10 minutes
  let currentStageIndex = 0;
  if (elapsedMins >= 10) {
    currentStageIndex = 3;
  } else if (elapsedMins >= 5) {
    currentStageIndex = 2;
  } else if (elapsedMins >= 2) {
    currentStageIndex = 1;
  }

  const baseStages = type === "meeting" ? MEETING_STAGES : BOOKING_STAGES;
  const percent = (currentStageIndex + 1) * 25;

  const stages: ProgressStage[] = baseStages.map((stage, idx) => {
    let status: "upcoming" | "current" | "complete" = "upcoming";
    if (idx < currentStageIndex) {
      status = "complete";
    } else if (idx === currentStageIndex) {
      status = "current";
    }
    return {
      ...stage,
      status
    };
  });

  return {
    percent,
    currentStageIndex,
    stages
  };
}
