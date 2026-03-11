import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "../../shared/schema";

describe("salary validation", () => {
  describe("validateProspect helper", () => {
    test("accepts a valid salary in $XXX,XXX format", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$120,000",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a valid salary with more digits like $1,200,000", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$1,200,000",
      });
      expect(result.valid).toBe(true);
    });

    test("accepts an empty salary (optional field)", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "",
      });
      expect(result.valid).toBe(true);
    });

    test("accepts undefined salary (field omitted)", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
      });
      expect(result.valid).toBe(true);
    });

    test("rejects salary without dollar sign", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "120000",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary must be in $XXX,XXX format (e.g. $120,000)");
    });

    test("rejects salary with incorrect comma placement", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$1200,00",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary must be in $XXX,XXX format (e.g. $120,000)");
    });

    test("rejects salary with letters", () => {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$120k",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary must be in $XXX,XXX format (e.g. $120,000)");
    });
  });

  describe("insertProspectSchema", () => {
    test("accepts valid salary", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$95,000",
      });
      expect(result.success).toBe(true);
    });

    test("accepts null salary", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: null,
      });
      expect(result.success).toBe(true);
    });

    test("accepts omitted salary", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Acme",
        roleTitle: "Engineer",
      });
      expect(result.success).toBe(true);
    });

    test("rejects badly formatted salary", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "120,000",
      });
      expect(result.success).toBe(false);
    });

    test("rejects salary with spaces", () => {
      const result = insertProspectSchema.safeParse({
        companyName: "Acme",
        roleTitle: "Engineer",
        salary: "$ 120,000",
      });
      expect(result.success).toBe(false);
    });
  });
});
