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

5. Building assets

To make the building tasks easy the project include [laravel-mix](https://github.com/JeffreyWay/laravel-mix), see the [documentation](https://github.com/JeffreyWay/laravel-mix) to learn how to use. All the task are registred in *webpack.mix.js* file.

- In develop mode

    ```shell
    $ npm run dev
    ```

- To rebuild when the files change

    ```shell
    $ npm run watch
    ```

- In production mode

    ```
    $ npm run production
    ```

Also the project provide a single way to build (under development) using [gulp](http://gulpjs.com/) and [rollup](http://rollupjs.org/) in case that you don't want to use *laravel-mix*. All the task are registred in *gulpfile.js* file.

- In develop mode

    ```shell
    $ npm run gdev
    ```

- To rebuild when the files change

    ```shell
    $ npm run gwatch
    ```

- In production mode

    ```shell
    $ npm run gprod
    ```

6. Run de app

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
Generate de Api documentation

    ```shell
    $ npm run docs
    ```

   ​
