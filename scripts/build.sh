#! /usr/bin/env nix-shell
#! nix-shell -i bash -p entr gnumake "haskell.packages.ghc883.ghcWithPackages (pkgs: [pkgs.pandoc])"

mkdir -p _site
cp -r static _site/
make entr
