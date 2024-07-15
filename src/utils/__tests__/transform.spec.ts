import { pluralise } from '../transform'

describe('pluralise', () => {

  it('returns the original word if count is 1', () => {
    expect(pluralise('apple', 1)).toBe('apple')
  })

  it('returns the pluralised word if count is not 1', () => {
    expect(pluralise('apple', 0)).toBe('apples')
    expect(pluralise('apple', 2)).toBe('apples')
  })

})
