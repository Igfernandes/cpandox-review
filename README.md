
# C.Pandox - Marketplace de Desejos Inusitados

Este é o código fonte oficial do **C.Pandox**, uma plataforma P2P (Peer-to-Peer) focada em serviços excêntricos e demandas únicas, integrada com IA para moderação e criatividade.

## 📱 Transformando em APK (Android)

Este projeto está pronto para ser convertido em um aplicativo nativo usando **Capacitor**.

### Pré-requisitos
- Node.js instalado
- Android Studio instalado

### Passo a Passo

1. **Instale as dependências:**
   ```bash
   npm install
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Inicialize o Capacitor:**
   ```bash
   npx cap init c.pandox com.cpandox.app --web-dir=dist
   ```

3. **Gere a versão de produção (Build):**
   ```bash
   npm run build
   ```

4. **Adicione o Android:**
   ```bash
   npx cap add android
   ```

5. **Sincronize e Abra no Android Studio:**
   ```bash
   npx cap sync
   npx cap open android
   ```

6. **Gerar APK Final:**
   Dentro do Android Studio, vá em `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## 🛠 Tecnologias Usadas

- **Frontend:** React 19, Tailwind CSS
- **Ícones:** Lucide React
- **IA:** Google Gemini (Moderação de Conteúdo e Melhoria de Texto)
- **Backend (Opcional):** Supabase (configurável em `constants.ts`)
- **Mobile:** Capacitor (para gerar APK/IPA)

## 📁 Estrutura de Pastas

- `/src`: Código fonte principal
  - `/components`: Componentes visuais reutilizáveis
  - `/services`: Lógica de negócios e APIs
  - `/types`: Definições de TypeScript
- `index.html`: Ponto de entrada com configurações de meta tags mobile

## ⚠️ Notas de Segurança

O aplicativo possui um modo de "Cofre" simulado para transações seguras. Em produção, recomenda-se integrar com um Gateway de Pagamento Real (ex: Stripe, Mercado Pago ou API Pix do Banco Central).
