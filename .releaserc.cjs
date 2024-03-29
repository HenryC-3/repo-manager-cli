module.exports = {
    branches: ["master"],
    plugins: [
        [
            "@semantic-release/commit-analyzer",
            {
                preset: "angular",
                releaseRules: [
                    { type: "docs", release: "patch" },
                    { type: "refactor", release: "patch" },
                    { type: "style", release: "patch" },
                    // { type: "chore", release: "patch" },
                    // { type: "ci", release: "patch" },
                    { type: "build", release: "minor" },
                ],
                parserOpts: {
                    noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
                },
            },
        ],
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/github",
            {
                assets: { path: "dist-script/auto-update.js" },
            },
        ],
        "@semantic-release/npm",
        [
            "@semantic-release/git",
            {
                assets: ["package.json"],
                message:
                    "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
        ],
    ],
};
