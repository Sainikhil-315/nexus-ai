import { apiClient } from "@/lib/api-client";
import { CreateUserData, UpdateUserData, User } from "@/types/user";

/**
 * User service for managing user data
 * All endpoints are prefixed with /api/v1
 */
const userServices = {
  /**
   * Sign in user with GitHub token
   * POST /api/v1/users/signin
   */
  signIn: async (data: CreateUserData): Promise<User> => {
    const response = await apiClient.post<User>("/api/v1/users/signin", data);
    return response.data;
  },

  /**
   * Get current user data
   * GET /api/v1/users/me
   */
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/users/me");
    return response.data;
  },

  /**
   * Update user data (onboarding, preferences, etc.)
   * PATCH /api/v1/users/:id
   */
  completeOnboarding: async (data: UpdateUserData): Promise<User> => {
    const response = await apiClient.post<User>(`/api/v1/users/onboarding/complete`, data);
    return response.data;
  },


};

export default userServices;
