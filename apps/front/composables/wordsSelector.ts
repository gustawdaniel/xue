import { WordsSelector} from "#imports";

export const useWordsSelector = () => {
  return useState('word-selector', () => new WordsSelector())
}
