import * as vscode from "vscode";

const ct = {
    slash: {
        top: "/*",
        middle: "**",
        bottom: "*/",
    },
    hash: {
        top: "##",
        middle: "##",
        bottom: "##",
    },
    dash: {
        top: "--",
        middle: "--",
        bottom: "--",
    },
    semicolon: {
        top: ";;",
        middle: ";;",
        bottom: ";;",
    },
};

export async function getCommentSymbols(language: string) {
    const slashLang = [
        "c",
        "cpp",
        "css",
        "go",
        "java",
        "javascript",
        "typescript",
        "rust",
    ];
    const hashLang = ["dockerfile", "makefile", "python", "shellscript"];
    const dashLang = ["haskell"];
    const semicolonLang = ["ini", "lua"];

    if (slashLang.includes(language)) {
        return ct.slash;
    }
    if (hashLang.includes(language)) {
        return ct.hash;
    }
    if (dashLang.includes(language)) {
        return ct.dash;
    }
    if (semicolonLang.includes(language)) {
        return ct.semicolon;
    }

    // If language isn't in defined language list
    let picker = await vscode.window.showQuickPick(
        [
            `Slash (C, JS, TS...) (${ct.slash.top}, ${ct.slash.middle}, ${ct.slash.bottom})`,
            `Hash (Dockerfile, Makefile, Python...) (${ct.hash.top}, ${ct.hash.middle}, ${ct.hash.bottom})`,
            `Dash (Haskell) (${ct.dash.top}, ${ct.dash.middle}, ${ct.dash.bottom})`,
            `Semicolon (ini, lua) (${ct.semicolon.top}, ${ct.semicolon.middle}, ${ct.semicolon.bottom})`,
        ],
        {
            title: "Couldn't find the language in the defined languages list. Please select your comment type below",
        },
    );
    if (!picker) {
        return ct.slash;
    }
    picker = picker.toLowerCase();
    if (picker.includes("slash")) {
        return ct.slash;
    }
    if (picker.includes("hash")) {
        return ct.hash;
    }
    if (picker.includes("dash")) {
        return ct.dash;
    }
    if (picker.includes("semicolon")) {
        return ct.semicolon;
    }
    return ct.slash;
}
