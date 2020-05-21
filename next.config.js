module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    codius_web_url: process.env.CODIUS_WEB_URL,
    paymentPointer: process.env.PAYMENT_POINTER,
    receiptVerifierUriPrivate: process.env.RECEIPT_VERIFIER_URI_PRIVATE,
    receiptVerifierUriPublic: process.env.RECEIPT_VERIFIER_URI_PUBLIC,
    requestPrice: process.env.REQUEST_PRICE || "1"
  }
}
