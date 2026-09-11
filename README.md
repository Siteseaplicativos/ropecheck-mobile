# RopeCheck Mobile

Aplicativo móvel para inspeção de cordas/cabos com captura de imagens e sincronização com Supabase.

## 🚀 Funcionalidades

- ✅ Registro de inspeções de cordas/cabos
- ✅ Captura de fotos com câmera
- ✅ Galeria de imagens do celular
- ✅ Histórico completo de inspeções
- ✅ Sincronização em tempo real com Supabase
- ✅ Interface intuitiva e responsiva
- ✅ Compatível com iOS e Android

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)
- Expo CLI: `npm install -g expo-cli`

## 🔧 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Siteseaplicativos/ropecheck-mobile.git
cd ropecheck-mobile
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Supabase

#### a. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Aguarde a inicialização do projeto

#### b. Criar tabela de inspeções

No painel do Supabase, vá para **SQL Editor** e execute:

```sql
-- Criar tabela de inspeções
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rope_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  images TEXT[] DEFAULT '{}',
  date TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice para melhor performance
CREATE INDEX idx_inspections_created_at ON inspections(created_at);

-- Habilitar RLS
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todos os acessos (já que não usamos autenticação)
CREATE POLICY "Enable all access" ON inspections
  FOR ALL USING (true)
  WITH CHECK (true);
```

#### c. Criar bucket de armazenamento

1. Vá para **Storage** no painel Supabase
2. Clique em **Create a new bucket**
3. Nomeie como `inspection-images`
4. Deixe como **Public**

#### d. Configurar arquivo .env

1. Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite `.env` e adicione suas credenciais do Supabase:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Como obter essas informações:**

- No painel Supabase, vá para **Settings** → **API**
- Copie a **URL** (Project URL)
- Copie a chave **anon** (Project API keys)

## ▶️ Executar o App

### No emulador/dispositivo

```bash
npm start
```

Pressione:
- `a` para abrir no Android
- `i` para abrir no iOS
- `w` para web

### Com Expo Go (mais rápido)

1. Instale o app [Expo Go](https://expo.dev/client) no seu celular
2. Execute `npm start`
3. Escaneie o código QR com seu celular

## 📁 Estrutura do Projeto

```
ropecheck-mobile/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Configuração do Supabase
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Tela de histórico
│   │   ├── NewInspectionScreen.tsx
│   │   └── ViewInspectionScreen.tsx
│   └── services/
│       └── inspectionService.ts  # Lógica de API
├── App.tsx                       # Entrada principal
├── app.json                      # Configuração Expo
├── package.json
└── README.md
```

## 🎯 Como Usar

### 1. Criar Nova Inspeção

1. Clique em **"+ Nova"** na tela de inspeções
2. Preencha os campos obrigatórios:
   - Tipo de Corda (Sintética, Natural, Aço, Mista)
   - Condição (Excelente, Bom, Regular, Crítico)
   - Local
3. Adicione observações (opcional)
4. Capture ou selecione imagens
5. Clique em **"Salvar Inspeção"**

### 2. Visualizar Histórico

- A tela inicial mostra todas as inspeções registradas
- Clique em qualquer inspeção para ver detalhes

### 3. Deletar Inspeção

- Clique no botão **"Deletar"** na inspeção desejada
- Confirme a ação

## 🔐 Autenticação e Segurança

Como configurado, o app **NÃO requer autenticação**. Se quiser adicionar autenticação no futuro:

1. Configure as políticas RLS no Supabase
2. Implemente autenticação com email/senha ou social login
3. Restrinja acesso aos dados por usuário

## 🚢 Deploy

### Gerar APK (Android)

```bash
eas build --platform android --profile preview
```

### Gerar IPA (iOS)

```bash
eas build --platform ios --profile preview
```

## 📚 Documentação

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)

## 🐛 Troubleshooting

### Permissões de câmera/galeria não funcionam

- Android: Verifique se as permissões estão declaradas no `app.json`
- iOS: Configure as permissões no `app.json`

### Erro ao conectar com Supabase

- Verifique se as credenciais no `.env` estão corretas
- Verifique se a internet está funcionando
- Confirme que o bucket `inspection-images` existe

### Imagens não aparecem

- Verifique se o bucket é **Public**
- Verifique se as políticas RLS permitem leitura pública

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma [Issue](https://github.com/Siteseaplicativos/ropecheck-mobile/issues).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ por Siteseaplicativos**
