import { CardBuilder } from "~/composables/CardBuilder";

export const useCardBuilder = () => {
  return useState('card-builder', () => new CardBuilder())
}
