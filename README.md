# codius-web

![](https://github.com/codius/codius-web/workflows/Docker%20CI/badge.svg)

Web-monetized Codius service deployment and loading pages.

### Run

```
npm install
npm run build
PAYMENT_POINTER=$codius.example.com npm start
```

### Environment Variables

#### CODIUS_HOST_URI

- Type: String
- Description: Root URI the Codius host

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

Codius host's service deployment page.

This page is web-monetized, and receipts are credited to the web monetization request id balance at the [`RECEIPT_VERIFIER_URI`](#receipt_verifier_uri).

The balance is expected to be debited by the Codius host services are submitted to the [`/services` API](https://github.com/codius/codius-operator/blob/master/README.md#api-documentation).

#### `/{ID}/402`

Codius service balance reload page.

This page is web-monetized, and receipts are credited to the service's balance at the [`RECEIPT_VERIFIER_URI`](#receipt_verifier_uri).

The pages reloads when the balance exceeds the [`REQUEST_PRICE`](#request_price).

#### `/{ID}/503`

Codius service loading page.

This page is web-monetized, and receipts are credited to the service's balance at the [`RECEIPT_VERIFIER_URI`](#receipt_verifier_uri).

The page checks the service's status via the [`/services` API](https://github.com/codius/codius-operator/blob/master/README.md#api-documentation) and reloads when the service is available.
