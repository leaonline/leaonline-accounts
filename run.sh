#!/bin/sh

meteor npm install

PACKAGE_DIRS="../lib:../liboauth:../meteor-autoform-themes"
METEOR_PACKAGE_DIRS=${PACKAGE_DIRS} meteor --port=9090 --settings=settings.json
