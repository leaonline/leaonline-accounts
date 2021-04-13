#!/usr/bin/env bash

set -e

while getopts "f" opt; do
  case $opt in
    f)
	  FIX_MODE=1
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

if [ "FIX_MODE" -eq "0" ];
then
    meteor npm run lint:code
    meteor npm run lint:style
    else
    meteor npm run lint:code-fix
    meteor npm run lint:style-fix
fi


meteor npm run lint:markdown
