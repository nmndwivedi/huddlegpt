export function sign() {
  var crypto = require("crypto");

  var algorithm = "aes256";
  var inputEncoding = "utf8";
  var outputEncoding = "hex";
  var ivlength = 16; // AES blocksize

  const key = crypto.randomBytes(16).toString("hex");
  // var key = Buffer.from("ciw7p02f70000ysjon7gztjn7c2x7GfJ", "latin1"); // key must be 32 bytes for aes256
  var iv = crypto.randomBytes(ivlength);

  var text = "72721827b4b4ee493ac09c635827c15ce014c3c3";

  console.log('Ciphering "%s" with key "%s" using %s', text, key, algorithm);

  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var ciphered = cipher.update(text, inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);
  var ciphertext = iv.toString(outputEncoding) + ":" + ciphered;

  console.log('Result in %s is "%s"', outputEncoding, ciphertext);

  var components = ciphertext.split(":");
  var iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
  var decipher = crypto.createDecipheriv(algorithm, key, iv_from_ciphertext);
  var deciphered = decipher.update(
    components.join(":"),
    outputEncoding,
    inputEncoding
  );
  deciphered += decipher.final(inputEncoding);

  console.log(deciphered);
}
