# CCB - Portal de Estudos Musicais & Orquestra (Hinário 5, MSA & Métodos)

Web application interativa desenvolvida como **produção independente** voltada para a gestão pedagógica e acompanhamento de alunos, candidatos e instrutores que estudam para ingressar ou se aperfeiçoar na orquestra da **Congregação Cristã no Brasil (CCB)**. Sem vínculo institucional oficial.

---

## 🏛️ Arquitetura do Sistema

```
AWS Amplify (Hospedagem e CI/CD do Frontend SPA)
       ↓
React 19 + TypeScript + Vite + Tailwind CSS (Estilo PrimeFaces Jakarta)
       ↓
┌─────────────────────────┬─────────────────────────┐
│ Firebase Authentication │     Cloud Firestore     │
│ (E-mail/Senha + Roles)  │ (Cadastros e Progresso) │
└─────────────────────────┴─────────────────────────┘
```

- **Hospedagem & Deploy**: Exclusivamente no **AWS Amplify Hosting**.
- **Autenticação**: **Firebase Authentication** com separação estrita de perfis (`admin` e `aluno`).
- **Banco de Dados**: **Cloud Firestore** otimizado para baixíssimo consumo de leituras (agregados denormalizados no documento do aluno).

---

## 🎯 Principais Funcionalidades

### 1. Área Administrativa (`/admin`)
- **Dashboard Executivo**: Indicadores em tempo real (Total de Alunos, Alunos Ativos, Hinos em Progresso, Hinos Concluídos).
- **Gestão de Alunos (`/admin/alunos`)**:
  - Busca instantânea por nome, e-mail e telefone.
  - Filtro por instrumento oficial (Violino, Viola, Cello, Contrabaixo, Madeiras, Metais, etc.).
  - Ordenação por nome e percentual de evolução.
  - **Cadastro de Aluno em 1 Toque**: Criação de usuário no Firebase Auth e Firestore sem desconectar a sessão do administrador.
- **Página de Detalhes do Aluno (`/admin/alunos/:id`)**:
  - Ficha cadastral completa e gráficos de evolução.
  - Gerenciamento dos 480 hinos do aluno: ajuste de status (*Não iniciado*, *Em aprendizado*, *Em progresso*, *Concluído*) e percentual de domínio musical (0 a 100%).

### 2. Área do Aluno (`/aluno`)
- **Painel Pessoal**: Indicadores de avanço individual, hinos aprendidos e metas para a orquestra.
- **Meus Hinos (`/aluno/progresso`)**:
  - Visualização interativa dos 480 hinos com armaduras e acidentes transpostos especificamente para o instrumento do aluno.
  - Filtro dinâmico que exibe apenas os acidentes que realmente existem no Hinário para aquele instrumento.
  - Marcação rápida de estudos sincronizada com o banco de dados em nuvem.
- **Meu Perfil (`/aluno/perfil`)**:
  - Edição de nome, telefone e instrumento oficial.

### 3. Design PrimeFaces Jakarta
- Tipografia oficial **Plus Jakarta Sans** (Google Fonts).
- Paleta corporativa PrimeTek com suporte nativo a **Modo Claro** e **Modo Escuro**.
- Componentes elegantes (`p-menubar`, `p-card`, `p-selectbutton`, `p-tag`, `p-progressbar`, `p-dialog`).

---

## ⚙️ Configuração do Firebase & AWS Amplify

### 1. Criar o Projeto no Firebase Console
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto.
2. Em **Authentication** > **Sign-in method**, ative o provedor **E-mail/senha**.
3. Em **Firestore Database**, crie o banco de dados em modo de produção.
4. Na aba **Regras** do Firestore, copie e cole o conteúdo do arquivo `firestore.rules` deste repositório e clique em **Publicar**.

### 2. Variáveis de Ambiente no AWS Amplify
No console da AWS Amplify, acesse seu aplicativo > **Environment variables** (Variáveis de ambiente) e adicione:

| Variável | Descrição |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Chave de API web do Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação (ex: `seu-projeto.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto no Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID do remetente de mensagens |
| `VITE_FIREBASE_APP_ID` | ID do aplicativo Web Firebase |

---

## 👑 Como Configurar o Primeiro Administrador

Por segurança, o primeiro administrador deve ser inicializado pelo Firebase Console (impedindo que qualquer usuário altere seu próprio role no frontend):

1. No Firebase Console, vá em **Authentication** > **Users** > **Adicionar usuário**.
2. Cadastre o e-mail e senha do administrador (ex: `admin@exemplo.com`).
3. Copie o **UID do Usuário** gerado.
4. Vá em **Firestore Database** > Inicie a coleção **`users`**.
5. Crie um documento com o **ID do documento = UID copiado**.
6. Preencha os campos abaixo:
```json
{
  "uid": "COLE_O_UID_AQUI",
  "name": "Administrador CCB",
  "email": "admin@exemplo.com",
  "phone": "(11) 99999-9999",
  "instrument": "Outro",
  "role": "admin",
  "totalHinos": 480,
  "hinosConcluidos": 0,
  "hinosEmProgresso": 0,
  "progressoGeral": 0
}
```
7. Pronto! Ao acessar `/login` com essas credenciais, o sistema reconhecerá o perfil como `admin` e redirecionará para `/admin`.

---

## 🚀 Execução Local

```bash
# Clone o repositório
git clone https://github.com/GabrielWire/ricci.git
cd ricci

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev -- --host
```

Acesse em seu navegador em `http://localhost:5173/`.
