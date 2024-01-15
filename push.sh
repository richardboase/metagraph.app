#!/bin/bash

docker build -t smallcontainer gen || exit 10
docker tag smallcontainer europe-west2-docker.pkg.dev/npg-generic/go-gen-test/server:latest || exit 10
docker push europe-west2-docker.pkg.dev/npg-generic/go-gen-test/server:latest