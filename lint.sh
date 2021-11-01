#!/usr/bin/env bash

set -e

FIX_MODE=0

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

if [ "$FIX_MODE" -eq 1 ];
then
    meteor npm run lint:code-fix
    meteor npm run lint:style-fix
    else
    meteor npm run lint:code
    meteor npm run lint:style
fi


meteor npm run lint:markdown
