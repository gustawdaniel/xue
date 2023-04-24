import { CardBuilder } from "#imports";

export const useCardBuilder = () => {
  return useState('card-builder', () => new CardBuilder())
}
