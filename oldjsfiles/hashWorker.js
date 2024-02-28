importScripts('https://cdnjs.cloudflare.com/ajax/libs/jshashes/1.0.8/hashes.min.js');
importScripts('https://cdn.jsdelivr.net/npm/twin-bcrypt@2.1.1/twin-bcrypt.min.js');

const MD5 = new Hashes.MD5;
const SHA1 = new Hashes.SHA1;
const SHA256 = new Hashes.SHA256;
const SHA512 = new Hashes.SHA512;
const RMD160 = new Hashes.RMD160;

let MD5hash = "";
let SHA1hash = "";
let SHA256hash = "";
let SHA512hash = "";
let RMD160hash = "";
let Bcrypthash = "";

let MD5salt = "";
let SHA1salt = "";
let SHA256salt = "";
let SHA512salt = "";
let RMD160salt = "";
let Bcryptsalt = "";

// hashWorker.js
onmessage = function (e) {
    const result = hashAndSaltPassword(e.data);
    postMessage(result);
};

function hashAndSaltPassword(data) {
    const { password, MD5salt, SHA1salt, SHA256salt, SHA512salt, RMD160salt, iterations } = data;

    // Generate unsalted hashes
    MD5hash = "MD5 Hash: " + MD5.hex(password);
    SHA1hash = "SHA1 Hash: " + SHA1.hex(password);
    SHA256hash = "SHA256 Hash: " + SHA256.hex(password);
    SHA512hash = "SHA512 Hash: " + SHA512.hex(password);
    RMD160hash = "RMD160 Hash: " + RMD160.hex(password);
    Bcrypthash = "Bcrypt Hash: " + TwinBcrypt.hashSync(password) + ("\n") + ("\n");

    // Generate salted hashes
    const saltedMD5hash = "MD5 Salted Hash: " + hashWithSalt(MD5, password, MD5salt, iterations) + ("\n");
    const saltedSHA1hash = "SHA1 Salted Hash: " + hashWithSalt(SHA1, password, SHA1salt, iterations) + ("\n");
    const saltedSHA256hash = "SHA256 Salted Hash: " + hashWithSalt(SHA256, password, SHA256salt, iterations) + ("\n");
    const saltedSHA512hash = "SHA512 Salted Hash: " + hashWithSalt(SHA512, password, SHA512salt, iterations) + ("\n");
    const saltedRMD160hash = "RMD160 Salted Hash: " + hashWithSalt(RMD160, password, RMD160salt, iterations) + ("\n");

    return {
        password,
        MD5hash,
        saltedMD5hash,
        SHA1hash,
        saltedSHA1hash,
        SHA256hash,
        saltedSHA256hash,
        SHA512hash,
        saltedSHA512hash,
        RMD160hash,
        saltedRMD160hash,
        Bcrypthash,
    };
}

function hashWithSalt(hashFunction, password, salt, iterations) {
    let hashedPassword = hashFunction.hex(password + salt);

    for (let i = 1; i < iterations; i++) {
        hashedPassword = hashFunction.hex(hashedPassword + salt);
    }

    return hashedPassword;
}