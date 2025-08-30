import { Obligation } from '@/types/obligations';
import { getObligationsByCpv, getObligationById } from '@/data/obligations';

export class ObligationService {
  /**
   * Fetches all obligations that apply to a given CPV code
   * @param cpvCode The CPV code to look up
   * @returns Array of obligations that apply to this CPV code
   */
  static async getObligationsByCpv(cpvCode: string): Promise<Obligation[]> {
    // In a real implementation, this might fetch from an API
    // For now, we use the local data
    return Promise.resolve(getObligationsByCpv(cpvCode));
  }

  /**
   * Loads a specific obligation by its ID
   * @param obligationId The obligation ID to load
   * @returns The obligation data or null if not found
   */
  static async loadObligation(obligationId: string): Promise<Obligation | null> {
    // In a real implementation, this might fetch from an API
    // For now, we use the local data
    return Promise.resolve(getObligationById(obligationId));
  }

  /**
   * Checks if a CPV code has any obligations
   * @param cpvCode The CPV code to check
   * @returns True if obligations exist for this CPV code
   */
  static async hasObligations(cpvCode: string): Promise<boolean> {
    const obligations = await this.getObligationsByCpv(cpvCode);
    return obligations.length > 0;
  }

  /**
   * Gets a summary of all obligations for a CPV code
   * @param cpvCode The CPV code to summarize
   * @returns Summary object with counts and types
   */
  static async getObligationsSummary(cpvCode: string): Promise<{
    count: number;
    hasEED: boolean;
    hasGPP: boolean;
    obligationIds: string[];
  }> {
    const obligations = await this.getObligationsByCpv(cpvCode);
    
    return {
      count: obligations.length,
      hasEED: obligations.some(o => o.badges.includes('EED')),
      hasGPP: obligations.some(o => o.badges.includes('GPP')),
      obligationIds: obligations.map(o => o.obligation_id),
    };
  }
}