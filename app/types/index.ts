import User from "@/models/User";
export type SafeUser = Omit<
  typeof User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
