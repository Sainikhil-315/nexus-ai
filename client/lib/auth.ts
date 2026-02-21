import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import userServices from "@/lib/services/user-servces";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],
    callbacks: {
        /**
         * JWT callback - runs when token is created or updated
         * Only store essential fields to keep JWT size small
         */
        async jwt({ token, user, account, trigger, session }): Promise<JWT> {
            // Initial sign in - attach access token and minimal user data
            if (account && user) {
                token.accessToken = account.access_token;
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.onboardingCompleted = user.onboardingCompleted;
            }

            // When update() is called with session data, use the passed values
            // This allows directly updating session fields without backend call
            if (session?.onboardingCompleted !== undefined) {
                token.onboardingCompleted = session.onboardingCompleted;
            }

            return token;
        },

        /**
         * Session callback - runs when session is checked
         * Only attach essential fields from token to session
         */
        async session({ session, token }): Promise<Session> {
            // Attach access token to session
            if (token.accessToken) {
                session.accessToken = token.accessToken as string;
            }

            // Attach minimal user data from token to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string | undefined;
                session.user.onboardingCompleted = token.onboardingCompleted as boolean;
            }

            return session;
        },

        /**
         * SignIn callback - called when user signs in
         * Calls backend API to create/update user with GitHub token
         */
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                try {
                    if(account.access_token === undefined) {
                        throw new Error("GitHub access token is missing");
                    }

                    // Call backend API with GitHub token using userServices
                    const dbUser = await userServices.signIn({
                        githubToken: account.access_token!,
                    });

                    // Attach minimal backend user data to the user object for JWT
                    user.id = dbUser.id;
                    user.email = dbUser.email;
                    user.username = dbUser.username;
                    user.onboardingCompleted = dbUser.onboardingCompleted === 1;

                    return true;
                } catch (error) {
                    console.error("Error during sign in:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
});
