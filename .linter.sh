#!/bin/bash
cd /home/kavia/workspace/code-generation/polylingo-connect-35265-ebf1c8f6/polylingo_connect
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

