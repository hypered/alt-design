#! /usr/bin/env nix-shell
#! nix-shell -i bash -p entr gnumake pandoc

# Rebuild the _site/ directory content whenever its sources change.

make entr
