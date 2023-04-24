import { Translator } from "../src";
import { Lang, TranslationProvider } from "database";
import nock from "nock";

const reversoResponse = {
  id: "67fb993c-5f77-433f-aeb7-bd0054fca116",
  from: "pol",
  to: "eng",
  input: ["woda"],
  correctedText: null,
  translation: ["water"],
  engines: ["Context"],
  languageDetection: {
    detectedLanguage: "pol",
    isDirectionChanged: false,
    originalDirection: "pol-eng",
    originalDirectionContextMatches: 23679,
    changedDirectionContextMatches: 0,
    timeTaken: 52,
  },
  contextResults: {
    rudeWords: false,
    colloquialisms: false,
    riskyWords: false,
    results: [
      {
        translation: "water",
        sourceExamples: [
          "Dodatkowo ozonowana <em>woda</em> smakuje zwierzętom bardziej.",
          "Obecnie <em>woda</em> jest obowiązkową częścią krajobrazu.",
          "Rekiny przyciąga wzburzona <em>woda</em> i jaskrawe kolory.",
          "Oczywiście <em>woda</em> jest kluczem do znalezienia życia na Marsie.",
          "Ale szacunek... to <em>woda</em> na pustyni.",
          "Reszta plazmy jest prawie jak <em>woda</em> morska.",
          "Teraz jest sucha, ale <em>woda</em> nadchodzi.",
          "Wszystkie wygody: bieżąca <em>woda</em>, łazienki.",
          "A ta wzburzona <em>woda</em> oznacza płyciznę.",
          "To chyba wosk i słona <em>woda</em>.",
        ],
        targetExamples: [
          "In addition, ozonized <em>water</em> tastes more good to the animals.",
          "Today, <em>water</em> is a mandatory part of the landscape design.",
          "Sharks are attracted to churning <em>water</em>, bright colors.",
          "One of these is the extraction of <em>water</em> can be used, of course, for life support.",
          "But respect... man, that's <em>water</em> in the desert.",
          "The rest of the plasma's very much like sea <em>water</em>.",
          "At the moment it is dry, but <em>water</em> is coming.",
          "All the modern comforts: Running <em>water</em>, restrooms.",
          "This choppy <em>water</em> over here, that means shallow.",
          "It's something about the wax and the salt <em>water</em>.",
        ],
        rude: false,
        colloquial: false,
        partOfSpeech: "n.",
        frequency: 25713,
        vowels: null,
        transliteration: null,
      },
      {
        translation: "woda",
        sourceExamples: [],
        targetExamples: [],
        rude: false,
        colloquial: false,
        partOfSpeech: null,
        frequency: 391,
        vowels: null,
        transliteration: null,
      },
    ],
    totalContextCallsMade: 1,
    timeTakenContext: 0,
  },
  truncated: false,
  timeTaken: 52,
};

describe("reverso", () => {
  it("works with mocked response", async () => {
    const scope = nock("https://api.reverso.net")
      .post("/translate/v1/translation")
      .reply(200, reversoResponse);

    scope.persist();

    const translation = await new Translator().translateWithProvider(
      "woda",
      "pl",
      "en",
      "reverso"
    );
    expect(translation.to_text).toEqual("water");
  });
});
