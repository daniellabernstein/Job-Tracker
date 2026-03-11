import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "../../shared/schema";

describe("HireHaas feature validation", () => {
  describe("validateProspect helper", () => {
    test("accepts a prospect with isHireHaas set to true", () => {
      const result = validateProspect({
        companyName: "Berkeley Alumni Co",
        roleTitle: "Product Manager",
        isHireHaas: true,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a prospect with isHireHaas set to false", () => {
      const result = validateProspect({
        companyName: "Some Company",
        roleTitle: "Engineer",
        isHireHaas: false,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a prospect without isHireHaas (field omitted)", () => {
      const result = validateProspect({
        companyName: "Some Company",
        roleTitle: "Engineer",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("insertProspectSchema", () => {
    test("accepts isHireHaas true", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Berkeley Alumni Co",
        roleTitle: "Product Manager",
        isHireHaas: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isHireHaas).toBe(true);
      }
    });

    test("accepts isHireHaas false", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Some Company",
        roleTitle: "Engineer",
        isHireHaas: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isHireHaas).toBe(false);
      }
    });

    test("defaults isHireHaas to false when omitted", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Some Company",
        roleTitle: "Engineer",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isHireHaas).toBe(false);
      }
    });

    test("rejects non-boolean isHireHaas", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Some Company",
        roleTitle: "Engineer",
        isHireHaas: "yes",
      });
      expect(result.success).toBe(false);
    });

    test("HireHaas prospect can also have a valid salary", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Berkeley Alumni Co",
        roleTitle: "Product Manager",
        isHireHaas: true,
        salary: "$150,000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isHireHaas).toBe(true);
        expect(result.data.salary).toBe("$150,000");
      }
    });

    test("HireHaas prospect can have an interest level", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Berkeley Alumni Co",
        roleTitle: "Data Scientist",
        isHireHaas: true,
        interestLevel: "High",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isHireHaas).toBe(true);
        expect(result.data.interestLevel).toBe("High");
      }
    });
  });
});
