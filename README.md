## Features

1. auto commit in super project when running `git commit -m msg` in the submodule.
2. stop commit when entering `ROOT_SUPER_PROJECT`

## Issues

1.  hard to ship ESM bundle, see [How to fix "Dynamic require of "os" is not supported" · Issue #1921 · evanw/esbuild](https://github.com/evanw/esbuild/issues/1921)
2.  can't use top level `await`, due to the previous issue
