#!/bin/sh

meteor npm install

PACKAGE_DIRS="../lib:../liboauth:../libext"
METEOR_PACKAGE_DIRS=${PACKAGE_DIRS} meteor --port=9090 --settings=settings.json --allow-incompatible-update --exclude-archs "web.browser.legacy, web.cordova"
