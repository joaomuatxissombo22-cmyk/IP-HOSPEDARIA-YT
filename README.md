# ZEMAN Trading & Services — Plataforma de Hospedagem & Backoffice

Website corporativo moderno, elegante e responsivo para a empresa **ZEMAN Trading & Services**, com foco na divulgação de serviços de hospedagem, alojamento angolano de luxo, reservas de quartos em Kwanzas (Kz), experiências gastronómicas e painéis de controlo para hóspedes e administração.

---

## 1. Tecnologias Utilizadas

- **Framework Front-End:** React 19 + TypeScript
- **Ferramenta de Build & Bundler:** Vite 8 (Compilação ultra-rápida em SPA estático)
- **Estilos & Design:** Tailwind CSS v4 + Fontes Cormorant Garamond, Plus Jakarta Sans e Alex Brush
- **Ícones:** Lucide React
- **Animações:** Motion
- **Armazenamento de Dados:** Estado reativo sincronizado com `localStorage` com suporte para catálogo de alojamentos, inventário de quartos, bloqueio de datas, reservas, avaliações moderadas, notificações operacionais e mensagens de suporte.

---

## 2. Instalação e Execução Local

### Pré-requisitos
- Node.js versão 18, 20 ou 22
- Gestor de pacotes `npm`

### Passos:
```bash
# 1. Clonar ou descarregar o repositório
git clone https://github.com/SEU-USUARIO/zeman-trading-services.git

# 2. Entrar na pasta do projecto
cd zeman-trading-services

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

O website estará disponível em `http://localhost:3000`.

---

## 3. Preparação e Compilação para Produção

Para gerar os ficheiros prontos para serem hospedados na **Hostinger**:

```bash
# Executa a verificação TypeScript e compila os ficheiros para a pasta /dist
npm run build
```

O comando cria a pasta **`dist/`**, que contém:
- `index.html` (ponto de entrada da aplicação)
- `assets/` (código JavaScript e CSS minificados e com hash de cache)
- `.htaccess` (regras de reescrita Apache/LiteSpeed para evitar erro 404 em SPA)
- Imagens e recursos públicos copiados automaticamente

Para testar a versão compilada localmente antes do deploy:
```bash
npm run preview
```

---

## 4. Publicação no GitHub

Para guardar o código do projecto no GitHub:

### Passo 1: Inicializar o repositório local
```bash
git init
git add .
git commit -m "feat: Versão inicial de produção ZEMAN Trading & Services"
git branch -M main
```

### Passo 2: Conectar ao seu repositório GitHub
Crie um novo repositório vazio no GitHub (ex: `zeman-trading-services`) e execute:
```bash
git remote add origin https://github.com/SEU-USUARIO/zeman-trading-services.git
git push -u origin main
```
*(Substitua `SEU-USUARIO` pelo seu nome de utilizador no GitHub)*.

---

## 5. Como Hospedar na Hostinger

O projecto é uma SPA (Single Page Application) estática de alto desempenho, compatível com **todos os planos da Hostinger** (Single, Premium, Business, Cloud ou VPS).

### Método A: Upload Direto pelo Gestor de Ficheiros do hPanel (Mais Rápido)
1. No seu computador, execute `npm run build`.
2. Entre na pasta `dist/` gerada e compacte todos os ficheiros num arquivo `.zip` (atenção: compacte o **conteúdo** da pasta `dist/`, incluindo o `.htaccess`).
3. Aceda ao painel da Hostinger (**hPanel**): `https://hpanel.hostinger.com`.
4. Vá em **Sites** > Selecione o seu domínio > **Gestor de Ficheiros** (`public_html`).
5. Se existirem ficheiros padrão da Hostinger como `default.php`, pode removê-los.
6. Clique no botão de **Carregar (Upload)** e selecione o ficheiro `.zip`.
7. Clique com o botão direito no `.zip` dentro do gestor de ficheiros e selecione **Extrair**.
8. Confirme que o ficheiro `index.html` e a pasta `assets/` estão diretamente na raiz de `public_html/`.
9. O website está no ar!

---

### Método B: Publicação Automática via GitHub Actions (CI/CD)

O projecto já inclui o fluxo automático em `.github/workflows/deploy-hostinger.yml`.
Sempre que fizer `git push origin main`, o GitHub compila o código e envia os ficheiros automaticamente para a Hostinger via FTP/FTPS seguro.

#### Como configurar os Secrets no GitHub:
1. No seu repositório no GitHub, aceda a **Settings** > **Secrets and variables** > **Actions**.
2. Clique em **New repository secret** e adicione as seguintes 3 variáveis:

| Nome do Secret | Valor a Inserir |
| :--- | :--- |
| `HOSTINGER_FTP_SERVER` | O IP ou Host FTP fornecido no hPanel (ex: `access-XXXXX.webhosting.hostinger.com` ou `ftp.seudominio.com`) |
| `HOSTINGER_FTP_USERNAME` | O seu utilizador de FTP do hPanel (ex: `u123456789`) |
| `HOSTINGER_FTP_PASSWORD` | A palavra-passe da conta de FTP configurada no hPanel |

Após adicionar estas 3 chaves, qualquer alteração enviada para o GitHub atualizará o website na Hostinger em cerca de 1 a 2 minutos sem necessidade de intervenção manual!

---

## 6. Configuração de Domínio e Certificado SSL na Hostinger

1. **Apontamento de DNS:**
   - Registo **Tipo A**: `@` a apontar para o endereço IPv4 da sua conta Hostinger.
   - Registo **Tipo CNAME**: `www` a apontar para `@` ou para o seu domínio.
2. **Ativação do SSL Gratuito:**
   - No hPanel da Hostinger, vá a **Segurança** > **SSL**.
   - Ative o **Certificado Let's Encrypt Gratuito** com renovação automática.
   - Ative a opção **Forçar HTTPS** (o nosso ficheiro `.htaccess` também reforça este redirecionamento automaticamente).

---

## 7. Ficheiro `.htaccess` (Roteamento SPA)

Para garantir que o recarregamento de páginas ou o acesso direto a rotas não resulte no erro `404 Not Found` no servidor LiteSpeed/Apache da Hostinger, o ficheiro `/public/.htaccess` é copiado automaticamente durante o build com a seguinte regra:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 8. Código e Guias Integrados no Painel Administrativo

Pode consultar todos os comandos Git, o ficheiro `.htaccess` e o workflow GitHub Actions a qualquer momento dentro da aplicação acedendo ao **Painel Administrativo** > aba **"Publicação & Deploy"**.

---

## 9. Suporte & Contactos da Empresa

- **Empresa:** ZEMAN Trading & Services
- **Localização:** Rotunda do Fubu sentido Talatona (oposto ao supermercado Eskebra), Luanda, Angola
- **Contactos:** +244 923 000 000 / +244 912 000 000
