#!/usr/bin/env bash

Port="${Port:-3000}"
Interaction_Timeout="${Interaction_Timeout:-50000}"

export Port
export Interaction_Timeout

node ./server/galleryServer.js
