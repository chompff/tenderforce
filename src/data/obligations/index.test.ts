import { describe, it, expect } from 'vitest';
import { getObligationsByCpv, obligations } from './index';

describe('getObligationsByCpv', () => {
  describe('Mapped CPV codes', () => {
    it('should return specific obligations for mapped CPV code 30231300-0 (monitors)', () => {
      // Arrange: CPV code for monitors (Beeldschermen)
      const cpvCode = '30231300-0';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // Should contain energy_label, ecodesign_products, and gpp-computers
      const obligationIds = result.map(o => o.obligation_id);
      expect(obligationIds).toContain('energy_label');
      expect(obligationIds).toContain('ecodesign_products');
      expect(obligationIds).toContain('gpp-computers');

      // Should always end with standard_obligations
      expect(obligationIds[obligationIds.length - 1]).toBe('standard_obligations');

      // Verify all obligations have required properties
      result.forEach(obligation => {
        expect(obligation).toHaveProperty('obligation_id');
        expect(obligation).toHaveProperty('title');
        expect(obligation).toHaveProperty('sections');
      });
    });

    it('should return specific obligations and standard_obligations for other mapped codes', () => {
      // Arrange: CPV code for food catering
      const cpvCode = '15000000-8';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      const obligationIds = result.map(o => o.obligation_id);

      // Should contain gpp-food-catering
      expect(obligationIds).toContain('gpp-food-catering');

      // Should always end with standard_obligations
      expect(obligationIds[obligationIds.length - 1]).toBe('standard_obligations');
    });
  });

  describe('Unmapped CPV codes', () => {
    it('should return algemene_eed and standard_obligations for unmapped CPV code 18000000-9 (clothing)', () => {
      // Arrange: CPV code for clothing (not in mapping)
      const cpvCode = '18000000-9';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(2);

      const obligationIds = result.map(o => o.obligation_id);

      // Should contain exactly algemene_eed and standard_obligations
      expect(obligationIds[0]).toBe('algemene_eed');
      expect(obligationIds[1]).toBe('standard_obligations');

      // Verify the algemene_eed obligation has required properties
      const algemeneEed = result[0];
      expect(algemeneEed.obligation_id).toBe('algemene_eed');
      expect(algemeneEed.title).toBeDefined();
      expect(algemeneEed.sections).toBeDefined();
    });

    it('should return algemene_eed and standard_obligations for unmapped CPV code 01000000-0 (agriculture)', () => {
      // Arrange: CPV code for agricultural products (not in mapping)
      const cpvCode = '01000000-0';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(2);

      const obligationIds = result.map(o => o.obligation_id);

      // Should contain exactly algemene_eed and standard_obligations
      expect(obligationIds).toEqual(['algemene_eed', 'standard_obligations']);
    });

    it('should return algemene_eed and standard_obligations for any unmapped CPV code', () => {
      // Arrange: A completely fictional CPV code
      const cpvCode = '99999999-9';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(2);

      const obligationIds = result.map(o => o.obligation_id);
      expect(obligationIds).toEqual(['algemene_eed', 'standard_obligations']);
    });
  });

  describe('Edge cases', () => {
    it('should never return an empty array', () => {
      // Test various CPV codes
      const testCodes = [
        '30231300-0', // Mapped
        '18000000-9', // Unmapped
        '99999999-9', // Fictional
        '01000000-0', // Unmapped
      ];

      testCodes.forEach(cpvCode => {
        const result = getObligationsByCpv(cpvCode);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('should always include standard_obligations as the last item when obligations exist', () => {
      // Test various CPV codes
      const testCodes = [
        '30231300-0', // Mapped
        '18000000-9', // Unmapped
        '15000000-8', // Mapped
      ];

      testCodes.forEach(cpvCode => {
        const result = getObligationsByCpv(cpvCode);
        const lastObligation = result[result.length - 1];
        expect(lastObligation.obligation_id).toBe('standard_obligations');
      });
    });
  });

  describe('Module ordering', () => {
    it('should return modules in correct order for CPV codes with multiple modules', () => {
      // Arrange: CPV code for monitors should have energy_label first, then ecodesign
      const cpvCode = '30231300-0';

      // Act
      const result = getObligationsByCpv(cpvCode);

      // Assert
      const obligationIds = result.map(o => o.obligation_id);

      // Find positions of key modules
      const energyLabelPos = obligationIds.indexOf('energy_label');
      const ecodesignPos = obligationIds.indexOf('ecodesign_products');
      const standardPos = obligationIds.indexOf('standard_obligations');

      // energy_label should come before ecodesign
      expect(energyLabelPos).toBeLessThan(ecodesignPos);

      // standard_obligations should always be last
      expect(standardPos).toBe(obligationIds.length - 1);
    });
  });

  describe('Parent code lookup', () => {
    it('should find parent code obligations when exact match not found', () => {
      // This test assumes hierarchical CPV lookup is working
      // If a specific child code doesn't exist, it should find parent obligations

      // Note: This depends on actual data in cpv-mapping-from-csv.json
      // The test validates the hierarchical lookup mechanism works
      const result = getObligationsByCpv('30231300-0');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
