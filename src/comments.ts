import * as vscode from "vscode";

class DefaultComment {
    top: string;
    middle: string;
    bottom: string;
    languages: ReadonlyArray<string>;

    constructor(
        top: string,
        middle: string,
        bottom: string,
        languages: ReadonlyArray<string> = [],
    ) {
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
        this.languages = languages;
    }

    get dict() {
        return { top: this.top, middle: this.middle, bottom: this.bottom };
    }

    toString() {
        return `${this.top}, ${this.middle}, ${this.bottom}`;
    }
}

export async function getCommentSymbols(language: string) {
    const symbols = {
        slash: new DefaultComment("/*", "**", "*/", [
            "c",
            "cpp",
            "css",
            "go",
            "java",
            "javascript",
            "typescript",
            "rust",
        ]),
        hash: new DefaultComment("##", "##", "##", [
            "dockerfile",
            "makefile",
            "python",
            "shellscript",
        ]),
        dash: new DefaultComment("{-", "--", "-}", ["haskell"]),
        semicolon: new DefaultComment(";;", ";;", ";;", ["ini", "lua"]),
    };

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (symbol.languages.includes(language)) {
            return symbol.dict;
        }
    }

    // If language isn't in defined language list
    let picker = await vscode.window.showQuickPick(
        [
            `Slash (C, JS, TS...) (${symbols.slash.toString()})`,
            `Hash (Dockerfile, Makefile, Python...) (${symbols.hash.toString()})`,
            `Dash (Haskell) (${symbols.dash.toString()})`,
            `Semicolon (ini, lua) (${symbols.semicolon.toString()})`,
        ],
        {
            title: "Couldn't find the language in the defined languages list. Please select your comment type below",
        },
    );
    if (!picker) {
        return undefined;
    }

    picker = picker.toLowerCase();

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (picker.includes(symbolType.toLowerCase())) {
            return symbol.dict;
        }
    }
    return undefined;
}
