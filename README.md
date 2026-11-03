# DUALITY — Gustavo Galeazzi

## Adicionar fotografias sem editar código

Copie suas imagens para **`public/photos/portfolio/`** e atualize a página.
O site identifica as dimensões, monta o catálogo e desativa o aviso de demonstração
automaticamente. Aceita JPG, JPEG, PNG, WebP e AVIF.

Exemplo: `01 - Barcos no lago.jpg` aparece como **Barcos no lago**. Use números
no começo dos nomes para ordenar; subpastas também são aceitas para coleções.
Todas as fotos entram na galeria em grid, com proporções preservadas e carregamento
progressivo durante a rolagem. Clique ou toque em uma imagem para ampliar.

Para remover uma imagem, retire o arquivo da pasta. Se ela ficar vazia, o site volta
às fotos genéricas. No site hospedado, envie os arquivos com o projeto e publique
uma nova versão. Mais detalhes em [COMO-ADICIONAR.md](public/photos/portfolio/COMO-ADICIONAR.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
