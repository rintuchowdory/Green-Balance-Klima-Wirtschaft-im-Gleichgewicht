import { describe, expect, it } from "vitest";
import { simulate, normaliseMix, START_MIX } from "./simulator";

describe("normaliseMix", () => {
  it("skaliert die Anteile auf 100 Prozent", () => {
    const mix = normaliseMix({ coal: 10, gas: 10, wind: 10, solar: 10, hydro: 10 });
    const sum = Object.values(mix).reduce((a, b) => a + b, 0);
    expect(Math.round(sum)).toBe(100);
  });

  it("faellt bei leerem Mix auf den Startwert zurueck", () => {
    const mix = normaliseMix({ coal: 0, gas: 0, wind: 0, solar: 0, hydro: 0 });
    expect(mix).toEqual(START_MIX);
  });
});

describe("simulate", () => {
  it("rechnet einen reinen Kohlemix auf hohe Emissionen", () => {
    const result = simulate({ coal: 100, gas: 0, wind: 0, solar: 0, hydro: 0 }, 500);
    expect(result.intensity).toBe(950);
    expect(result.emissionsMt).toBe(475);
    expect(result.renewableShare).toBe(0);
  });

  it("rechnet einen reinen Windmix auf sehr niedrige Emissionen", () => {
    const result = simulate({ coal: 0, gas: 0, wind: 100, solar: 0, hydro: 0 }, 500);
    expect(result.intensity).toBe(12);
    expect(result.emissionsMt).toBe(6);
    expect(result.renewableShare).toBe(100);
  });

  it("ist monoton: mehr Kohle bedeutet mehr Emissionen", () => {
    const wenig = simulate({ coal: 10, gas: 10, wind: 40, solar: 20, hydro: 20 }, 500);
    const viel = simulate({ coal: 40, gas: 10, wind: 25, solar: 15, hydro: 10 }, 500);
    expect(viel.emissionsMt).toBeGreaterThan(wenig.emissionsMt);
  });
});
