# codius-web

![](https://github.com/codius/codius-web/workflows/Docker%20CI/badge.svg)

Web-monetized Codius balance reload page.

### Run

```
npm install
npm run build
PAYMENT_POINTER=$codius.example.com npm start
```

### Environment Variables

#### PAYMENT_POINTER

- Type: String
- Description: Codius host's [payment pointer](https://paymentpointers.org/).

#### RECEIPT_VERIFIER_URI

- Type: String
- Description: Root URI of the [receipt verifier](https://github.com/coilhq/receipt-verifier)'s `balances` API.

#### REQUEST_PRICE

- Type: Number
- Description: The amount required to have been paid to serve a request. Denominated in the host's asset (code and scale).

### Routes

#### `/`

Balance reload page.

This page is web-monetized, and receipts are credited to the balance at the [`RECEIPT_VERIFIER_URI`](#receipt_verifier_uri).

The page reloads when the balance exceeds the [`REQUEST_PRICE`](#request_price).
