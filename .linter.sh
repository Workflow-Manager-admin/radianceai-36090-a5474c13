#!/bin/bash
cd /home/kavia/workspace/code-generation/radianceai-36090-a5474c13/radianceai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

