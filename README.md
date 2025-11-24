## Configurando o projeto em dev

### Clone o repositório `texas-poker`
O repositório `texas-poker` contém a configuração do docker-compose e as envs necessárias para subir local

- SSH:
```bash
git clone git@github.com:gabriela-restani/texas-poker.git
```

- HTTPS:
```bash
git clone https://github.com/gabriela-restani/texas-poker.git
```

### Clone o backend e o frontend dentro de texas-poker
Dentro do repositório `texas-poker`, clone o backend:

- SSH
```bash
git clone git@github.com:gabriela-restani/texas-poker-backend.git
```

- HTTPS:
```bash
git clone https://github.com/gabriela-restani/texas-poker-backend.git
```

E esse repositório do frontend:

- SSH:
```bash
git clone git@github.com:gabriela-restani/texas-poker-client.git
```

-HTTPS:
```bash
git clone https://github.com/gabriela-restani/texas-poker-client.git
```

### Subindo a aplicação
Dentro do repositório `texas-poker`, execute:

```bash
docker compose up texas-poker-client
```

Esse comando vai subir o frontend, backend, banco de dados postgres e o redis.

Após subir o projeto, basta acessar `http://localhost:3050` ou a porta configurada nas envs.

## Melhorias que precisam ser feitas:

- [] Adicionar cobertura de testes
- [] Deixar de fazer pooling no RoomList e converter em SSE (aguardar a notificação do server de novas adições de salas)
- [] Melhorar a UI e UX do jogo
- [] Deixar a aplicação responsiva
- [] Corrigir warnings de hidratação
- [] Refatorar a página GamePage, pois está com muitas responsabilidades
- [] CI/CD
- [] Pipeline de Deploy