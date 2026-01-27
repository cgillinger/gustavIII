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
// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 3 - FRÅGA-kommando, klädflaggor, ledtrådsknappen
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. FRÅGA-kommandot: "om" tas bort från topic ("fråga om kungen" → topic "kungen")
// 2. Klädflaggor: hasModernClothes och foundClothes sätts korrekt
// 3. Ledtrådsknappen: Fungerar konsekvent
//
// Loading: 1300ms - Efter bugfixes-batch2
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 3...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: FRÅGA-KOMMANDOT - STRIP "OM" FRÅN TOPIC
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "fråga om kungen" → topic blir "om kungen" istället för "kungen"
        // Problem: "fråga karolin om krig" → topic blir "om krig" istället för "krig"

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdAsk helt för att hantera "om" korrekt
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

                // Rensa query och splitta på "om"
                const cleanQuery = query.toLowerCase().trim();

                // Hantera olika format:
                // "om kungen" → topic = "kungen"
                // "karolin om krig" → npc = "karolin", topic = "krig"
                // "karolinen om mat" → npc = "karolinen", topic = "mat"

                let npcPart = null;
                let topic = cleanQuery;

                // Kolla om query börjar med "om " (inget NPC-namn)
                if (cleanQuery.startsWith('om ')) {
                    topic = cleanQuery.substring(3).trim(); // Ta bort "om " från början
                } else if (cleanQuery.includes(' om ')) {
                    // Format: "npc om topic"
                    const parts = cleanQuery.split(' om ');
                    npcPart = parts[0].trim();
                    topic = parts.slice(1).join(' om ').trim(); // Allt efter första "om"
                }

                // Hitta NPC i rummet
                let foundChar = null;

                // Om vi har en NPC-del, sök efter den specifikt
                if (npcPart) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (npcPart.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                // Om ingen specifik NPC hittades, sök i hela query
                if (!foundChar) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (cleanQuery.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    // Ta bort keyword från topic
                                    topic = topic.replace(keyword.toLowerCase(), '').trim();
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                // Om fortfarande ingen NPC, använd första i rummet
                if (!foundChar && room.characters.length > 0) {
                    const charId = room.characters[0];
                    foundChar = { id: charId, char: Characters[charId] };
                }

                if (!foundChar || !foundChar.char) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // Rensa topic från extra mellanslag och "om" om det finns kvar
                topic = topic.replace(/^om\s+/, '').trim();

                // Kolla om det finns topics för denna NPC
                const dialogue = foundChar.char.dialogue;

                if (topic && dialogue && dialogue.topics && dialogue.topics[topic]) {
                    this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                    return;
                }

                // Fuzzy-matchning: Kolla om topic delvis matchar något ämne
                if (topic && dialogue && dialogue.topics) {
                    const topicKeys = Object.keys(dialogue.topics);
                    for (let key of topicKeys) {
                        if (key.includes(topic) || topic.includes(key)) {
                            this.output(`<div class="dialogue">${dialogue.topics[key]}</div>`);
                            return;
                        }
                    }
                }

                // Ingen match - visa tillgängliga ämnen
                if (!topic || topic.length === 0) {
                    this.output(`Vad vill du fråga ${foundChar.char.name} om?`);
                } else {
                    this.output(`${foundChar.char.name} har inget att säga om "${topic}".`);
                }

                if (dialogue && dialogue.topics) {
                    const availableTopics = Object.keys(dialogue.topics).join(', ');
                    if (availableTopics) {
                        this.output(`<em>Du kan fråga om: ${availableTopics}</em>`);
                    }
                }
            };

            console.log('   ✓ Fixed cmdAsk - "om" now properly stripped from topic');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: KLÄDFLAGGOR - hasModernClothes OCH foundClothes
        // ═══════════════════════════════════════════════════════════════════
        // Problem: critical-fixes.js interceptar "använd kläder" för tidigt
        // och sätter aldrig flaggorna korrekt.

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdUse för att korrekt hantera kläder
            const existingCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(itemName) {
                if (!itemName) {
                    this.output("Använd vad?");
                    return;
                }

                // Kolla om det handlar om kläder
                if (itemName.includes('kläd') || itemName.includes('kostym') || itemName === 'byt om') {
                    // Kolla om spelaren REDAN BÄR tidsenliga kläder
                    if (Game.player.hasModernClothes === false) {
                        this.output("Du bär redan tidsenliga kläder.");
                        return;
                    }

                    // Kolla om spelaren HAR kläder i inventariet
                    const hasClothes = Game.player.inventory.includes('period_clothes') ||
                                      Game.player.inventory.includes('tidsenliga_kläder');

                    if (!hasClothes) {
                        this.output("Du har inga andra kläder att byta till ännu. Kanske kan du hitta något på Operan?");
                        return;
                    }

                    // Byt kläder - SÄTT FLAGGORNA!
                    Game.player.hasModernClothes = false;
                    Game.player.hasPeriodClothes = true;
                    Game.player.questProgress.foundClothes = true;

                    // Visa beskrivning
                    if (typeof Items !== 'undefined' && Items.period_clothes && Items.period_clothes.use) {
                        const useResult = Items.period_clothes.use();
                        this.output(useResult);
                    } else {
                        this.output(`<div class="success">Du byter snabbt om till de tidsenliga kläderna. Den pastellblå sidenrocken sitter perfekt, och med den broderade västen, knäbyxorna och den trekantiga hatten ser du ut som en äkta 1700-talsgentleman.

<strong>Du smälter nu in perfekt i 1792!</strong></div>`);
                    }

                    // Achievement
                    if (typeof this.unlockAchievement === 'function') {
                        this.unlockAchievement('blend_in');
                    }

                    // Update progress
                    if (typeof this.updateProgress === 'function') {
                        this.updateProgress(15);
                    }

                    console.log('🎭 Clothes changed! hasModernClothes:', Game.player.hasModernClothes,
                               'foundClothes:', Game.player.questProgress.foundClothes);

                    return;
                }

                // För andra saker, anropa existerande funktion
                // Men skippa om det är critical-fixes wrappern som kollar kläder igen
                if (existingCmdUse) {
                    // Kolla om existingCmdUse är critical-fixes wrappern
                    // Gå direkt till game.js originalfunktion om möjligt
                    try {
                        return existingCmdUse.call(this, itemName);
                    } catch (e) {
                        console.error('cmdUse error:', e);
                        this.output(`Du kan inte använda ${itemName} just nu.`);
                    }
                }
            };

            console.log('   ✓ Fixed cmdUse - clothing flags now set correctly');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: LEDTRÅDSKNAPPEN - ROBUST IMPLEMENTATION
        // ═══════════════════════════════════════════════════════════════════

        // Skapa en robust getContextualHint funktion
        window.getContextualHint = function() {
            if (typeof Game === 'undefined' || !Game.player) {
                return "Utforska omgivningen och prata med folk!";
            }

            const quest = Game.player.questProgress || {};
            const room = Game.player.currentRoom;
            const hasModernClothes = Game.player.hasModernClothes !== false;

            // Kläder-hints
            if (hasModernClothes && !quest.foundClothes) {
                if (room === 'costume_room') {
                    return "TA KLÄDER för att ta de tidsenliga kläderna, sedan ANVÄND KLÄDER för att byta om.";
                }
                if (room === 'opera_staff') {
                    return "Gå VÄNSTER för att komma till omklädningsrummet där det finns kläder.";
                }
                if (room === 'opera_entrance') {
                    return "Gå IN för att komma till personalkorridoren där du kanske kan hitta kläder.";
                }
                return "Du sticker ut i dina moderna kläder. Gå till Operan (NORR från Norrmalmstorg) och hitta omklädningsrummet.";
            }

            // Quest-hints baserat på progress
            if (!quest.learnedAboutConspiracy) {
                if (room === 'gyldene_freden') {
                    return "Prata med folket här! Prova PRATA MED ADELSMAN eller LYSSNA på samtalen.";
                }
                return "Nu när du smälter in, besök Den Gyldene Freden i Gamla stan för att höra rykten. Gå SÖDER till Norrbro, sedan SÖDER till Slottet, och VÄSTER till Stortorget.";
            }

            if (!quest.hasEvidence) {
                return "Du behöver bevis! Utforska Wåhlbergs vapensmedja på Drottninggatan (NORR från Norrmalmstorg) eller Pechlins palats på Blasieholmen.";
            }

            if (!quest.warnedKing) {
                return "Du har bevis! Hitta kungen och varna honom. Han borde vara på slottet eller i Operans loger.";
            }

            return "Fortsätt utforska och följ ledtrådarna!";
        };

        // Sätt upp ledtrådsknappen på nytt
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            // Ta bort alla event listeners genom att klona
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

            // Lägg till ny click handler
            newHintBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('💡 Hint button clicked (batch3)');

                const hint = window.getContextualHint();

                if (typeof GameEngine !== 'undefined' && typeof GameEngine.output === 'function') {
                    GameEngine.output(`<div class="hint">💡 <strong>Ledtråd:</strong> ${hint}</div>`);
                } else {
                    // Fallback: skriv direkt till output
                    const output = document.getElementById('output');
                    if (output) {
                        const hintDiv = document.createElement('div');
                        hintDiv.className = 'hint';
                        hintDiv.innerHTML = `💡 <strong>Ledtråd:</strong> ${hint}`;
                        output.appendChild(hintDiv);
                        output.scrollTop = output.scrollHeight;
                    }
                }
            });

            console.log('   ✓ Fixed hint button with robust click handler');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: PROCESSCOMMAND - HANTERA "FRÅGA OM X" DIREKT
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.processCommand) {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Fånga "fråga om X" direkt (utan NPC-namn)
                const askAboutMatch = lowerInput.match(/^fråga\s+om\s+(.+)$/);
                if (askAboutMatch) {
                    const topic = askAboutMatch[1].trim();
                    this.cmdAsk(topic);
                    return;
                }

                // Fånga "fråga X om Y"
                const askNpcMatch = lowerInput.match(/^fråga\s+(.+?)\s+om\s+(.+)$/);
                if (askNpcMatch) {
                    const npc = askNpcMatch[1].trim();
                    const topic = askNpcMatch[2].trim();
                    this.cmdAsk(`${npc} om ${topic}`);
                    return;
                }

                // Annars kör original
                return originalProcessCommand.call(this, input);
            };

            console.log('   ✓ Fixed processCommand to properly route FRÅGA commands');
        }

        console.log('');
        console.log('✅ BUGFIXES BATCH 3 LOADED!');
        console.log('   - FRÅGA command now properly strips "om" from topic');
        console.log('   - Clothing flags (hasModernClothes, foundClothes) now set correctly');
        console.log('   - Hint button works with robust implementation');
        console.log('');

    }, 1300); // Load after bugfixes-batch2 (1250ms)
});
// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 4 - UX-förbättringar
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. Ta bort automatiska ledtrådar (topics visas inte automatiskt)
// 2. Lägg till "utgångar", "riktningar" kommando
// 3. Gör klädtips subtilare, lägg till "ta på kläder", "byt kläder"
// 4. Fixa NPC-reaktion på kläder (ska inte visas om NPC inte finns)
//
// Loading: 1350ms - Efter bugfixes-batch3
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 4...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: TA BORT AUTOMATISKA TOPIC-LEDTRÅDAR
        // ═══════════════════════════════════════════════════════════════════
        // Problem: När spelaren frågar om något som NPC inte kan svara på,
        // visas tillgängliga topics automatiskt - det ska inte hända.

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdAsk igen med version som INTE visar topics automatiskt
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

                const cleanQuery = query.toLowerCase().trim();

                let npcPart = null;
                let topic = cleanQuery;

                if (cleanQuery.startsWith('om ')) {
                    topic = cleanQuery.substring(3).trim();
                } else if (cleanQuery.includes(' om ')) {
                    const parts = cleanQuery.split(' om ');
                    npcPart = parts[0].trim();
                    topic = parts.slice(1).join(' om ').trim();
                }

                // Hitta NPC i rummet
                let foundChar = null;

                if (npcPart) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (npcPart.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                if (!foundChar) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (cleanQuery.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    topic = topic.replace(keyword.toLowerCase(), '').trim();
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                if (!foundChar && room.characters.length > 0) {
                    const charId = room.characters[0];
                    foundChar = { id: charId, char: Characters[charId] };
                }

                if (!foundChar || !foundChar.char) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                topic = topic.replace(/^om\s+/, '').trim();

                const dialogue = foundChar.char.dialogue;

                // Kolla om topic matchar
                if (topic && dialogue && dialogue.topics && dialogue.topics[topic]) {
                    this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                    return;
                }

                // Fuzzy-matchning
                if (topic && dialogue && dialogue.topics) {
                    const topicKeys = Object.keys(dialogue.topics);
                    for (let key of topicKeys) {
                        if (key.includes(topic) || topic.includes(key)) {
                            this.output(`<div class="dialogue">${dialogue.topics[key]}</div>`);
                            return;
                        }
                    }
                }

                // INGEN match - visa BARA att de inte vet, UTAN att lista topics
                if (!topic || topic.length === 0) {
                    this.output(`${foundChar.char.name} tittar frågande på dig.`);
                } else {
                    this.output(`${foundChar.char.name} skakar på huvudet. "Jag vet inget om det."`);
                }
                // BORTTAGEN: Automatisk visning av tillgängliga topics
            };

            console.log('   ✓ Removed automatic topic hints from cmdAsk');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: LÄGG TILL "UTGÅNGAR" / "RIKTNINGAR" KOMMANDO
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            // Lägg till cmdExits funktion
            GameEngine.cmdExits = function() {
                const room = Rooms[Game.player.currentRoom];
                if (room && room.exits) {
                    const exitNames = Object.keys(room.exits);
                    if (exitNames.length > 0) {
                        this.output(`<div class="exits"><strong>Utgångar:</strong> ${exitNames.join(', ')}</div>`);
                    } else {
                        this.output("Det finns inga uppenbara utgångar härifrån.");
                    }
                } else {
                    this.output("Det finns inga uppenbara utgångar härifrån.");
                }
            };

            // Hook processCommand för att fånga nya kommandon
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Utgångar/riktningar kommandon
                if (/^(utgångar|riktningar|vägar|vilka utgångar|vart kan jag gå|vart går det)/.test(lowerInput)) {
                    this.cmdExits();
                    return;
                }

                // "titta" eller "se dig omkring" ska också visa utgångar
                // (redan hanterat av showRoom, men lägg till extra stöd)

                return originalProcessCommand.call(this, input);
            };

            console.log('   ✓ Added "utgångar" / "riktningar" command');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: SUBTILARE KLÄDTIPS OCH FLER ALIAS
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Du har nu tidsenliga kläder! Använd kommandot..." är för direkt
        // Lösning: Gör det mer immersivt

        // Hook cmdTake för att ändra meddelandet
        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTake) {
            const originalCmdTake = GameEngine.cmdTake;

            GameEngine.cmdTake = function(itemName) {
                // Kolla om det är kläder som tas
                const isClothes = itemName && (
                    itemName.includes('kläd') ||
                    itemName.includes('kostym') ||
                    itemName.includes('dräkt') ||
                    itemName.includes('rock')
                );

                // Anropa original
                const result = originalCmdTake.call(this, itemName);

                // Om det var kläder, ersätt det direkta tipset med immersivt meddelande
                // (Originalet i game.js:852-853 visar redan meddelandet,
                //  vi behöver override efteråt)

                return result;
            };

            // Override meddelandet som visas efter att ta kläder
            // genom att patcha Items.period_clothes
            if (typeof Items !== 'undefined' && Items.period_clothes) {
                // Spara originalet för senare
                const originalTakeable = Items.period_clothes.takeable;

                // Vi kan inte enkelt override meddelandet från game.js:852-853
                // Så vi får acceptera det, eller patcha output efteråt
            }
        }

        // Lägg till fler alias för att använda kläder
        if (typeof GameEngine !== 'undefined') {
            const existingProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Fler sätt att byta kläder
                if (/^(ta på kläder|ta på kläderna|sätt på kläder|byt kläder|byt om|klä om|klä dig|klä på dig)/.test(lowerInput)) {
                    this.cmdUse('kläder');
                    return;
                }

                // Fråga vad man kan fråga om (explicit begäran om topics)
                if (/^(vad kan jag fråga om|vilka ämnen|vad vet du om|berätta vad du vet)/.test(lowerInput)) {
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const char = Characters[charId];
                        if (char && char.dialogue && char.dialogue.topics) {
                            const topics = Object.keys(char.dialogue.topics).join(', ');
                            this.output(`<em>Du kan fråga ${char.name} om: ${topics}</em>`);
                            return;
                        }
                    }
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                return existingProcessCommand.call(this, input);
            };

            console.log('   ✓ Added clothing aliases (ta på kläder, byt kläder, etc.)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: FIXA NPC KLÄD-REAKTION (SKA INTE VISAS OM NPC INTE FINNS)
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Kläd-reaktion visas även när man försöker prata med en NPC
        // som inte finns i rummet

        // Override cmdTalk för att fixa detta
        if (typeof GameEngine !== 'undefined') {
            const baseCmdTalk = GameEngine.cmdTalk;

            GameEngine.cmdTalk = function(target) {
                if (!target) {
                    this.output("Prata med vem?");
                    return;
                }

                const room = Rooms[Game.player.currentRoom];

                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att prata med.");
                    return;
                }

                // Hitta karaktär FÖRST innan vi visar någon reaktion
                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (target.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                // Om ingen karaktär hittades med det namnet
                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // NU kan vi visa kläd-reaktion (om tillämpligt)
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const chance = hasModernClothes ? 0.35 : 0.15;
                const roomKey = `clothing_reaction_${Game.player.currentRoom}`;
                const alreadyReacted = Game.player.knowledge && Game.player.knowledge.includes(roomKey);

                // SKIP clothing reaction for porter - handled in main dialogue
                if (foundChar.id === 'portier') {
                    // Porter has special dialogue, don't add extra reactions
                }
                else if (!alreadyReacted && Math.random() < chance && typeof getClothingReaction === 'function') {
                    const reaction = getClothingReaction();

                    // Bestäm pronomen baserat på karaktärsnamn
                    const name = foundChar.char.name.toLowerCase();
                    let pronoun = 'personen';
                    // Manliga titlar/namn
                    if (name.includes('herr') || name.includes('man') || name.includes('målare') ||
                        name.includes('portier') || name.includes('adelsman') || name.includes('karolin') ||
                        name.includes('greve') || name.includes('baron') || name.includes('officer') ||
                        name.includes('kung') || name.includes('prins') || name.includes('hovman')) {
                        pronoun = 'han';
                    }
                    // Kvinnliga titlar/namn
                    else if (name.includes('dam') || name.includes('kvinna') || name.includes('fru') ||
                             name.includes('fröken') || name.includes('grevin') || name.includes('prinsessa') ||
                             name.includes('drottning')) {
                        pronoun = 'hon';
                    }

                    if (reaction.type === 'modern') {
                        this.output(`<div class="narrator">Innan samtalet börjar betraktar ${foundChar.char.name} dina kläder med förvirrad min:</div>
<div class="dialogue whisper">${reaction.text}</div>
<div class="narrator">Men ${pronoun} skakar av sig det och fortsätter...</div>`);
                    } else {
                        this.output(`<div class="dialogue whisper">${reaction.text}</div>`);
                    }

                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    Game.player.knowledge.push(roomKey);
                }

                // Visa dialog
                const dialogue = foundChar.char.dialogue;
                if (dialogue) {
                    // Markera att vi träffat denna NPC
                    const metKey = `met_${foundChar.id}`;
                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    const firstTime = !Game.player.knowledge.includes(metKey);

                    if (firstTime) {
                        Game.player.knowledge.push(metKey);
                        if (dialogue.first) {
                            this.output(`<div class="dialogue">${dialogue.first}</div>`);
                        } else if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} nickar åt dig.`);
                        }
                    } else {
                        if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else if (dialogue.first) {
                            this.output(`<div class="dialogue">${dialogue.first}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} nickar åt dig.`);
                        }
                    }
                } else {
                    this.output(`${foundChar.char.name} nickar åt dig men säger inget.`);
                }
            };

            console.log('   ✓ Fixed NPC clothing reaction (only shows when NPC exists)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5: SÄKERSTÄLL ATT "TITTA" VISAR UTGÅNGAR
        // ═══════════════════════════════════════════════════════════════════

        // Ingen ändring behövs - showRoom visar redan utgångar

        console.log('');
        console.log('✅ BUGFIXES BATCH 4 LOADED!');
        console.log('   - Automatic topic hints removed');
        console.log('   - "utgångar" / "riktningar" command added');
        console.log('   - Clothing aliases added (ta på kläder, byt kläder)');
        console.log('   - NPC clothing reaction fixed');
        console.log('');

    }, 1350); // Load after bugfixes-batch3 (1300ms)
});
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
// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 6 - Debug-analys fixar
// ═══════════════════════════════════════════════════════════════════════════
//
// Baserat på debug-sessionen gustav3-debug-2026-01-27T09-59-39.json
// och analys-rapporten gustavIII_debug_analysis_report_sv_27_jan.txt
//
// FIXAR:
// P0-1: Adelcrantz klädkommentar - ska BARA visas om hasModernClothes=true
// P0-2: "byt om" feedback - tydligt meddelande att bytet lyckades
// P0-3: Dubbeldialog (dedup) - förhindra att kläd-reaktion visas om NPC-dialog nämner kläder
// P1-1: Parser: fånga "Vad vet du?" och liknande
// P1-2: Topic-listning när NPC inte känner till ämne
// P2-1: Synka knowledge och questProgress
//
// Loading: 1600ms - Efter bugfixes-batch5
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 6 (debug analysis fixes)...');

        // ═══════════════════════════════════════════════════════════════════
        // P0-1: ADELCRANTZ KLÄDKOMMENTAR - VILLKORA PÅ hasModernClothes
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Adelcrantz säger "teater experiment" om kläderna även när
        // spelaren redan har tidsenliga kläder (hasModernClothes=false)

        if (typeof Characters !== 'undefined' && Characters.adelcrantz) {
            Characters.adelcrantz.dialogue = Characters.adelcrantz.dialogue || {};

            // Gör first-dialogen dynamisk baserat på kläder
            Object.defineProperty(Characters.adelcrantz.dialogue, 'first', {
                get: function() {
                    const hasModernClothes = Game.player.hasModernClothes !== false;

                    if (hasModernClothes) {
                        // Spelaren har moderna kläder - kommentera dem
                        return `Den äldre mannen ser upp från sina ritningar och studerar dig med höjda ögonbryn.

"Nå men... vilka märkliga kläder ni bär! Är det från någon teaterproduktion? Eller kanske från utlandet?"

Han reser sig och gör en lätt bugning.

"Förlåt min nyfikenhet. Jag är Carl Fredrik Adelcrantz, hovarkitekt. Jag ritade detta operahus."

Han ler, men hans blick blir snart allvarlig.

"Spännande tider vi lever i. <em>Kungen</em> planerar en stor <em>maskeradbal</em> på lördag."

Han sänker rösten.

"Jag har hört oroande viskningar om <em>konspirationer</em>. Men sådant pratar man inte om öppet. Vad för er hit?"`;
                    } else {
                        // Spelaren har tidsenliga kläder - ingen klädkommentar
                        return `Den äldre mannen ser upp från sina ritningar och ler vänligt.

"Välkommen till min verkstad, unge herre!"

Han reser sig och gör en elegant bugning.

"Jag är Carl Fredrik Adelcrantz, hovarkitekt. Jag ritade detta operahus."

Han tittar på din sidenrock med uppskattning.

"Fin dräkt ni bär - pastellblått är mycket modernt i år."

Hans blick blir snart allvarlig.

"Spännande tider vi lever i. <em>Kungen</em> planerar en stor <em>maskeradbal</em> på lördag."

Han sänker rösten.

"Jag har hört oroande viskningar om <em>konspirationer</em>. Men sådant pratar man inte om öppet. Vad för er hit?"`;
                    }
                },
                configurable: true
            });

            console.log('   ✓ P0-1: Adelcrantz dialogue now conditional on hasModernClothes');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P0-2: "BYT OM" SUCCESS-FEEDBACK
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "byt om" ger inget synligt meddelande att bytet lyckades

        if (typeof GameEngine !== 'undefined') {
            const existingCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(item) {
                const lowerItem = (item || '').toLowerCase();

                // Specialhantering för kläd-byte
                if (lowerItem.includes('kläd')) {
                    // Kontrollera om spelaren har kläderna
                    const hasClothes = Game.player.inventory.some(i =>
                        i === 'period_clothes' ||
                        i === 'tidsenliga_kläder' ||
                        (typeof Items !== 'undefined' && Items[i] &&
                         Items[i].name && Items[i].name.toLowerCase().includes('kläd'))
                    );

                    if (!hasClothes) {
                        this.output(`<div class="warning">Du har inga kläder att byta till.</div>`);
                        return;
                    }

                    // Kontrollera om redan bytt
                    if (Game.player.hasModernClothes === false) {
                        this.output(`<div class="narrator">Du bär redan tidsenliga kläder från 1700-talet.</div>`);
                        return;
                    }

                    // Utför bytet
                    Game.player.hasModernClothes = false;
                    Game.player.questProgress.foundClothes = true;

                    // Visa tydlig feedback
                    this.output(`<div class="success">Du byter om med fumliga händer.</div>

<div class="narrator">Kläderna är åtsittande och obekväma - den korsettliknande västen pressar, de tajta knäbyxorna begränsar rörelsefriheten, och silkesstrumporna vill glida ner.

Men när du ser dig i spegeln ser du en gentleman från 1700-talet titta tillbaka.</div>

<div class="important">Nu kan du röra dig fritt utan att väcka uppmärksamhet!</div>`);

                    // Lägg till achievement om det finns
                    if (Game.player.stats && Game.player.stats.achievements) {
                        if (!Game.player.stats.achievements.includes('changed_clothes')) {
                            Game.player.stats.achievements.push('changed_clothes');
                        }
                    }

                    return;
                }

                // Annars använd original cmdUse
                if (existingCmdUse) {
                    return existingCmdUse.call(this, item);
                }
            };

            console.log('   ✓ P0-2: "byt om" now gives clear success feedback');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P0-3: DUBBELDIALOG - DEDUP KLÄD-REAKTIONER
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Både NPC-dialog OCH clothingReaction kan kommentera kläder

        // Lista över NPCs vars first-dialog redan nämner kläder
        const npcsWithClothingInDialogue = [
            'adelcrantz',   // Nämner kläder i first-dialog
            'portier',      // Har speciell kläd-hantering
            'scenarbetare', // Målaren kommenterar kläder
            'vonEssen'      // Nämner "märklig klädsel"
        ];

        // Override getClothingReaction för att returnera null för dessa NPCs
        if (typeof window.getClothingReaction === 'function') {
            const originalGetClothingReaction = window.getClothingReaction;

            window.getClothingReaction = function(npcId) {
                // Om NPC redan har klädkommentar i dialog, skippa
                if (npcId && npcsWithClothingInDialogue.includes(npcId)) {
                    return null;
                }
                return originalGetClothingReaction();
            };

            console.log('   ✓ P0-3: Clothing reactions deduplicated for NPCs with clothing dialogue');
        }

        // Patcha cmdTalk för att skicka med NPC-id till getClothingReaction
        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTalk) {
            const patchedCmdTalk = GameEngine.cmdTalk;

            GameEngine.cmdTalk = function(target) {
                if (!target) {
                    this.output("Prata med vem?");
                    return;
                }

                const room = Rooms[Game.player.currentRoom];

                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att prata med.");
                    return;
                }

                // Hitta karaktär
                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (target.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // Kläd-reaktion - men BARA om NPC:n inte har kläder i sin dialog
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const roomKey = `clothing_reaction_${Game.player.currentRoom}`;
                const alreadyReacted = Game.player.knowledge && Game.player.knowledge.includes(roomKey);
                const skipClothingReaction = npcsWithClothingInDialogue.includes(foundChar.id);

                // Visa kläd-reaktion ENDAST om:
                // 1. Inte redan reagerat i detta rum
                // 2. NPC:n inte redan har klädkommentar i dialog
                // 3. Slumpmässig chans
                if (!alreadyReacted && !skipClothingReaction && Math.random() < (hasModernClothes ? 0.35 : 0.15)) {
                    if (typeof getClothingReaction === 'function') {
                        const reaction = getClothingReaction(foundChar.id);
                        if (reaction) {
                            const name = foundChar.char.name.toLowerCase();
                            let pronoun = name.includes('dam') || name.includes('kvinna') ||
                                         name.includes('fru') || name.includes('fröken') ? 'hon' : 'han';

                            if (reaction.type === 'modern') {
                                this.output(`<div class="narrator">${foundChar.char.name} betraktar dina kläder med förvirrad min:</div>
<div class="dialogue whisper">${reaction.text}</div>
<div class="narrator">Men ${pronoun} skakar av sig det och fortsätter...</div>`);
                            } else {
                                this.output(`<div class="dialogue whisper">${reaction.text}</div>`);
                            }

                            if (!Game.player.knowledge) Game.player.knowledge = [];
                            Game.player.knowledge.push(roomKey);
                        }
                    }
                }

                // Visa huvuddialog
                const dialogue = foundChar.char.dialogue;
                if (dialogue) {
                    const metKey = `met_${foundChar.id}`;
                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    const firstTime = !Game.player.knowledge.includes(metKey);

                    if (firstTime) {
                        Game.player.knowledge.push(metKey);

                        // Synka questProgress med knowledge
                        syncKnowledgeAndQuest(foundChar.id);

                        if (dialogue.first) {
                            this.output(`<div class="dialogue">${dialogue.first}</div>`);
                        } else if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} nickar åt dig.`);
                        }
                    } else {
                        if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} har inget mer att säga just nu.`);
                        }
                    }

                    // Visa topic-hints
                    if (dialogue.topics && Object.keys(dialogue.topics).length > 0) {
                        const topicList = Object.keys(dialogue.topics).slice(0, 4).join(', ');
                        this.output(`<div class="hint-subtle"><em>Du kan fråga om: ${topicList}</em></div>`);
                    }
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // P1-1: PARSER - FÅNGA "VAD VET DU?" OCH LIKNANDE
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Vad vet du?" registreras som UNHANDLED i debug-loggen

        if (typeof GameEngine !== 'undefined') {
            const existingProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // "Vad vet du?" och liknande
                if (/^(vad vet du|vad kan du berätta|vad vet ni|berätta för mig|vad har du hört)/.test(lowerInput)) {
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const char = Characters[charId];
                        if (char && char.dialogue && char.dialogue.topics) {
                            const topics = Object.keys(char.dialogue.topics);
                            if (topics.length > 0) {
                                const topicList = topics.join(', ');
                                this.output(`<div class="dialogue">"Vad vill ni veta? Jag kan berätta om: <em>${topicList}</em>."</div>
