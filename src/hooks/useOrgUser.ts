import { useUser, useOrganization } from "@clerk/clerk-react"

export function useOrgUser() {
  const { user } = useUser()
  const { organization } = useOrganization()

  return {
    userId: user?.id ?? null,
    orgId: organization?.id ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    fullName: user?.fullName ?? null,
  }
}
