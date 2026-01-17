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

interface ConfigSymbols {
    [language: string]: string;
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

    // try finding the symbol in config first
    const config = vscode.workspace.getConfiguration("tekheader");
    const configSymbols: ConfigSymbols | undefined = config.get("symbols");

    if (configSymbols && language in configSymbols) {
        const symbolType = configSymbols[language];
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (symbol) {
            return symbol.dict;
        }
    }

    if (configSymbols && language in configSymbols) {
        vscode.window.showWarningMessage(
            `The specified symbol for ${language} is incorrect.`,
        );
    }

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (symbol.languages.includes(language)) {
            return symbol.dict;
        }
    }

    let pickerItems = [];

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;
        const upperCaseType =
            symbolType.charAt(0).toUpperCase() + symbolType.slice(1);

        pickerItems.push(`${upperCaseType} (${symbol.toString()})`);
    }

    // If language isn't in defined language list
    let picker = await vscode.window.showQuickPick(pickerItems, {
        title: `Impossible to find the symbols for ${language}. Please select your comment type below.`,
    });
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
