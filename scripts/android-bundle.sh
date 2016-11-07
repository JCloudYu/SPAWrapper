#!/usr/bin/env bash

PREV_DIR=$(pwd);
cd $( dirname "$0" );

# Copy raw data
echo "Copying bundle resources...";

if [ -d "../res/raw" ]; then
	mkdir -p ../platforms/android/res/raw
	rm -rf ../platforms/android/res/raw/*
	cp -rf ../external/raw/* ../platforms/android/res/raw/
else
	echo "Nothing to copy!";
fi;
