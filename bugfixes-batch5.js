// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 5 - Dialog, navigation och InvisiClues-ledtrådar
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. Portierens dialog - mer trovärdig reaktion på moderna kläder
// 2. Ledtråd säger VÄNSTER (inte IN) för personalkorridoren
// 3. Ta bort "in" som utgång i personalkorridoren (bara "vänster")
// 4. Förbättra dialog-flöde med successiva antydningar
// 5. Implementera tre-nivå ledtrådssystem (InvisiClues-stil)
//
// Baserat på Infocoms InvisiClues-system:
// - Nivå 1: Poetisk antydan (atmosfär)
// - Nivå 2: Tydligare riktning (utan att ge bort)
// - Nivå 3: Direkt lösning (explicit)
//
// Loading: 1400ms - Efter bugfixes-batch4
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 5...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: PORTIERENS DIALOG - TROVÄRDIG REAKTION PÅ MODERNA KLÄDER
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined' && Characters.portier) {
            Characters.portier.dialogue = Characters.portier.dialogue || {};

            // Dynamisk first-dialog
            Object.defineProperty(Characters.portier.dialogue, 'first', {
                get: function() {
                    const hasModernClothes = Game.player.hasModernClothes !== false;

                    if (hasModernClothes) {
                        return `Portiern tar ett steg bakåt och betraktar dig från topp till tå med en blandning av förvirring och misstänksamhet.

"Ursäkta... men <em>varifrån</em> kommer ni?"

Han pekar på dina kläder.

"De där... plaggen. Jag har aldrig sett något liknande. Är ni från kolonierna? Från Ostindien kanske? Eller..."

Han sänker rösten.

"Ni är väl inte från något sinnessjukhus?"

Han skakar på huvudet bestämt.

"Oavsett - ni kan inte gå uppför trappan så där klädda. Detta är <em>Kungliga Operan</em>, inte någon marknadsbod. Kanske kan ni hitta lämpligare kläder någonstans... personalen går genom dörren till <span class="important">vänster</span>."`;
                    } else {
                        return `Portiern bugar elegant.

"God afton, min herre! Vilken <em>förnämlig</em> dräkt - pastellblått siden, mycket modernt!"

Han ler godkännande.

"Välkommen till Kungliga Operan. Trappan leder upp till foajén och salongerna. Maskeradbalen på lördag kommer bli magnifik - Hans Majestät själv har lovat närvara!"`;
                    }
                }
            });

            console.log('   ✓ Porter dialogue updated for modern clothes');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: BLOCKERA "UPP" MED BÄTTRE MEDDELANDE
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdGo) {
            const originalGo = GameEngine.cmdGo;

            GameEngine.cmdGo = function(direction) {
                const room = Game.player.currentRoom;

                // Blockera "upp" i opera_entrance med moderna kläder
                if (room === 'opera_entrance' && direction === 'upp' && Game.player.hasModernClothes !== false) {
                    this.output(`<div class="narrator">Du tar ett steg mot trappan, men portiern ställer sig i vägen.</div>

<div class="dialogue">"Nej, nej, nej! Jag kan omöjligt släppa in er så där klädda."

Han betraktar dig med en blandning av medlidande och förfäran.

"De där... <em>plaggen</em>... jag vet inte varifrån ni kommer, men här på Operan har vi <em>standards</em>. Hitta ordentliga kläder först. Personalen går genom dörren till <span class="important">vänster</span> - kanske kan de hjälpa er."</div>`);
                    return;
                }

                return originalGo.call(this, direction);
            };

            console.log('   ✓ Porter blocking message hooked into cmdGo');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: TA BORT "IN" SOM UTGÅNG I PERSONALKORRIDOREN
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Rooms !== 'undefined' && Rooms.opera_staff) {
            // Ta bort "in" om det finns
            if (Rooms.opera_staff.exits && Rooms.opera_staff.exits['in']) {
                delete Rooms.opera_staff.exits['in'];
            }
            console.log('   ✓ Removed "in" exit from opera_staff (only "vänster" remains)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: FÖRBÄTTRA DIALOG-FLÖDE MED SUCCESSIVA ANTYDNINGAR
        // ═══════════════════════════════════════════════════════════════════
        // NPCs ska naturligt antyda vad man kan fråga om

        if (typeof Characters !== 'undefined') {

            // Adelcrantz - hans första dialog ska antyda topics
            if (Characters.adelcrantz) {
                Characters.adelcrantz.dialogue = Characters.adelcrantz.dialogue || {};
                Characters.adelcrantz.dialogue.first = `Den äldre mannen ser upp från sina ritningar och studerar dig nyfiket.

"Ah, en besökare! Välkommen till min verkstad."

Han reser sig och gör en lätt bugning.

"Jag är Carl Fredrik Adelcrantz, hovarkitekt. Jag ritade detta operahus, faktiskt."

Han ler stolt men hans blick blir allvarlig.

"Spännande tider vi lever i... <em>kungen</em> planerar en stor <em>maskeradbal</em> på lördag. Hela staden surrar av rykten."

Han sänker rösten.

"Mellan oss sagt - jag har hört oroande viskningar. Men sådant pratar man inte om öppet. Inte här."

Han tittar på dig med intresse.

"Vad för er hit, om jag får fråga?"`;

                // Lägg till/uppdatera topics
                Characters.adelcrantz.dialogue.topics = Characters.adelcrantz.dialogue.topics || {};

                Characters.adelcrantz.dialogue.topics['kungen'] = `Adelcrantz sänker rösten och ser sig omkring.

"Gustav III... en briljant man, ingen tvekan om det. Han älskar konsten, teatern, kulturen."

Han suckar.

"Men han har gjort sig många <em>fiender</em> bland adeln. Hans reformer... inte alla uppskattar dem."

Han lutar sig närmare.

"Jag hoppas verkligen att han är försiktig. Speciellt nu, inför <em>balen</em>."`;

                Characters.adelcrantz.dialogue.topics['biljett'] = `"Biljett till maskeradbalen?"

Adelcrantz gnuggar hakan eftertänksamt.

"Den är öppen för allmänheten, men det kostar. Eller..."

Han blinkar menande.

"Om du gör mig en tjänst kan jag ordna det. Jag behöver hjälp med att hämta <em>färg</em> från kemisten på <span class="important">Drottninggatan</span>. Gör det, så fixar jag en biljett åt dig."`;

                Characters.adelcrantz.dialogue.topics['konspiration'] = `Adelcrantz bleknar och ser sig hastigt omkring.

"Tyst! Inte så högt!"

Han viskar:

"Jag har hört... <em>rykten</em>. Vissa adelsmän är rasande på kungen. De träffas i hemlighet, sägs det."

Han skakar på huvudet.

"Men jag vet inte mer. Sådant snack hör man bäst på <em>krogarna</em> i Gamla stan - där <span class="important">Den Gyldene Freden</span> ligger. Brännvin löser tungor."`;

                Characters.adelcrantz.dialogue.topics['maskeradbal'] = `"Maskeradbalen!"

Adelcrantz ögon lyser upp.

"Det blir årets stora händelse! Kungen själv kommer närvara, naturligtvis. Alla bär masker - det är poängen."

Han ler mystiskt.

"Vem vet vem som gömmer sig bakom maskerna? En spännande tanke... och en farlig, kanske."`;

                Characters.adelcrantz.dialogue.topics['fiender'] = `Adelcrantz sänker rösten till en viskning.

"Adeln... många av dem hatar kungen. Hans reformer har tagit makt från dem, gett den till borgare och bönder."

Han räknar på fingrarna.

"Ribbing, Horn, Pechlin... namnen viskas. Men jag säger inget mer. Det är farligt att veta för mycket."`;
            }

            // Karolinen - ska antyda Anckarström-rykten
            if (Characters.karolin_1) {
                Characters.karolin_1.dialogue = Characters.karolin_1.dialogue || {};

                const originalFirst = Characters.karolin_1.dialogue.first;
                Characters.karolin_1.dialogue.first = `Den gamle karolinen sträcker på sig stolt när du närmar dig.

"Ja, jag tjänade under Karl XII. Poltava, Fredrikshald... hemska tider, men vi var modiga!"

Han ser på dig med gamla, grumliga ögon.

"Nuförtiden vaktar vi slottet. Inte lika ärofyllt, men någon måste göra det."

Han sänker rösten och ser sig omkring.

"Märkliga tider... Hört talas om den där <em>Anckarström</em>? Han som gör tofsar? Folk säger att han köpt <em>pistoler</em> på sistone. Konstigt för en tofsare, eller hur?"

Han skrattar torrt.

"Nåväl - vad vill du veta, unge vän?"`;
            }

            console.log('   ✓ Dialog flow improved with natural topic hints');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5: TRE-NIVÅ LEDTRÅDSSYSTEM (INVISICLUES-STIL)
        // ═══════════════════════════════════════════════════════════════════

        // Lagra ledtrådsnivå per situation
        if (typeof Game !== 'undefined') {
            Game.player.hintLevels = Game.player.hintLevels || {};
        }

        // InvisiClues-struktur för ledtrådar
        const InvisiClues = {
            // Situation: Behöver kläder
            'need_clothes': {
                condition: () => Game.player.hasModernClothes !== false && !Game.player.questProgress.foundClothes,
                hints: [
                    // Nivå 1: Poetisk antydan
                    "Folk stirrar på dig. Dina kläder berättar en historia de inte förstår.",
                    // Nivå 2: Tydligare riktning
                    "Teatern är full av kostymer. Kanske finns det kläder någonstans bakom scenen?",
                    // Nivå 3: Direkt lösning
                    "I Operan, gå VÄNSTER till personalkorridoren. Där finns ett omklädningsrum med kläder."
                ]
            },

            // Situation: Har kläder, behöver information
            'need_info': {
                condition: () => !Game.player.hasModernClothes !== false &&
                               Game.player.questProgress.foundClothes &&
                               !Game.player.questProgress.learnedAboutConspiracy,
                hints: [
                    "Rykten sprids där människor samlas och dricker.",
                    "I Gamla stan finns krogar där adelsmän talar friare än vid hovet.",
                    "Besök Den Gyldene Freden i Gamla stan. Gå SÖDER till Norrbro, SÖDER till Slottsbacken, VÄSTER till Stortorget."
                ]
            },

            // Situation: I operan med moderna kläder
            'opera_modern_clothes': {
                condition: () => Game.player.currentRoom === 'opera_entrance' &&
                               Game.player.hasModernClothes !== false,
                hints: [
                    "Portiern blockerar trappan. Han gillar inte ditt utseende.",
                    "Du behöver kläder som passar tiden. Personalen kanske har något?",
                    "Gå VÄNSTER till personalkorridoren, sedan VÄNSTER igen till omklädningsrummet."
                ]
            },

            // Situation: I omklädningsrummet
            'in_costume_room': {
                condition: () => Game.player.currentRoom === 'costume_room' &&
                               !Game.player.questProgress.foundClothes,
                hints: [
                    "Det hänger fina kläder här. Kanske passar något dig?",
                    "En komplett dräkt hänger på en galge. Du kan ta den.",
                    "Skriv TA KLÄDER och sedan BYT KLÄDER."
                ]
            },

            // Situation: Har kläder men inte bytt
            'have_clothes_not_changed': {
                condition: () => Game.player.inventory.includes('period_clothes') &&
                               Game.player.hasModernClothes !== false,
                hints: [
                    "Du har kläder i handen men bär dem inte.",
                    "Kanske är det dags att byta om?",
                    "Skriv BYT KLÄDER eller TA PÅ KLÄDER."
                ]
            },

            // Situation: Letar efter konspirationen
            'searching_conspiracy': {
                condition: () => Game.player.questProgress.foundClothes &&
                               !Game.player.questProgress.learnedAboutConspiracy &&
                               Game.player.knowledge.includes('anckarstrom_mentioned'),
                hints: [
                    "Anckarström... det namnet dyker upp överallt. Vem är han egentligen?",
                    "En tofsare som köper pistoler? Någon på krogarna kanske vet mer.",
                    "Besök Den Gyldene Freden och PRATA med adelsmännen där. FRÅGA om Anckarström."
                ]
            },

            // Situation: Behöver bevis
            'need_evidence': {
                condition: () => Game.player.questProgress.learnedAboutConspiracy &&
                               !Game.player.questProgress.hasEvidence,
                hints: [
                    "Du vet om konspirationen, men vem skulle tro dig utan bevis?",
                    "Anckarström köpte pistoler hos en vapensmed. Kanske finns spår där?",
                    "Besök Wåhlbergs vapensmedja på Drottninggatan. Sök efter bevis."
                ]
            },

            // Default
            'default': {
                condition: () => true,
                hints: [
                    "Utforska världen. Prata med människor. Lyssna på rykten.",
                    "Varje plats har hemligheter. Undersök, fråga, experimentera.",
                    "Skriv HJÄLP för kommandon. Prata med NPCs för information."
                ]
            }
        };

        // Funktion för att hitta rätt ledtråd
        function getProgressiveHint() {
            // Hitta första matchande situation
            for (let [key, clue] of Object.entries(InvisiClues)) {
                if (key === 'default') continue;
                if (clue.condition()) {
                    // Hämta/sätt nivå för denna situation
                    Game.player.hintLevels[key] = Game.player.hintLevels[key] || 0;
                    const level = Game.player.hintLevels[key];

                    // Returnera hint för aktuell nivå
                    const hint = clue.hints[Math.min(level, clue.hints.length - 1)];

                    // Öka nivå för nästa gång (max 2)
                    if (Game.player.hintLevels[key] < 2) {
                        Game.player.hintLevels[key]++;
                    }

                    // Lägg till nivå-indikator
                    const levelText = level === 0 ? '·' : (level === 1 ? '··' : '···');

                    return {
                        hint: hint,
                        level: level,
                        levelText: levelText,
                        situation: key
                    };
                }
            }

            // Fallback till default
            const defaultLevel = Game.player.hintLevels['default'] || 0;
            Game.player.hintLevels['default'] = Math.min(defaultLevel + 1, 2);
            return {
                hint: InvisiClues.default.hints[defaultLevel],
                level: defaultLevel,
                levelText: defaultLevel === 0 ? '·' : (defaultLevel === 1 ? '··' : '···'),
                situation: 'default'
            };
        }

        // Exportera funktionen
        window.getProgressiveHint = getProgressiveHint;

        // Uppdatera ledtrådsknappen
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

            newHintBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const hintData = getProgressiveHint();

                // Formatera output baserat på nivå
                let hintClass = 'hint';
                let prefix = '';

                if (hintData.level === 0) {
                    prefix = '<em>En tanke slår dig...</em><br>';
                    hintClass = 'hint hint-subtle';
                } else if (hintData.level === 1) {
                    prefix = '<em>Du funderar vidare...</em><br>';
                    hintClass = 'hint hint-medium';
                } else {
                    prefix = '<em>Det blir tydligt:</em><br>';
                    hintClass = 'hint hint-direct';
                }

                if (typeof GameEngine !== 'undefined' && typeof GameEngine.output === 'function') {
                    GameEngine.output(`<div class="${hintClass}">
                        <span class="hint-level">${hintData.levelText}</span>
                        ${prefix}${hintData.hint}
                    </div>`);
                }

                // Räkna hints
                Game.player.stats.hintsUsed = (Game.player.stats.hintsUsed || 0) + 1;
            });

            console.log('   ✓ Progressive hint system (InvisiClues-style) implemented');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 6: UPPDATERA LEDTRÅDS-CSS
        // ═══════════════════════════════════════════════════════════════════

        const hintStyle = document.createElement('style');
        hintStyle.textContent = `
            .hint {
                border-left: 3px solid #888;
                padding: 10px 15px;
                margin: 10px 0;
                background: rgba(255,255,255,0.05);
            }
            .hint-subtle {
                border-left-color: #668;
                font-style: italic;
            }
            .hint-medium {
                border-left-color: #886;
            }
            .hint-direct {
                border-left-color: #a86;
            }
            .hint-level {
                float: right;
                opacity: 0.5;
                font-size: 1.2em;
            }
        `;
        document.head.appendChild(hintStyle);

        // ═══════════════════════════════════════════════════════════════════
        // FIX 7: FIXA getContextualHint FÖR ATT ANVÄNDA RÄTT RIKTNING
        // ═══════════════════════════════════════════════════════════════════

        window.getContextualHint = function() {
            const hintData = getProgressiveHint();
            return hintData.hint;
        };

        console.log('');
        console.log('✅ BUGFIXES BATCH 5 LOADED!');
        console.log('   - Porter dialogue more believable for modern clothes');
        console.log('   - "in" exit removed from opera_staff');
        console.log('   - Dialog flow improved with natural topic hints');
        console.log('   - Three-level hint system (InvisiClues-style) implemented');
        console.log('');
        console.log('📚 Hint system based on Infocom\'s InvisiClues:');
        console.log('   Level 1 (·)   = Poetic/atmospheric nudge');
        console.log('   Level 2 (··)  = Clearer direction');
        console.log('   Level 3 (···) = Direct solution');
        console.log('');

    }, 1400);
});