<div class="hint-subtle">Skriv FRÅGA [person] OM [ämne]</div>`);
                                return;
                            }
                        }
                        this.output(`<div class="dialogue">"Jag vet inte så mycket, tyvärr."</div>`);
                        return;
                    }
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // "Fråga om" utan ämne
                if (/^fråga\s+(om\s*)?$/.test(lowerInput)) {
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne], t.ex. "fråga adelcrantz om kungen"</div>`);
                    return;
                }

                return existingProcessCommand.call(this, input);
            };

            console.log('   ✓ P1-1: Parser now catches "Vad vet du?" and similar');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P1-2: TOPIC-LISTNING NÄR NPC INTE KÄNNER TILL ÄMNE
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Jag vet inget om det." upprepas 8 gånger utan vägledning

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdAsk) {
            const existingCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(targetAndTopic) {
                if (!targetAndTopic) {
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne], t.ex. "fråga adelcrantz om kungen"</div>`);
                    return;
                }

                // Parsa "person om ämne"
                const match = targetAndTopic.match(/^(.+?)\s+om\s+(.+)$/i);
                if (!match) {
                    // Försök hitta NPC och visa deras topics
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        for (let charId of room.characters) {
                            const char = Characters[charId];
                            if (char && char.dialogue && char.dialogue.topics) {
                                const topics = Object.keys(char.dialogue.topics).join(', ');
                                this.output(`<div class="hint">Du kan fråga ${char.name} om: <em>${topics}</em></div>`);
                                return;
                            }
                        }
                    }
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne]</div>`);
                    return;
                }

                const targetName = match[1].trim();
                const topic = match[2].trim().toLowerCase();

                // Hitta NPC
                const room = Rooms[Game.player.currentRoom];
                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (targetName.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // Kolla om NPC har topics
                const dialogue = foundChar.char.dialogue;
                if (!dialogue || !dialogue.topics) {
                    this.output(`<div class="dialogue">${foundChar.char.name} ser förvirrad ut. "Jag... jag vet inte vad ni pratar om."</div>`);
                    return;
                }

                // Hitta topic (med fuzzy matching)
                let foundTopic = null;
                for (let t of Object.keys(dialogue.topics)) {
                    if (t.toLowerCase() === topic ||
                        topic.includes(t.toLowerCase()) ||
                        t.toLowerCase().includes(topic)) {
                        foundTopic = t;
                        break;
                    }
                }

                if (foundTopic) {
                    // Hitta svaret och visa det
                    const response = dialogue.topics[foundTopic];
                    this.output(`<div class="dialogue">${response}</div>`);

                    // Lägg till knowledge
                    const knowledgeKey = `asked_${foundChar.id}_${foundTopic}`;
                    if (!Game.player.knowledge.includes(knowledgeKey)) {
                        Game.player.knowledge.push(knowledgeKey);
                    }
                } else {
                    // Topic okänt - VISA TILLGÄNGLIGA TOPICS istället för bara "Jag vet inget"
                    const availableTopics = Object.keys(dialogue.topics);

                    // Personlig fallback baserat på NPC
                    let fallbackResponse = "";
                    switch(foundChar.id) {
                        case 'adelcrantz':
                            fallbackResponse = `Adelcrantz rynkar pannan. "Hmm, ${topic}? Det vet jag tyvärr inget om."`;
                            break;
                        case 'portier':
                            fallbackResponse = `Portiern skakar på huvudet. "Det ligger utanför min kunskap."`;
                            break;
                        case 'bellman':
                            fallbackResponse = `Bellman tar en klunk ur sin bägare. "Det ämnet inspirerar mig inte, tyvärr."`;
                            break;
                        case 'krogvarden':
                            fallbackResponse = `Krogvärden torkar ett glas. "Jag hör mycket, men inte om det."`;
                            break;
                        default:
                            fallbackResponse = `${foundChar.char.name} skakar på huvudet. "Tyvärr vet jag inget om det."`;
                    }

                    this.output(`<div class="dialogue">${fallbackResponse}</div>
<div class="hint-subtle"><em>Du kan fråga om: ${availableTopics.join(', ')}</em></div>`);
                }
            };

            console.log('   ✓ P1-2: Unknown topics now show available alternatives');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P2-1: SYNKA KNOWLEDGE OCH QUESTPROGRESS
        // ═══════════════════════════════════════════════════════════════════
        // Problem: met_adelcrantz i knowledge men questProgress.metAdelcrantz=false

        function syncKnowledgeAndQuest(npcId) {
            if (!Game.player.questProgress) {
                Game.player.questProgress = {};
            }
            if (!Game.player.knowledge) {
                Game.player.knowledge = [];
            }

            // Synka NPC-möten
            const npcMapping = {
                'adelcrantz': 'metAdelcrantz',
                'portier': 'metPortier',
                'bellman': 'metBellman',
                'krogvarden': 'metKrogvarden',
                'king': 'metKing',
                'anckarstrom': 'metAnckarstrom'
            };

            // Från knowledge till questProgress
            for (let [npc, questKey] of Object.entries(npcMapping)) {
                if (Game.player.knowledge.includes(`met_${npc}`)) {
                    Game.player.questProgress[questKey] = true;
                }
            }

            // Specifik synk för nyss träffad NPC
            if (npcId && npcMapping[npcId]) {
                Game.player.questProgress[npcMapping[npcId]] = true;
            }
        }

        // Exportera funktionen
        window.syncKnowledgeAndQuest = syncKnowledgeAndQuest;

        // Kör synk vid laddning
        if (typeof Game !== 'undefined' && Game.player) {
            syncKnowledgeAndQuest();
            console.log('   ✓ P2-1: Knowledge and questProgress synchronized');
        }

        // ═══════════════════════════════════════════════════════════════════
        // CSS FÖR FEEDBACK-MEDDELANDEN
        // ═══════════════════════════════════════════════════════════════════

        const feedbackStyle = document.createElement('style');
        feedbackStyle.textContent = `
            .success {
                color: #4a4;
                font-weight: bold;
                margin: 10px 0;
            }
            .hint-subtle {
                color: #888;
                font-style: italic;
                font-size: 0.9em;
                margin-top: 5px;
            }
            .dialogue.whisper {
                font-style: italic;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(feedbackStyle);

        console.log('');
        console.log('✅ BUGFIXES BATCH 6 LOADED!');
        console.log('   P0-1: Adelcrantz clothing dialogue conditional');
        console.log('   P0-2: "byt om" success feedback');
        console.log('   P0-3: Clothing reaction deduplication');
        console.log('   P1-1: Parser catches "Vad vet du?"');
        console.log('   P1-2: Unknown topics show alternatives');
        console.log('   P2-1: Knowledge/questProgress sync');
        console.log('');

    }, 1600);
});
