/**
 * User types matching the backend SQLAlchemy User model
 */

export type DeveloperLevel = "beginner" | "intermediate" | "advanced" | "founder";

export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface User {
  id: string; // UUID
  githubId: string;
  email: string;
  username?: string;
  
  // User preferences
  preferredStack?: string | null; // e.g., "nextjs", "fastapi", "node"
  preferredLanguage?: string | null; // e.g., "python", "typescript"
  developerLevel: DeveloperLevel;
  
  // Onboarding
  onboardingCompleted: number; // 0 = false, 1 = true
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  monthlyBuildsUsed: number;
  monthlyBuildsLimit: number;
  
  // Timestamps
  createdAt: string; // ISO date string
  lastActiveAt: string; // ISO date string
}



/**
 * Onboarding form data
 */
export interface UpdateUserData {
  preferredStack: string;
  preferredLanguage: string;
  developerLevel: DeveloperLevel;
}


export interface CreateUserData {
    githubToken : string;
}
