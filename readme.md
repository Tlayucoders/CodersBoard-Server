# CodersBoard

Board to track people from online algorithms judges like UVA Online Judge and COJ.

## Requeriments

- NodeJS v7.6.0 or higher for ES2015 and async function support
- MongoDB v3.4.2

## Installation

1. Clone the repository

   ```shell
   $ git clone --depth=1 https://github.com/EsauPR/CodersBoard.git
   ```

2. Install the dependencies with *npm* or *yarn*

   ```shell
   $ npm install
   ```

3. Copy the default environment file *.env-example* and rename it to *.env* in the root directory, and change the values of the variables if is necessary.

    ```shell
    $ cp .env-example .env
    ```

4. Generate Application token

    ```shell
    $ npm run token
    ```

5. Run de app

   **Development**

   ```shell
   $ npm run start
   ```
   **Development** (with nodemon)

   ```shell
   $ npm run develop
   ```

   **Production**

   Compile the app with babel

   ```shell
   $ npm run build
   ```

   Run the app

   ```shell
   $ node dist/index.js
   ```

### API documentation
- Generate de Api documentation

    ```shell
    $ npm run docs
    ```
