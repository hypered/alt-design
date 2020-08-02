#! /usr/bin/env nix-shell
#! nix-shell -i bash -p entr gnumake "haskell.packages.ghc883.ghcWithPackages (pkgs: [pkgs.pandoc])"

# Rebuild the _site/ directory content whenever its sources change.

make entr
