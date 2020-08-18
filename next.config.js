module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    paymentPointer: process.env.PAYMENT_POINTER,
    receiptVerifierUri: process.env.RECEIPT_VERIFIER_URI,
    requestPrice: parseInt(process.env.REQUEST_PRICE) || 1
  }
}
