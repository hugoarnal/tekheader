# tekheader
Add the Epitech Header to your files.

<details>
    <summary>
        Made as a drop-in replacement to <a href="https://marketplace.visualstudio.com/items?itemName=ben.epiheader">ben.epiheader</a>
    </summary>
I made this extension because I had a problem, the header was returning the wrong year.

![Epitech Header showing 2024 instead of 2025](https://github.com/user-attachments/assets/dc09775f-290e-43ed-ae46-84e42eac984a)

In the code of ben.epiheader, there was this getYear function:
```js
return moment().subtract(6, 'months').format("YYYY");
```
which in February 2025 returned `2024`.

Not only that but the extension wasn't updated in years (hopefully Ben graduated successfully from Epitech since :)) but it's not longer open source :(
</details>

# Default keybinds
`tekheader.addHeader`: `ctrl+alt+h` (Linux & Windows), `cmd+alt+h` (Mac)

# Supported languages
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

# Local dev installation
Tested on [nvm](https://nvm.sh) v18.20.6
```sh
git clone https://github.com/hugoarnal/tekheader.git
npm install
```
