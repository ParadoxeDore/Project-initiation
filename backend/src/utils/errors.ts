export class WordPairNotFoundError extends Error {
  constructor(message = 'Word pair not found') {
    super(message)
    this.name = 'WordPairNotFoundError'
  }
}

export class DuplicateWordPairError extends Error {
  constructor(message = 'Word pair already exists') {
    super(message)
    this.name = 'DuplicateWordPairError'
  }
}
