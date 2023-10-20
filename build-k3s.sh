#!/usr/bin/env sh
set -eux -o pipefail
nerdctl build . -t expedition-web:latest
nerdctl save expedition-web:latest | sudo nerdctl --address /var/run/k3s/containerd/containerd.sock --namespace k8s.io load