#!/usr/bin/env sh
set -eux -o pipefail
pnpm --package dotenv-cli dlx dotenv -- bash -c 'nerdctl build . -t expedition-web \
  --build-arg "PUBLIC_MAPBOX_ACCESS_TOKEN=$PUBLIC_MAPBOX_ACCESS_TOKEN" \
  --build-arg "PUBLIC_GOOGLE_API_KEY=$PUBLIC_GOOGLE_API_KEY" \
  --build-arg "PUBLIC_BACKEND_ORIGIN=$PUBLIC_BACKEND_ORIGIN" \
  --build-arg "PUBLIC_KRATOS_ORIGIN=$PUBLIC_KRATOS_ORIGIN" \
  '
nerdctl save expedition-web | sudo nerdctl --address /var/run/k3s/containerd/containerd.sock --namespace k8s.io load