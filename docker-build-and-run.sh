#!/usr/bin/env bash

set -e
./docker-build.sh
./docker-run.sh
set +e