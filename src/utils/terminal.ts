const clearTerminal = () => process.stdout.write('\x1Bc\x1B[3J\x1B[2J\x1B[H')

export {
  clearTerminal,
}
