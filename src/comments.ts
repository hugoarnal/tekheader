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

enum ConfigError {
    IncorrectConfig,
}

type ConfigResult = DefaultComment | ConfigError | undefined;

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

async function showPicker(language: string) {
    let pickerItems = [];

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;
        const upperCaseType =
            symbolType.charAt(0).toUpperCase() + symbolType.slice(1);

        pickerItems.push(`${upperCaseType} (${symbol.toString()})`);
    }

    const picker = await vscode.window.showQuickPick(pickerItems, {
        title: `Impossible to find the symbols for ${language}. Please select your comment type below.`,
    });
    if (!picker) {
        return undefined;
    }
    return picker.toLowerCase();
}

function findFromPicker(picker: string, configSymbols: ConfigResult) {
    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (picker.includes(symbolType.toLowerCase())) {
            if (configSymbols === undefined) {
                // TODO: make this a Yes/No/Don't ask again notification w/automatic save in config
                vscode.window.showInformationMessage(
                    "You can always specify the symbols for your language in your settings. See the TekHeader extension README for more information.",
                );
            }
            return symbol.dict;
        }
    }
    return undefined;
}

function getFromConfig(language: string): ConfigResult {
    const config = vscode.workspace.getConfiguration("tekheader");
    const configSymbols: ConfigSymbols | undefined = config.get("symbols");

    if (configSymbols && language in configSymbols) {
        const symbolType = configSymbols[language];
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (symbol) {
            return symbol;
        } else {
            vscode.window.showWarningMessage(
                `The specified symbol for ${language} is incorrect.`,
            );
            return ConfigError.IncorrectConfig;
        }
    }
    return undefined;
}

export async function getCommentSymbols(language: string) {
    const configSymbols = getFromConfig(language);

    if (configSymbols instanceof DefaultComment) {
        return configSymbols.dict;
    }

    for (const symbolType of Object.keys(symbols)) {
        const symbol = symbols[
            symbolType as keyof Object
        ] as unknown as DefaultComment;

        if (symbol.languages.includes(language)) {
            return symbol.dict;
        }
    }

    let picker = await showPicker(language);
    if (!picker) {
        return undefined;
    }

    return findFromPicker(picker, configSymbols);
}
