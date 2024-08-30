
# Shopper API

Este repositório contém a API desenvolvida como parte de um teste técnico. A API foi construída utilizando Node.js, Express e Prisma, com SQLite como banco de dados. A aplicação está completamente dockerizada, permitindo que seja facilmente configurada e executada utilizando Docker e Docker Compose.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução para JavaScript no servidor. 
- **Express**: Framework para Node.js que facilita a criação de APIs REST. 
- **Prisma**: ORM que simplifica as operações de banco de dados. 
- **SQLite**: Banco de dados utilizado para armazenamento de dados. 
- **Docker**: Ferramenta de contêinerização para criar, implantar e executar aplicações


## Configuração e Execução 

### Pré-requisitos 

Antes de começar, você precisa ter o Docker instalado na sua máquina. 

### Passos para executar

1. **Clone o repositório**:

    ```bash
    git clone https://github.com/jionyh/apiShopper.git
    cd apiShopper
    ```

2. **Configure as variáveis de ambiente**:

    Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

    ```bash
    GEMINI_API_KEY=""     # Chave API Gemini
    PORT=3000             # Porta da aplicação (opcional)
    BASE_URL="http://localhost" # Base URL da aplicação (opcional)
    ```
    **Nota:** Certifique-se de preencher a chave `GEMINI_API_KEY` com um valor válido.

3. **Execute a Aplicação**:

    ```bash
    docker-compose up -d
    ```

    Isso iniciará a aplicação e todos os serviços necessários em segundo plano.

## Rotas da API

### 1. Upload de Medição

**Rota:** `POST /upload`

**Descrição:** Envia dados de uma medição para serem salvos.

**Request Body:**

```json
{
  "image": "string",          // imagem em base64
  "customer_code": "string",  // Código do cliente uuid
  "measure_datetime": "string",// Data e hora da medição (ISO 8601)
  "measure_type": "string"    // Tipo de medição GAS ou WATER
}
```
### 1. Confirmação de Medição

**Rota:** `PATCH /confirm`

**Descrição:** Confirma o valor de uma medição existente.

**Request Body:**

```json
{ 
	"measure_uuid": "string", // UUID da medição
	"confirmed_value": 12345 // Valor confirmado
}
```
### 3. Listar Medições

**Rota:** `GET/<customer_code>/list`

**Descrição:** Lista todas as medições para um cliente específico.

**Parâmetros:**
-   `customer_code` (path): Código do cliente.
-   `measure_type` (query opcional): Tipo de medição para filtrar. 

