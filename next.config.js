module.exports = {
  assetPrefix: `${process.env.CODIUS_HOST_URI}`,
  crossOrigin: 'anonymous',
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    codiusHostURI: process.env.CODIUS_HOST_URI,
    paymentPointer: process.env.PAYMENT_POINTER,
    receiptVerifierUri: process.env.RECEIPT_VERIFIER_URI,
    requestPrice: parseInt(process.env.REQUEST_PRICE) || 1
  },
  experimental: {
    async headers () {
      return [
        {
          source: '/(.*)?',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*'
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET'
            }
          ]
        }
      ]
    }
  }
}
