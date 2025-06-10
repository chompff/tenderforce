import { useOrganization } from "@clerk/clerk-react";

/**
 * Custom hook to get organization-scoped data
 * Use this to scope tender data to the active organization
 */
export const useOrganizationData = () => {
  const { organization, isLoaded } = useOrganization();
  
  return {
    // Organization ID to use for scoping tender data
    orgId: organization?.id,
    // Organization name for display purposes
    orgName: organization?.name,
    // Whether the organization data is loaded
    isLoaded,
    // Whether user is in an organization
    hasOrganization: !!organization,
    // Full organization object if needed
    organization,
  };
};

// Example usage in a component:
/*
import { useOrganizationData } from '@/hooks/useOrganizationData';

function TenderList() {
  const { orgId, orgName, isLoaded, hasOrganization } = useOrganizationData();

  if (!isLoaded) return <div>Loading...</div>;
  
  if (!hasOrganization) {
    return <div>Please join or create an organization to view tenders.</div>;
  }

  // Fetch tenders scoped to this organization
  const fetchTenders = () => {
    // Use orgId to fetch organization-specific tender data
    fetch(`/api/tenders?organizationId=${orgId}`)
      .then(response => response.json())
      .then(data => {
        // Handle organization-scoped tender data
      });
  };

  return (
    <div>
      <h2>Tenders for {orgName}</h2>
      {// Render organization-scoped tender list}
    </div>
  );
}
*/ 