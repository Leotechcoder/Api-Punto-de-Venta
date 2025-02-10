import crypto from "crypto"
import xmlbuilder from "xmlbuilder"

export function generateTRA() {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const tra = xmlbuilder
    .create("loginTicketRequest", { version: "1.0", encoding: "UTF-8" })
    .ele("header")
    .ele("uniqueId", Math.floor(now.getTime() / 1000))
    .up()
    .ele("generationTime", now.toISOString())
    .up()
    .ele("expirationTime", tomorrow.toISOString())
    .up()
    .up()
    .ele("service", "wsfe")
    .end({ pretty: true })

  return tra
}

export function signTRA(tra, privateKey) {
  const signer = crypto.createSign("RSA-SHA256")
  signer.update(tra)
  return signer.sign(privateKey, "base64")
}

