// Simple pluralisation by adding 's', does not handle irregular plurals.
const pluralise = (word: string, count: number) => count === 1 ? word : `${word}s`

export {
  pluralise,
}
