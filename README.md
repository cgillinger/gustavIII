# 1792: Mordet på Gustav III

Ett immersivt historiskt textäventyr där du är en tidsresenär som måste förhindra mordet på kung Gustav III.

## 🎮 Spela nu

Öppna `index.html` i en webbläsare - inga beroenden eller byggsystem behövs!

## 📦 Installation på server

### På Linux-server:
```bash
# Kopiera filerna till din webbkatalog
cp index.html style.css game.js /var/www/html/gustav/

# Eller kör med Python
python3 -m http.server 8000
# Besök sedan http://localhost:8000
```

### På Synology NAS:
1. Öppna **File Station**
2. Gå till **web** (eller skapa en ny mapp)
3. Ladda upp `index.html`, `style.css` och `game.js`
4. Aktivera **Web Station** i paketcentret
5. Besök `http://[din-synology-ip]/gustav/`

### Med Docker:
```bash
docker run -d -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx
```

## 🎯 Spelmekanik

### Grundläggande kommandon:
- **titta** / **se omkring** - Undersök rummet
- **gå [riktning]** - Förflytta dig (norr, söder, öster, väster, in, ut)
- **undersök [sak]** - Granska något närmare
- **ta [sak]** - Plocka upp ett föremål
- **prata med [person]** - Samtala med karaktärer
- **använd [sak]** - Använd ett föremål
- **inventarie** - Se vad du bär på
- **hjälp** - Visa hjälpmenyn

### Funktioner:
- ✅ **Auto-sparning** - Spelet sparas automatiskt efter varje kommando
- 💡 **Hint-system** - Fastnat? Tryck på "Ledtråd"-knappen
- ⭐ **Achievements** - Lås upp prestationer när du framskrider
- 📊 **Progress tracking** - Se din framgång i progressbaren
- 💾 **Manuell sparning** - Spara och ladda när du vill

## 🗺️ Storyline

**14 mars 1792** - Du landar i Stockholm, två dagar före mordet på Gustav III.

**Ditt uppdrag:**
1. Anpassa dig till 1792 års Stockholm (tidsenliga kläder!)
2. Samla information om konspirationen
3. Identifiera Jacob Johan Anckarström
4. Få tillträde till maskeradbalen den 16 mars
5. Förhindra mordet

## 🎭 Karaktärer

Möt historiska personer:
- **Gustav III** - Sveriges kung, 46 år
- **Carl Michael Bellman** - Den berömde skalden
- **Carl Fredrik Adelcrantz** - Operans arkitekt
- **Jacob Johan Anckarström** - Attentatsmannen
- **Adolph Ribbing & Claes Fredrik Horn** - Medsammansvurna
- **Hans Henric von Essen** - Kungens förtrogen
- ...och många fler!

## 🏛️ Platser att utforska

- **Norrmalmstorg** - Torget framför Operan
- **Kungliga Operan** - Där mordet kommer ske
- **Den Gyldene Freden** - Historisk krog i Gamla stan
- **Norrbro & Stockholms slott** - Kungens residens
- **Gamla stan** - Stockholms medeltida hjärta
- ...och fler platser som låses upp under spelets gång

## 📚 Historisk autenticitet

Spelet är baserat på verkliga händelser:
- Alla karaktärer är historiska personer
- Platsbeskrivningar bygger på faktiska arkitekturdetaljer
- Tidstypiska immersiva detaljer (dofter, ljud, miljö)
- Autentiska dialoger baserade på historiska källor

## 🎨 Design

- **Retro-inspirerad** design med modern UX
- **Responsiv** - fungerar på desktop, tablet och mobil
- **Tillgänglig** - tydlig typografi och hög kontrast
- **Atmosfärisk** - guldtoner och 1700-talskänsla

## 🔧 Teknisk info

- **Inga beroenden** - Ren HTML, CSS och JavaScript
- **localStorage** för sparade spel
- **Vanilla JS** - ingen framework krävs
- **< 100 KB** total filstorlek

## 🚀 Vidareutveckling

Möjliga utökningar:
- Fler dagar och kapitel
- Alternativa slut beroende på spelarens val
- Ljud och musik från 1700-talet
- Illustrationer av karaktärer och platser
- Flerspråkigt stöd (engelska, etc.)
- Mer komplexa pussel och sidouppdrag

## 📜 Licens

Detta är ett utbildningsprojekt baserat på historiska händelser i det offentliga rummet.

---

**Lycka till med din tidsresa till 1792!** 🕰️👑
