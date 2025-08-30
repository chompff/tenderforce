// import { useUser, useOrganization } from "@clerk/clerk-react"

export function useOrgUser() {
  // const { user } = useUser()
  // const { organization } = useOrganization()

  // Temporary mock data while Clerk is disabled
  const user = null;
  const organization = null;

  return {
    userId: user?.id ?? null,
    orgId: organization?.id ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    fullName: user?.fullName ?? null,
  }
}
