## Component Snapshot

The following image provides an overview of the components in the system:

![Component Snapshot](images/component-structure.png)

Please refer to this image to understand the different components and their relationships within the system.

### Server Components

[Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) are components that run exclusively on the server. This allows compute-intensive rendering to be handled by the server, which is typically more powerful and closer to your data sources. This approach provides several benefits:

- **Performance**: By sending only the necessary interactive pieces of code to the client, the code bundle size is reduced, improving load times.
- **Security**: Sensitive data and logic are kept on the server, reducing the risk of exposure to the client.
- **Efficiency**: Fetching data closer to the source reduces the time and resources needed for data retrieval.

This combination of benefits makes Server Components a powerful tool for optimizing web application performance and security.

### Client Components

[Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) enable you to create interactive UI elements that are pre-rendered on the server and utilize client-side JavaScript to run in the browser.

To use Client Components, add the React "use client" directive at the top of a file, above your imports.

The "use client" directive establishes a boundary between Server and Client Component modules. By defining "use client" in a file, all modules imported into it, including child components, are considered part of the client bundle.

There are several benefits to doing the rendering work on the client, including:

- **Interactivity**: Client Components can use state, effects, and event listeners, providing immediate feedback to the user and updating the UI in real time.
- **Browser APIs**: Client Components have access to browser APIs, such as geolocation and localStorage, allowing for enhanced functionality and user experience.

### Server Actions

[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) are functions executed on the server. These actions reduce code bundle size and enable developers to separate concerns for data fetching and mutations by offloading the responsibility from the client to the server. Abstracted away by the Next.js framework, clients receive a URL string to the server function and can use it to send a request to the server using RPC.

#### Testing Actions

To test the code with actions, you can use the following `curl` command. This command sends a POST request to your local server, including necessary headers and data.

```sh
curl 'http://localhost:3000/app/dashboard' \
  -H 'Content-Type: text/plain;charset=UTF-8' \
  -H 'Next-Action: ed1b651667133f04fd1536050e2f12929db87fbf' \
  -H "Cookie: authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..YNHd4nx1Pw9O3vvK.2_tRpFpDy8pSPWRT5DSlXo0BRo890aS3oYpVrX2cU1IQVZPprLTl8nlSTLMPWJNd3oOeYZcjswUFyNK1TIhxrTRbdjTWYo1zdYOhRVl1nBi6EDJ2k2foBnR_rrxHK-8JnigFzhB01sBCbcc9_01SgpOaFfGTiGj529C8tdkHRPcQhaPLs1BBmVy3o4bEXbY1B2LYlq2-JQEebGvuhHUS6KC6jDv5eY0JGPKa3LGHJsbr36hqTrZ_y7NzQ4Y5KjApy2cUmg.tOxK5NooCJ_q4YnTGEnOxQ" \
  -X POST --data-raw '["cly5i5d1w0002du3g0vsjn0ro"]'
```

**Sample Output**:

```sh
0: ["$@1", ["development", null]]
1: {"error": {"message": "Failed to checkout pet"}}
```

This command includes:

- **URL**: The endpoint http://localhost:3000/app/dashboard
- **Headers**:
  Content-Type: text/plain;charset=UTF-8
- **Next-Action**: ed1b651667133f04fd1536050e2f12929db87fbf
- **Cookie**: authjs.session-token=<your-session-token>
- **HTTP Method**: POST
- **Payload**: ["cly5i5d1w0002du3g0vsjn0ro"]

Make sure to replace `<your-session-token>` with the actual session token for your testing environment. The output should give you insight into whether the action succeeded or failed, along with any relevant error messages.
