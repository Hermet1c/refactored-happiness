const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!"Â£$%^&*(),./<>?;\'#:@~[]{}-=_+ '

function encrypt(text, key) {
    const keyArray = atob(key).split('')
    const encrypted = []
    text.split('').forEach(i => {
        const index = keyArray.indexOf(i)
        if (index + 1 >= alphabet.length) {
            encrypted.push(keyArray[0])
        } else {
            encrypted.push(keyArray[index + 1])
        }
    });
    return btoa(encrypted.join('')).replace(/=/g, '')
}
function keyGen() {
    const shuffledArray = alphabet.split('').sort(() => Math.random() - 0.5)
    return btoa(shuffledArray.join('')).replace(/=/g, '')
}

function decrypt(encryptedText, key) {
    const text = atob(encryptedText)
    const keyArray = atob(key).split('')
    const decrypted = []
    text.split('').forEach(i => {
        const index = keyArray.indexOf(i)
        if (index == 0) {
            decrypted.push(keyArray[keyArray.length-1])
        } else {
            decrypted.push(keyArray[index - 1])
        }
    });
    return decrypted.join('')
}

module.exports = {decrypt, keyGen, encrypt}
