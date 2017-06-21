const sha256 = require('./sha256');

/**
 * Generate a unique token for a strig
 * @param   {string}    key     Key to generate token
 * @example generatedUniqueToken("Equipo A12") == generatedUniqueToken("  Equipo   A12 ")
 * @example generatedUniqueToken("Equipo A12") != generatedUniqueToken("  Equipo   A 12 ")
 */
function generatedUniqueToken(key) {
    if (typeof(key) != 'string') {
        return '';
    }
    return sha256(key.trim().split(' ').filter(i => i !== '').join(' ').toLowerCase());
}

module.exports = generatedUniqueToken;
