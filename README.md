# Publicação e atualização

O painel é publicado gratuitamente pelo GitHub Pages. Os textos, números, projetos e links exibidos na tela ficam em `data/humani.json`.

## Atualizar pelo site do GitHub

1. Abra o repositório no GitHub.
2. Entre na pasta `data` e abra `humani.json`.
3. Clique no lápis, chamado **Edit this file**.
4. Altere somente os valores depois dos dois-pontos, preservando aspas, vírgulas e chaves.
5. Clique em **Commit changes**.
6. Aguarde a execução **Publicar no GitHub Pages** terminar na aba **Actions**.

Cada commit na branch `main` recompila e publica a página automaticamente. O histórico do GitHub permite consultar ou restaurar versões anteriores.

## Atualizar pelo computador

Edite `data/humani.json` e confira o resultado com:

```bash
npm run dev
```

Depois publique:

```bash
git add data/humani.json
git commit -m "Atualiza dados do Humani"
git push
```

## Primeira publicação

1. No GitHub, abra **Settings**.
2. Acesse **Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
4. Faça um push para `main` ou execute o fluxo manualmente pela aba **Actions**.

O endereço do site aparecerá em **Settings > Pages** depois da primeira publicação.
