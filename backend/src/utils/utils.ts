const { generateMnemonic: _generateMnemonic } = require('bip39-light');

function generateMnemonic(wordCount: number) {
  wordCount = wordCount || 12;

  if (wordCount % 3 !== 0) {
    throw Error(`Invalid mnemonic word count supplied: ${wordCount}`);
  }

  return _generateMnemonic((32 * wordCount) / 3);
}

export {
  generateMnemonic
};
