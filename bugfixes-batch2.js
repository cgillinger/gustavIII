// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 2 - Kläder, Keywords, Dynamiska beskrivningar
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. Målarens reaktion - positiv vid tidsenliga kläder
// 2. Norrbro dynamisk beskrivning (kappa vs hoodie)
// 3. Karolin-keywords - "karolin" måste matcha
// 4. Karolinernas topics utökade
// 5. Ledtrådsknappen fungerar
//
// Loading: 1250ms - Efter clothing-system
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 2...');

        // ═══════════════════════════════════════════════════════════════════
        // HJÄLPFUNKTION: Kolla om spelaren har tidsenliga kläder
        // ═══════════════════════════════════════════════════════════════════

        function playerHasPeriodClothes() {
            // Spelaren har tidsenliga kläder om:
            // 1. questProgress.foundClothes är true (de har hittat och tagit på sig kläder)
            // 2. hasModernClothes explicit satt till false
            return Game.player.questProgress.foundClothes === true ||
                   Game.player.hasModernClothes === false;
        }

        // Exportera funktionen globalt
        window.playerHasPeriodClothes = playerHasPeriodClothes;

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: MÅLARENS POSITIVA REAKTION
        // ═══════════════════════════════════════════════════════════════════

        // Override den dynamiska beskrivningen för opera_staff
        if (typeof Rooms !== 'undefined' && Rooms.opera_staff) {
            // Spara referens till gamla DynamicDescriptions om den finns
            const oldDynamicDesc = window.DynamicDescriptions;

            // Skapa ny dynamisk beskrivning
            const getOperaStaffDescription = function() {
                const visited = Rooms.opera_staff.visited;
                const hasPeriodClothes = playerHasPeriodClothes();

                let painterDesc;
                if (!visited) {
                    // Första besöket - målaren går förbi
                    painterDesc = `En äldre man med målarfärgade händer kommer gående med en låda full av penslar. Han ser dig och nickar.`;
                } else {
                    // Återbesök - målaren står och målar
                    painterDesc = `Målaren står vid ett staffli och arbetar på en kuliss föreställande en italiensk trädgård. Hans penslar dansar över duken i säkra drag.`;
                }

                // Reaktion på kläder - FIXAT: Positiv reaktion vid tidsenliga kläder
                let clothingReaction = '';
                if (!hasPeriodClothes && visited) {
                    // Moderna kläder - förbryllad reaktion
                    clothingReaction = `\n\n<span class="narrator">Målaren kastar en förbryllad blick på dina märkliga kläder.</span>`;
                } else if (hasPeriodClothes && visited) {
                    // Tidsenliga kläder - POSITIV reaktion!
                    clothingReaction = `\n\n<span class="narrator">Målaren skiner upp när han ser din eleganta sidenrock. "Vilken fin dräkt, min herre!"</span>`;
                }

                return `En smal korridor med knarrande trägolv. Väggarna är nakna och enkla - en skarp kontrast mot prakten i huvudentrén.

${painterDesc}${clothingReaction}

En dörr till <span class="important">vänster</span> står på glänt och du ser ett litet omklädningsrum där kostymer hänger. Korridoren fortsätter <span class="important">framåt</span> mot verkstaden.`;
            };

            // Hook showRoom för att använda vår dynamiska beskrivning
            if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
                const prevShowRoom = GameEngine.showRoom;

                GameEngine.showRoom = function(roomId) {
                    if (roomId === 'opera_staff') {
                        Rooms.opera_staff.description = getOperaStaffDescription();
                    }
                    return prevShowRoom.call(this, roomId);
                };
            }

            console.log('   ✓ Fixed painter positive reaction for period clothes');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: NORRBRO DYNAMISK BESKRIVNING
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Rooms !== 'undefined' && Rooms.norrbro) {
            // Gör Norrbro-beskrivningen dynamisk
            const getNorrbroDescription = function() {
                const hasPeriodClothes = playerHasPeriodClothes();

                // Dynamiskt val av klädplagg
                const garment = hasPeriodClothes ? 'kappan' : 'hoodien';

                return `Du står på den breda stenbron som förbinder Norrmalm med Gamla stan. Under dig brusar Norrström med isflak som driver i det mörka vattnet.

<span class="important">Stockholms slott</span> reser sig framför dig söderut - en massiv byggnad i gult och vitt, nyligen färdigställd och praktfull. Du kan se facklor som brinner vid entrén.

Norrut leder bron tillbaka till Norrmalmstorg och Operan. Räcket är dekorerat med ornamentala stenar, och du ser ut över vattnet mot Skeppsholmen.

Vinden är bitande här. Du drar ${garment} tätare omkring dig.`;
            };

            // Hook showRoom
            if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
                const prevShowRoom2 = GameEngine.showRoom;

                GameEngine.showRoom = function(roomId) {
                    if (roomId === 'norrbro') {
                        Rooms.norrbro.description = getNorrbroDescription();
                    }
                    return prevShowRoom2.call(this, roomId);
                };
            }

            console.log('   ✓ Fixed Norrbro dynamic description (kappa/hoodie)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: KAROLIN KEYWORDS
        // ═══════════════════════════════════════════════════════════════════
        // Problemet: "karolin" (singular) matchar inte keywords

        if (typeof Characters !== 'undefined') {
            if (Characters.karolin_1) {
                Characters.karolin_1.keywords = Characters.karolin_1.keywords || [];
                // Lägg till saknade keywords
                const neededKeywords = ['karolin', 'karoliner', 'karolinerna', 'veteran', 'soldat', 'gammal', 'gamle', 'stolt'];
                neededKeywords.forEach(kw => {
                    if (!Characters.karolin_1.keywords.includes(kw)) {
                        Characters.karolin_1.keywords.push(kw);
                    }
                });
            }

            if (Characters.karolin_2) {
                Characters.karolin_2.keywords = Characters.karolin_2.keywords || [];
                const neededKeywords = ['karolin', 'karoliner', 'karolinerna', 'tiggare', 'veteran', 'trasig', 'fattig'];
                neededKeywords.forEach(kw => {
                    if (!Characters.karolin_2.keywords.includes(kw)) {
                        Characters.karolin_2.keywords.push(kw);
                    }
                });
            }

            console.log('   ✓ Fixed karolin keywords (singular/plural)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: KAROLINERNAS TOPICS UTÖKADE
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined' && Characters.karolin_1) {
            if (!Characters.karolin_1.dialogue.topics) {
                Characters.karolin_1.dialogue.topics = {};
            }

            Object.assign(Characters.karolin_1.dialogue.topics, {
                'kungen': `"Gustav III?" Den gamle soldaten funderar.

"Han är ingen Karl XII, det ska vara säkert. Karl var en <em>krigare</em> - reste med oss genom snö och eld. Gustav? Han dansar på operan."

Han suckar.

"Men han är vår kung. Vi skyddar honom med våra liv, om det behövs."`,

                'karl': `Den gamle soldatens ögon lyser upp.

"<strong>Karl XII!</strong> Vår store kung! Jag följde honom till Poltava - 1709. Vi var unga då, fulla av mod."

Hans röst bryts.

"Vi förlorade allt den dagen. Tusentals döda. Kungen flydde till Turkiet. Sverige... Sverige var aldrig detsamma."`,

                'krig': `"Kriget..."

Han stirrar ut i tomma intet.

"Man glömmer aldrig. Lukten av krut och blod. Skrik av döende män. Kylan - herregud, <em>kylan</em> i Ryssland."

Han rör vid ett ärr på kinden.

"Jag överlevde. Många gjorde inte det. Nu tigger vi på gatorna - vi som en gång var hjältar."`,

                'mat': `"Mat? Hah!"

Han skrattar bittert.

"Vi äter vad vi kan. Rester från krogarna. Ibland ger snälla människor oss bröd."

Han tittar på dig.

"Om du vill äta gott - <span class="important">Den Gyldene Freden</span> i Gamla stan. Bra mat, bra öl. Säg att karolinerna skickade dig."`,

                'slottet': `"Stockholms slott? Det nya?"

Han pekar mot den massiva byggnaden.

"Invigdes för några år sedan. Fint, mycket fint. Men jag föredrar de gamla tiderna - när kungar red till strid, inte dansade på baler."`,

                'opera': `"Operan? Aldrig varit där. Inte för sådana som mig."

Han skrattar torrt.

"Men jag har hört att kungen älskar den. Sjunger, dansar, skriver pjäser. En konstig kung, men... han är vår kung."`,

                'pengar': `"En skilling, god herre?"

Han sträcker fram handen.

"Vi gamla soldater har inget. Sverige glömde oss när kriget var slut."`
            });

            console.log('   ✓ Extended karolin_1 topics (kungen, karl, krig, mat, slottet, opera)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5: LEDTRÅDSKNAPPEN
        // ═══════════════════════════════════════════════════════════════════

        // Kolla om ledtrådsknappen fungerar
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            // Ta bort alla tidigare event listeners genom att klona elementet
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

            // Lägg till ny click handler
            newHintBtn.addEventListener('click', function() {
                console.log('Hint button clicked!');

                // Kolla om environmental-storytelling har en getContextualHint funktion
                if (typeof getContextualHint === 'function') {
                    const hint = getContextualHint();
                    if (hint && typeof GameEngine !== 'undefined') {
                        GameEngine.output(`<div class="hint">💡 ${hint}</div>`);
                        return;
                    }
                }

                // Fallback: Använd Hints.getHint() om den finns
                if (typeof Hints !== 'undefined' && typeof Hints.getHint === 'function') {
                    const hint = Hints.getHint();
                    if (hint && typeof GameEngine !== 'undefined') {
                        GameEngine.output(`<div class="hint">💡 ${hint}</div>`);
                        return;
                    }
                }

                // Sista fallback - visa en generell ledtråd baserat på quest progress
                if (typeof GameEngine !== 'undefined' && typeof Game !== 'undefined') {
                    let hint = '';
                    const quest = Game.player.questProgress;

                    if (!quest.foundClothes) {
                        hint = 'Du sticker ut i dina moderna kläder. Hitta tidsenliga kläder på Operan - gå IN till personalkorridoren och sedan VÄNSTER till omklädningsrummet.';
                    } else if (!quest.learnedAboutConspiracy) {
                        hint = 'Nu när du smälter in, samla information. Besök Den Gyldene Freden i Gamla stan och prata med folk.';
                    } else if (!quest.hasEvidence) {
                        hint = 'Du behöver bevis mot konspiratörerna. Utforska Wåhlbergs vapensmedja på Drottninggatan, eller Pechlins palats på Blasieholmen.';
                    } else {
                        hint = 'Du har bevis! Hitta kungen och varna honom innan maskeradbalen. Han borde vara på slottet eller operan.';
                    }

                    GameEngine.output(`<div class="hint">💡 ${hint}</div>`);
                }
            });

            // Ta bort blinkande klass om den finns
            newHintBtn.classList.remove('highlight', 'blink', 'pulse');

            console.log('   ✓ Fixed hint button click handler');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 6: FRÅGA-KOMMANDOT FÖR KAROLINER
        // ═══════════════════════════════════════════════════════════════════
        // Förbättra cmdAsk för att hantera plural-NPC-namn bättre

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdAsk) {
            const originalCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(query) {
                if (!query) {
                    this.output("Fråga vem om vad?");
                    return;
                }

                const room = Rooms[Game.player.currentRoom];
                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // Sök efter NPC baserat på keywords
                let foundChar = null;
                let topic = query;

                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            // Kolla om keyword finns i query
                            if (query.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                // Ta bort keyword och "om" från query för att få topic
                                topic = query.toLowerCase()
                                    .replace(keyword.toLowerCase(), '')
                                    .replace(/\s*om\s*/g, ' ')
                                    .trim();
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                // Om vi hittat en karaktär och har ett topic
                if (foundChar && topic) {
                    const dialogue = foundChar.char.dialogue;
                    if (dialogue && dialogue.topics && dialogue.topics[topic]) {
                        this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                        return;
                    }

                    // Om topic inte finns, visa tillgängliga topics
                    if (dialogue && dialogue.topics) {
                        const availableTopics = Object.keys(dialogue.topics).join(', ');
                        this.output(`${foundChar.char.name} har inget att säga om "${topic}".`);
                        if (availableTopics) {
                            this.output(`<em>Du kan fråga om: ${availableTopics}</em>`);
                        }
                        return;
                    }
                }

                // Fallback till original
                if (originalCmdAsk) {
                    return originalCmdAsk.call(this, query);
                }
            };

            console.log('   ✓ Improved cmdAsk for better NPC keyword matching');
        }

        console.log('');
        console.log('✅ BUGFIXES BATCH 2 LOADED!');
        console.log('   - Painter shows positive reaction with period clothes');
        console.log('   - Norrbro uses kappa/hoodie dynamically');
        console.log('   - Karolin keywords fixed (singular/plural)');
        console.log('   - Karolin topics extended');
        console.log('   - Hint button fixed');
        console.log('');

    }, 1250); // Load after clothing-system (1200ms)
});
