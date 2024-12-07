# Gerador de Cardápios

Sistema completo para gerenciamento de cardápios digitais com backend em NestJS e frontend em Next.js.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta AWS (para S3)
- Conta Stripe

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
# Edite o arquivo .env com suas configurações
```

4. Configure o banco de dados:
```bash
cd backend
npm run typeorm migration:run
```

5. Inicie o desenvolvimento:
```bash
# Na raiz do projeto
npm run dev
```

## Estrutura do Projeto

- `/backend` - API NestJS
- `/frontend` - Aplicação Next.js
- `/docs` - Documentação adicional

## Funcionalidades

- Autenticação JWT
- Upload de imagens para S3
- Sistema de assinaturas com Stripe
- Temas claro/escuro
- Drag-and-drop para ordenação
- Atualizações em tempo real via WebSocket
- Analytics
- Backups automáticos

## Segurança

- Rate limiting
- Proteção contra XSS e CSRF
- HTTPS
- Backups automáticos

## Licença

MIT
