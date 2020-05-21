# codius-web
Web-monetized Codius service deployment and loading pages.

### Run

```
npm install
npm run build
PAYMENT_POINTER=$codius.example.com npm start
```

### Environment Variables

#### CODIUS_WEB_URL
* Type: String
* Description: The URL at which to codius-web is being served.

#### PAYMENT_POINTER
* Type: String
* Description: Codius host's [payment pointer](https://paymentpointers.org/).

#### RECEIPT_VERIFIER_URI_PRIVATE
* Type: String
* Description: Root URI of the [receipt verifier](https://github.com/coilhq/receipt-verifier)'s `spend` endpoint.
* Example: `http://receipt-verifier.default.svc.cluster.local:3000`

#### RECEIPT_VERIFIER_URI_PUBLIC
* Type: String
* Description: Root URI of the [receipt verifier](https://github.com/coilhq/receipt-verifier)'s `creditReceipt` endpoint.
* Example: `https://codius.example.com`

#### REQUEST_PRICE
* Type: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
* Description: Amount denominated in the host's wallet account's asset code and scale that must have been paid to serve a request to a Codius service.
* Default: 1

### Routes

#### `/`
Codius host's service deployment page.

This page is web-monetized. Deployment instructions are displayed when payment is verified (by successfully crediting receipt(s) to the web monetization request id balance at the [receipt verifier](https://github.com/coilhq/receipt-verifier)).

The balance is expected to be debited by the Codius host's [authentication token webhook](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) ([implementation](https://github.com/wilsonianb/codius-token-auth-webhook)) when the CREATE request is made to the Kubernetes API server.

#### `/authenticate`
[Forward authentication](https://docs.traefik.io/v1.7/configuration/entrypoints/#forward-authentication) endpoint for requests to a Codius service.

This has been tested with [Traefik v1.7](https://docs.traefik.io/v1.7/configuration/backends/kubernetes/#authentication)

>If the response code is 2XX, access is granted and the original request is performed. Otherwise, the response from the authentication server is returned.

Returns 200 after successfully debiting [`REQUEST_PRICE`](#request-price) from the Codius service's balance at the [receipt verifier](https://github.com/coilhq/receipt-verifier).

Otherwise, returns 303 redirect to `/{ID}/402` if the service's balance is insufficient.

#### `/{ID}/402`
Codius service balance reload page.

This page is web-monetized. The total paid amount and a link to the Codius service are displayed when payment is verified (by successfully crediting receipt(s) to the Codius service's balance at the [receipt verifier](https://github.com/coilhq/receipt-verifier)).
