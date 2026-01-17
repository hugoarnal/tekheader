# tekheader

Add the Epitech Header to your files.

### [Open VSX Marketplace Link (VSCodium)](https://open-vsx.org/extension/hugoarnal/tekheader)

### [VSCode Marketplace Link](https://marketplace.visualstudio.com/items?itemName=hugoarnal.tekheader)

## Default keybinds

`tekheader.addHeader`: `ctrl+alt+h` (Linux & Windows), `cmd+alt+h` (Mac)

## Configuration

You can specify symbols for specific languages in your `User.json` file (found in `Open User Settings (JSON)`):

```json
{
    "tekheader.symbols": {
        "plaintext": "dash"
    }
}
```

## Supported languages

**Slash comments (/\*, \*\*, \*/):**
C, C++, CSS, Go, Java, JavaScript, TypeScript, Rust

**Hash comments (##):**
Dockerfile, Makefile, Python, Shell Script

**Dash comments (--):**
Haskell

**Semicolon comments (;;):**
Ini, Lua

**Language not in supported list? Do not worry**

You will be prompted with the closest comment choice and it's up to you to choose.

## Local dev installation

Tested on [nvm](https://nvm.sh) v18.20.6

```sh
git clone https://github.com/hugoarnal/tekheader.git
npm install
npm run package
```
