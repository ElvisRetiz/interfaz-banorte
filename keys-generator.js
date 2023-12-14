const openpgp = require('openpgp');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = './keys/santander'

async function generateKeys() {
    let { privateKey, publicKey } = await openpgp.generateKey({
        userIDs: {
            name: 'KIT',
            email: 'eretiz_kit@gpoasshel.com'
        },
        passphrase: 'D4niwlo562#487%&nJH23'
    })
    fs.writeFileSync(path.join(OUTPUT_PATH, 'VesuviusPriv.key'), privateKey);
    fs.writeFileSync(path.join(OUTPUT_PATH, 'VesuviusPub.key'), publicKey);
    console.log(`keys generated  ${path.join(__dirname, 'keys/mecanismos')}`);
}

generateKeys();