import { FilterComparison } from "../types/requests/filter-comparison";

describe("FilterComparison", () => {
  it("should have the correct values", () => {
    expect(FilterComparison.Equal).toBe("=");
    expect(FilterComparison.NotEqual).toBe("!=");
    expect(FilterComparison.Exists).toBe("");
    expect(FilterComparison.DoesNotExist).toBe("!");
    expect(FilterComparison.LessThan).toBe("<");
    expect(FilterComparison.LessThanOrEqual).toBe("<=");
    expect(FilterComparison.GreaterThan).toBe(">");
    expect(FilterComparison.GreaterThanOrEqual).toBe(">=");
  });
});