install:
	pnpm install --shamefully-hoist

up: install
	pnpm dev
