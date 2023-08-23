#!/bin/bash

if [[ -f './google-translator.zip' ]]; then
  \rm -i './google-translator.zip'
  if [[ -f './google-translator.zip' ]]; then
    echo >&2 'Cannot continue while the old .zip exists'
    exit 1
  fi
fi

echo "Zipping..."
zip -r -q './google-translator.zip' res/ src/ manifest.json