# 🧪 SNABBTEST - Spela för att verifiera allt fungerar

## FÖRBEREDELSE
1. Öppna `index.html` i din webbläsare (Chrome/Firefox/Safari)
2. Öppna Developer Console (F12 eller Cmd+Option+I)
3. Kolla att inga JavaScript-fel visas

## TEST 1: START (2 min)
```
✅ Intro-skärmen visas med titel "1792"
✅ Kan skriva in namn
✅ Klicka "Börja spel"
✅ Hamnar på Norrmalmstorg med beskrivning
✅ Konsolloggar visar:
   - "🎮 Integration loaded"
   - "🎵 Gustafs skål easter egg loaded"
   - "🏆 Expanded Achievements System loaded"
   - "🎭 Environmental Storytelling & 3-Tier Hints loaded"
   - "⏰ Idle timeout hint system active"
```

## TEST 2: KRITISKA BUGFIXAR (5 min)
**Testar de rum vi fixade:**

```
> gå väster
✅ Kommer till "Fredsgatan"
✅ Beskrivning visas (bred gata, Blasieholmen)

> gå in
> höger
✅ Kommer till "Operans korridor"
✅ Beskrivning visas (köks-ljud)

> vänster
> upp
> in
✅ Kommer till "Operans huvudsal"
✅ Beskrivning visas (operasal, scen)

> ut
> ner
> ut
> syd
> öster
> syd
> in
> syd
> norr
✅ Kommer till "Köpmangatan"
✅ Beskrivning visas (smal medeltidsgata)

> syd
> väster
✅ Kommer till "Västerlånggatan"
✅ Beskrivning visas (längsta gatan, stadsmur)
```

## TEST 3: KARAKTÄRER (3 min)
**Testar nya NPCs:**

```
> gå öster
> titta
✅ Ser "Siri Felice och Mina Leonore" i beskrivningen

> prata med siri
✅ Dialog visas om musik och dragspel
✅ Ingen "Du kan fråga om: X, Y, Z" lista (environmental storytelling)

> fråga siri om musik
✅ Längre dialog om hennes passion för musik

> fråga siri om blommor
✅ Får blommor gratis
✅ Achievement: "Blomstervännen" 🌸 unlocked

> prata med mina
✅ Dialog om "Kohs-Pleyare" (cosplay)

> fråga mina om kohs-pleyare
✅ Förklaring av konceptet
```

## TEST 4: ITEMS (2 min)
**Testar nya items:**

```
> norr
> titta
✅ Ser "vaktpost" i rummet

> prata med vaktpost
✅ Dialog fungerar

> undersök snö
✅ Beskrivning: "Smältande snö... marskväll 1792"

> gå in
> undersök ljuskrona
✅ Beskrivning: "Magnifik kristallkrona..."

> titta
✅ Ser "portier" i rummet
```

## TEST 5: HINTS & IDLE (3 min)
**Testar hint-systemet:**

```
> klicka på "💡 Ledtråd" knappen
✅ Får hint nivå 1 (vag ledtråd)

> klicka igen
✅ Får hint nivå 2 (mer specifik)

> klicka igen
✅ Får hint nivå 3 (direkt instruktion)

Vänta 90 sekunder utan input...
✅ Efter 90s: Ledtråd-knappen pulserar med gyllene ljus
✅ Efter 4s: Pulsering slutar
```

## TEST 6: ACHIEVEMENTS (1 min)
```
> skriv "achievements"
✅ Visar lista med 38 achievements
✅ "Blomstervännen" är unlocked
✅ De flesta andra är locked
```

## TEST 7: SAVE/LOAD (1 min)
```
> klicka på "💾 Spara" knappen
✅ Meddelande: "Spelet sparat!"

> refresh sidan (F5)
> klicka "Fortsätt"
✅ Laddar sparad progress
✅ Står fortfarande där du var
✅ Har fortfarande achievements
```

## ⚠️ OM NÅGOT INTE FUNGERAR

**JavaScript-fel i konsolen?**
- Kolla att alla 7 filer laddas (Network tab)
- Kolla exakt felmeddelande
- Rapportera till mig med detaljer

**Rum saknas?**
- Kolla console för fel
- Vilket rum? Vilken exit?
- Rapportera till mig

**Karaktär fungerar inte?**
- Vilket rum?
- Vilken karaktär?
- Vad hände istället?
- Rapportera till mig

## ✅ OM ALLT FUNGERAR

**Gratulerar! Spelet är 100% produktionsfärdigt!**

Nu kan du:
1. Spela igenom hela äventyret (2-3 timmar)
2. Testa alla 6 endings
3. Hitta alla easter eggs
4. Unloca alla 38 achievements
5. Deploya till din Synology NAS

**Eller rapportera tillbaka:** "Allt fungerar perfekt!" 🎉
