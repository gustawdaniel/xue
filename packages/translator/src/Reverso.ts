import { Lang, PartOfSpeech } from "database";

export type ReversoLang =
  | "ara"
  | "ger"
  | "spa"
  | "fra"
  | "heb"
  | "ita"
  | "jpn"
  | "dut"
  | "pol"
  | "por"
  | "rum"
  | "rus"
  | "ukr"
  | "tur"
  | "chi"
  | "eng";

export class Reverso {
  private static posMap(): Map<string, PartOfSpeech> {
    return new Map([
      ['n.',PartOfSpeech.noun],
      ['nf.',PartOfSpeech.noun], // probably, no source
      ['adj.', PartOfSpeech.adjective],
      ['v.', PartOfSpeech.verb],
      ['null', PartOfSpeech.other],
    ])
  }

  static languages: Map<Lang, ReversoLang> = new Map([
    // ar: 'ara',
    [Lang.de, "ger"], // ge
    [Lang.es, "spa"], // sp
    [Lang.fr, "fra"],
    // he: 'heb',
    // it: 'ita',
    // ja: 'jpn',
    // du: 'dut',
    [Lang.pl, "pol"],
    // po: 'por',
    // ro: 'rum',
    [Lang.ru, "rus"],
    [Lang.uk, "ukr"],
    // tu: 'tur',
    // ch: 'chi',
    [Lang.en, "eng"],
  ]);

  static getPartOfSpeech(pos: string): PartOfSpeech {
    if(Reverso.posMap().has(pos)) {
      return Reverso.posMap().get(pos)!;
    } else {
      console.log(`Unknown pos "${pos}"`);
      return PartOfSpeech.other;
    }
  }
}
