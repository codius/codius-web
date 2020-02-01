module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    dashboardUrl: process.env.DASHBOARD_URL,
    paymentPointer: process.env.PAYMENT_POINTER
  }
}
