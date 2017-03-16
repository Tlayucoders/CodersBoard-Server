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

3. Copy the default environment file *config/system_variables_example.json* and rename it to *system_variables.json* in the config directory, and change the values of the variables if is necessary.

    ```shell
    $ cp config/system_variables_example.json config/system_variables.json
    ```

4. Run de app

   ```shell
   $ npm run start
   ```
