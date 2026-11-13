# Ask TastyDose – AI chatbot za stranke

Samostojna stran za klepet (isti stil kot *Swipe your Daily Dose*), ki odgovarja na vprašanja strank
iz baze znanja (tastydose.com + strankam namenjeni deli CS handbooka). Odgovarja v jeziku stranke.

## Datoteke
- `index.html` – stran za klepet (21 jezikov za pozdrav in gumbe, jezik se izbere iz brskalnika; za test dodaj `?lang=de`)
- `api/chat.js` – Vercel funkcija, ki pokliče Claude API
- `lib/knowledge.js` – **baza znanja in pravila bota**. Tukaj urejaš, kaj bot ve (cene, okusi, dostava …).

## Deploy (GitHub + Vercel)
1. Na GitHubu ustvari nov repo, npr. `tastydose-chat`, in naloži vse datoteke (z mapama `api` in `lib`).
2. Na vercel.com: **Add New → Project** → izberi repo → **Deploy** (nastavitve pusti privzete).
3. API ključ: na https://console.anthropic.com → **API Keys → Create Key**, kopiraj ga.
4. V Vercelu: **Project → Settings → Environment Variables** → dodaj
   `ANTHROPIC_API_KEY` = tvoj ključ → **Save**.
5. **Deployments → … → Redeploy**, da se ključ upošteva. Gotovo.

Neobvezno: `CLAUDE_MODEL` (privzeto `claude-haiku-4-5`, hiter in poceni). Za pametnejše odgovore lahko nastaviš `claude-sonnet-4-5`.

## Posodabljanje znanja
Uredi `lib/knowledge.js` (na GitHubu klikni svinčnik), shrani → Vercel sam objavi novo verzijo.
Ko se podatki na spletni strani in v handbooku razlikujejo, velja spletna stran.

## Varnost
- Bot ne vidi naročil in ne more ničesar spreminjati; za naročila usmeri na support@tastydose.com.
- Ne deli kod za popust ali internih podatkov, ne daje zdravniških nasvetov.
- API ključ je samo v Vercelu, nikoli v kodi.
