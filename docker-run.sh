#!/usr/bin/env bash

docker run --name fong-tron \
  --rm \
  -p 3000:3000 \
  chriswininger/fong-tron:local
