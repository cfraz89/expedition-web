FROM node:bookworm-slim as builder

RUN corepack enable
COPY . .
RUN pnpm install
RUN pnpm build


FROM node:bookworm-slim as run
COPY --from=builder build build
COPY --from=builder package.json package.json
COPY --from=builder pnpm-lock.yaml pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --prod
CMD ["node", "build"]