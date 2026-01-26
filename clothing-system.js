// ═══════════════════════════════════════════════════════════════════════════
// CLOTHING SYSTEM - Dynamiska kläder och NPC-reaktioner
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. "Vänster" som riktning till omklädningsrummet
// 2. Målaren förändras mellan besök (först går, sedan målar)
// 3. Klädställningen blir tom efter man tagit kläderna
// 4. Målaren reagerar positivt på tidsenliga kläder
// 5. NPCs reagerar på moderna kläder ("Back to the Future"-stil)
// 6. NPCs reagerar positivt på tidsenliga kläder
//
// Loading: 1200ms - Efter npc-conversations
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('👔 Loading clothing system...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: LÄGG TILL "VÄNSTER" SOM RIKTNING
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Rooms !== 'undefined' && Rooms.opera_staff) {
            Rooms.opera_staff.exits = Rooms.opera_staff.exits || {};
            Rooms.opera_staff.exits['vänster'] = 'costume_room';
            console.log('   ✓ Added "vänster" exit to costume_room');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2 & 4: DYNAMISK MÅLARE/SCENARBETARE
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined' && Characters.scenarbetare) {
            // Byt namn till målare och gör dynamisk
            Characters.scenarbetare.name = 'Målaren';
            Characters.scenarbetare.description = 'En äldre man med målarfärgade händer och fläckigt förkläde.';
            Characters.scenarbetare.keywords = ['målare', 'man', 'äldre', 'arbetare', 'scenarbetare'];

            // Dynamisk första dialog baserat på besök och kläder
            Characters.scenarbetare.dialogue = {
                first: null, // Sätts dynamiskt
                topics: {
                    'kläder': `"Kläder? Jo, det finns gott om kostymer här. Omklädningsrummet är genom dörren till vänster."

Han pekar mot dörren.

"Bara ta vad ni behöver - vi har massor av gamla kostymer från föreställningar."`,

                    'opera': `"Operan är mitt livsverk! Jag har målat kulisser här i tjugo år."

Hans ögon glittrar.

"Gustav III själv har berömmt mina bakgrunder. 'Mästerligt', sa han! Kan ni tänka er?"`,

                    'kungen': `"Hans Majestät? Han är en sann konstkännare!"

Målaren ser stolt ut.

"Han kommer ofta förbi och tittar på vårt arbete. Ger förslag, diskuterar färger. En riktig teaterman!"`,

                    'arbete': `"Just nu målar jag en kuliss till nästa föreställning - en italiensk trädgård."

Han visar på sin palett.

"Se här - ceruleanblått för himlen, kromoxidgrönt för cypresserna. Konst!"`,

                    'maskeradbalen': `"Balen! Ja, allt måste vara perfekt till lördag."

Han torkar pannan.

"Vi har arbetat dag och natt. Kungen vill ha det <em>magnifikt</em>."`
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: DYNAMISK KLÄDSTÄLLNING
        // ═══════════════════════════════════════════════════════════════════

        // Spara originalitems för costume_room
        if (typeof Rooms !== 'undefined' && Rooms.costume_room) {
            Rooms.costume_room._originalItems = [...(Rooms.costume_room.items || [])];
        }

        // ═══════════════════════════════════════════════════════════════════
        // DYNAMISKA RUMSBESKRIVNINGAR
        // ═══════════════════════════════════════════════════════════════════

        const DynamicDescriptions = {

            // Personalkorridoren - målaren förändras
            opera_staff: function() {
                const visited = Rooms.opera_staff.visited;
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const hasPeriodClothes = Game.player.inventory.includes('period_clothes') ||
                                        Game.player.inventory.includes('tidsenliga_kläder') ||
                                        !hasModernClothes;

                let painterDesc;
                if (!visited) {
                    // Första besöket - målaren går förbi
                    painterDesc = `En äldre man med målarfärgade händer kommer gående med en låda full av penslar. Han ser dig och nickar.`;
                } else {
                    // Återbesök - målaren står och målar
                    painterDesc = `Målaren står vid ett staffli och arbetar på en kuliss föreställande en italiensk trädgård. Hans penslar dansar över duken i säkra drag.`;
                }

                // Reaktion på kläder
                let clothingReaction = '';
                if (hasModernClothes && visited) {
                    clothingReaction = `\n\n<span class="narrator">Målaren kastar en förbryllad blick på dina kläder men säger inget.</span>`;
                } else if (!hasModernClothes && visited) {
                    clothingReaction = `\n\n<span class="narrator">Målaren nickar vänligt - du ser ut som vilken teaterbesökare som helst.</span>`;
                }

                return `En smal korridor med knarrande trägolv. Väggarna är nakna och enkla - en skarp kontrast mot prakten i huvudentrén.

${painterDesc}${clothingReaction}

En dörr till <span class="important">vänster</span> står på glänt och du ser ett litet omklädningsrum där kostymer hänger. Korridoren fortsätter <span class="important">framåt</span> mot verkstaden.`;
            },

            // Omklädningsrummet - kläderna försvinner
            costume_room: function() {
                const hasTakenClothes = Game.player.inventory.includes('period_clothes') ||
                                       Game.player.inventory.includes('tidsenliga_kläder') ||
                                       Game.player.questProgress.foundClothes;

                let clothesDesc;
                if (hasTakenClothes) {
                    clothesDesc = `En <span class="important">tom klädgalge</span> står bredvid spegeln - där hängde nyss en komplett mansklädsel.`;
                } else {
                    clothesDesc = `Bredvid spegeln hänger en <span class="important">komplett mansklädsel</span> på en trägalge - en pastellblå sidenrock, broderad väst, knäbyxor, vita strumpor och en svart trekantig hatt.`;
                }

                return `Ett litet rum fyllt med kostymer från otaliga operaföreställningar. Sidenkappor, sammetsdräkter, perukställ och masker hänger på krokar längs väggarna.

En stor spegel med förgylld ram står i hörnet. ${clothesDesc}

Doften av lavendel och naftalen fyller luften - kläderna är välbevarade men tydligt från en svunnen tid.`;
            }
        };

        // ═══════════════════════════════════════════════════════════════════
        // HOOK INTO SHOWROOM FÖR DYNAMISKA BESKRIVNINGAR
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
            const originalShowRoom = GameEngine.showRoom;

            GameEngine.showRoom = function(roomId) {
                // Kolla om vi har en dynamisk beskrivning
                if (DynamicDescriptions[roomId]) {
                    const room = Rooms[roomId];
                    room.description = DynamicDescriptions[roomId]();
                }

                // Anropa original
                originalShowRoom.call(this, roomId);
            };

            console.log('   ✓ Dynamic room descriptions hooked');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: MÅLARENS REAKTION PÅ KLÄDBYTE
        // ═══════════════════════════════════════════════════════════════════

        // Hook cmdUse för att visa reaktion när man byter kläder
        if (typeof GameEngine !== 'undefined') {
            const originalCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(item) {
                const wasModern = Game.player.hasModernClothes !== false;

                // Anropa original
                const result = originalCmdUse.call(this, item);

                // Kolla om spelaren just bytte kläder
                const isNowPeriod = Game.player.hasModernClothes === false ||
                                   Game.player.inventory.includes('period_clothes') ||
                                   Game.player.questProgress.foundClothes;

                if (wasModern && isNowPeriod && item && item.includes('kläd')) {
                    // Spelaren bytte just till tidsenliga kläder!
                    const room = Game.player.currentRoom;

                    // Visa reaktion baserat på rum
                    if (room === 'costume_room' || room === 'opera_staff') {
                        setTimeout(() => {
                            this.output(`<div class="narrator">Du hör röster från korridoren:</div>
<div class="dialogue">"Ah, vilken elegant dräkt! Sidenrocken sitter perfekt!"</div>`);
                        }, 500);
                    }
                }

                return result;
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5 & 6: NPC-REAKTIONER PÅ KLÄDER
        // ═══════════════════════════════════════════════════════════════════

        // Reaktioner på MODERNA kläder (Back to the Future-stil)
        const ModernClothesReactions = [
            // Förvirrade kommentarer
            `"Ursäkta min nyfikenhet, men... vad är det för <em>tyg</em> era kläder är gjorda av? Jag har aldrig sett något liknande."`,
            `"Intressant dräkt! Är det någon sorts <em>sjömanskostym</em>? De där blå byxorna med metallknappar är... ovanliga."`,
            `"Förlåt, men... har ni <em>skosnören</em> som är gjorda av gummi? Och vad är det för märklig sula?"`,
            `"Ni är inte härifrån, eller hur? Era kläder... de är inte som något jag sett förut. Är ni från <em>Amerika</em>?"`,
            `"Ursäkta, men er skjorta har ingen spets vid handlederna. Och var är er <em>väst</em>? Är ni utfattig?"`,
            `"Förlåt min direkthet, men ni ser ut som en <em>galning</em> i de där kläderna. Var är er rock? Er hatt?"`,
            `"Är det där... <em>byxor för kvinnor</em>? Nej, förlåt - ni är tydligen en man. Men de där byxorna är mycket märkliga."`,
            `"Jag såg en seglare från Ostindien en gång med liknande kläder. Är ni <em>ostindiefarare</em>?"`,
            `"Skrattar ni åt oss? Den där 'dräkten' ser ut som något en <em>dåre</em> skulle bära på karnevalen!"`,
            `"Kära vän, ni kan inte gå in på operan så där. <em>Portiern</em> kommer aldrig släppa in er."`,
        ];

        // Reaktioner på TIDSENLIGA kläder
        const PeriodClothesReactions = [
            // Komplimanger (historiskt korrekta detaljer)
            `"Vilken <em>förträfflig</em> sidenrock! Är det Lyon-siden? Kvaliteten är utmärkt."`,
            `"Ah, en gentleman av smak! Den broderade västen är magnifik - är det <em>silvertråd</em>?"`,
            `"Er hatt sitter perfekt! Trekantig hatt är så modernt just nu - precis som vid hovet."`,
            `"Ni klär er som en sann <em>konstvän</em>. Kungen skulle uppskatta er smak!"`,
            `"Pastellblått! Vilken elegant färg. Det sägs vara <em>Marie Antoinettes</em> favorit."`,
            `"God dag, herre! Era strumpor är av finaste silke, ser jag. Ni måste vara välbärgad."`,
            `"Vilken stilig dräkt! Skräddaren måste vara från <em>Paris</em>!"`,
            `"Ah, en man av <em>god smak</em>! Välkommen till sällskapet."`,
            `"Ser jag rätt - är det <em>äkta knäbyxor</em> av sammet? Ni har stil, herre!"`,
        ];

        // Funktion för att kolla kläder och ge reaktion
        function getClothingReaction() {
            const hasModernClothes = Game.player.hasModernClothes !== false;

            if (hasModernClothes) {
                // Slumpmässig reaktion på moderna kläder
                const reaction = ModernClothesReactions[Math.floor(Math.random() * ModernClothesReactions.length)];
                return {
                    type: 'modern',
                    text: reaction
                };
            } else {
                // Slumpmässig reaktion på tidsenliga kläder
                const reaction = PeriodClothesReactions[Math.floor(Math.random() * PeriodClothesReactions.length)];
                return {
                    type: 'period',
                    text: reaction
                };
            }
        }

        // Exportera funktionen
        window.getClothingReaction = getClothingReaction;

        // ═══════════════════════════════════════════════════════════════════
        // HOOK INTO CMDTALK FÖR KLÄD-REAKTIONER
        // DISABLED: Moved to bugfixes-batch4.js for better NPC detection
        // ═══════════════════════════════════════════════════════════════════

        // This functionality is now handled in bugfixes-batch4.js with better
        // NPC detection (checks if NPC exists before showing reaction)
        console.log('   ℹ NPC clothing reactions handled by bugfixes-batch4.js');

        // ═══════════════════════════════════════════════════════════════════
        // FÖRBÄTTRAD MÅLARE MED KLÄD-REAKTION
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined' && Characters.scenarbetare) {
            // Override dialogue.first för att vara dynamisk
            const originalDialogue = Characters.scenarbetare.dialogue;

            // Gör first-dialogen dynamisk baserat på kläder
            Object.defineProperty(Characters.scenarbetare.dialogue, 'first', {
                get: function() {
                    const visited = Rooms.opera_staff && Rooms.opera_staff.visited;
                    const hasModernClothes = Game.player.hasModernClothes !== false;

                    if (hasModernClothes) {
                        if (!visited) {
                            return `Målaren stannar upp och stirrar på dina kläder med vidöppna ögon.

"Vad i all... Förlåt, men <em>vad</em> har ni på er?"

Han skrattar osäkert.

"Är det en ny kostym för någon pjäs? Jag har aldrig sett tyg som det där. Och de där <em>blå byxorna</em> med metallknappar... är det något från Orienten?"

Han skakar på huvudet.

"Nå, omklädningsrummet är till vänster om ni behöver byta om."`;
                        } else {
                            return `Målaren tittar upp från sitt staffli.

"Ah, ni igen! Fortfarande i den där märkliga dräkten, ser jag."

Han fnissar.

"Portiern kommer aldrig släppa in er på föreställningen så där. Omklädningsrummet är till <span class="important">vänster</span> - ta vad ni behöver."`;
                        }
                    } else {
                        // Tidsenliga kläder - positiv reaktion
                        if (!visited) {
                            return `Målaren ser upp från sina penslar och gör en lätt bugning.

"God dag, herre! Vilken <em>elegant</em> sidenrock!"

Han ler vänligt.

"Ni ser ut som en riktig operavän. Är ni här för att se föreställningen? Eller kanske förbereda er inför maskeradbalen på lördag?"`;
                        } else {
                            return `Målaren ler när han ser dig.

"Ah, den elegante herrn igen! Sidenrocken passar er utmärkt."

Han pekar med penseln mot sitt staffli.

"Vad tycks om min italienska trädgård? Till lördagens bal!"`;
                        }
                    }
                }
            });

            console.log('   ✓ Dynamic painter dialogue based on clothing');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FÖRBÄTTRAD PORTIER MED KLÄD-REAKTION
        // ═══════════════════════════════════════════════════════════════════

        if (typeof Characters !== 'undefined' && Characters.portier) {
            const portierOriginalDialogue = Characters.portier.dialogue;

            Object.defineProperty(Characters.portier.dialogue, 'first', {
                get: function() {
                    const hasModernClothes = Game.player.hasModernClothes !== false;

                    if (hasModernClothes) {
                        return `Portiern stirrar på dig med en blandning av förvirring och misstänksamhet.

"Ursäkta mig, men <em>vad</em> har ni på er?"

Han pekar på dina kläder.

"De där... <em>byxorna</em>. Jag har aldrig sett något liknande. Är de gjorda av segelduk? Och var är er rock? Er hatt?"

Han korsar armarna.

"Operan är en respektabel plats. Ni kan inte gå omkring så här. Det finns ett <span class="important">omklädningsrum till vänster</span> - personalen kan kanske hjälpa er."`;
                    } else {
                        return `Portiern bugar elegant.

"God dag, min herre! Vilken <em>förnämlig</em> dräkt!"

Han ler vänligt.

"Pastellblå siden - mycket modernt! Ni ser ut som en sann kulturälskare. Välkommen till Kungliga Operan!

Föreställningen börjar inte förrän i kväll, men ni är fri att utforska. Gå <span class="important">uppför trappan</span> till foajén, eller utforska korridorerna."`;
                    }
                }
            });

            // Lägg till topics om kläder
            if (!Characters.portier.dialogue.topics) {
                Characters.portier.dialogue.topics = {};
            }

            Characters.portier.dialogue.topics['kläder'] = `"Kläder? Ja, det är viktigt med rätt klädsel på operan."

Han tittar på dig.

"För gentlemän är sidenrock, väst och knäbyxor standard. Damer bär klänning med korsett."

Han pekar åt vänster.

"Om ni behöver byta om finns ett <span class="important">omklädningsrum längre in</span>."`;

            console.log('   ✓ Dynamic porter dialogue based on clothing');
        }

        // ═══════════════════════════════════════════════════════════════════
        // SOCIALA KOMMANDON: HÄLSA, SÄG, NICKA, VINKA, etc.
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Sociala kommandon att hantera
                const socialPatterns = [
                    // Hälsa
                    { pattern: /^(hälsa|hälsa på|säg hej|säg hej till|hej på dig)/, verb: 'hälsa' },
                    // Nicka
                    { pattern: /^(nicka|nicka till|nicka tillbaka|nicka åt)/, verb: 'nicka' },
                    // Vinka
                    { pattern: /^(vinka|vinka till|vinka åt)/, verb: 'vinka' },
                    // Buga
                    { pattern: /^(buga|buga för|gör en bugning)/, verb: 'buga' },
                    // Säg något
                    { pattern: /^(säg|ropa|skrik)\s+"?([^"]+)"?$/i, verb: 'säg' },
                    // Le
                    { pattern: /^(le|le mot|le åt)/, verb: 'le' },
                    // Tacka
                    { pattern: /^(tacka|säg tack)/, verb: 'tacka' }
                ];

                for (let social of socialPatterns) {
                    if (social.pattern.test(lowerInput)) {
                        this.handleSocialCommand(social.verb, lowerInput);
                        return;
                    }
                }

                // Inte ett socialt kommando - fortsätt med original
                return originalProcessCommand.call(this, input);
            };

            // Hantera sociala kommandon
            GameEngine.handleSocialCommand = function(verb, input) {
                const room = Rooms[Game.player.currentRoom];
                const hasNPCs = room.characters && room.characters.length > 0;

                // Hitta NPC om en nämns i input
                let targetNPC = null;
                if (hasNPCs) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (input.includes(keyword)) {
                                    targetNPC = char;
                                    break;
                                }
                            }
                        }
                        if (targetNPC) break;
                    }

                    // Om ingen specifik NPC nämndes, välj den första
                    if (!targetNPC && room.characters.length > 0) {
                        targetNPC = Characters[room.characters[0]];
                    }
                }

                // Generera svar baserat på verb och om det finns NPC
                const npcName = targetNPC ? targetNPC.name : null;
                const npcDesc = targetNPC ? (targetNPC.description || targetNPC.name) : null;

                switch (verb) {
                    case 'hälsa':
                        if (targetNPC) {
                            const responses = [
                                `${npcName} nickar vänligt tillbaka. "God dag!"`,
                                `${npcName} ser upp och hälsar. "Goddag, min herre."`,
                                `${npcName} ler och nickar artigt åt dig.`,
                                `"God dag!" svarar ${npcName} med en lätt bugning.`,
                                `${npcName} möter din blick och nickar kort.`
                            ];
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Det finns ingen här att hälsa på.</div>`);
                        }
                        break;

                    case 'nicka':
                        if (targetNPC) {
                            const responses = [
                                `${npcName} nickar tillbaka med ett litet leende.`,
                                `${npcName} besvarar din nick med en egen.`,
                                `Du nickar och ${npcName} gör likadant.`,
                                `${npcName} ser din nick och nickar artigt tillbaka.`
                            ];
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du nickar åt tomma luften. Ingen ser dig.</div>`);
                        }
                        break;

                    case 'vinka':
                        if (targetNPC) {
                            const responses = [
                                `${npcName} vinkar tillbaka, lite förvirrat.`,
                                `${npcName} höjer handen i en hälsning.`,
                                `${npcName} ser din vinkning och nickar istället.`
                            ];
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du vinkar. Ingen vinkar tillbaka.</div>`);
                        }
                        break;

                    case 'buga':
                        if (targetNPC) {
                            const responses = [
                                `${npcName} ser förvånad ut över din bugning men bugar artigt tillbaka.`,
                                `"Vilken artig herre!" utbrister ${npcName} och gör en egen bugning.`,
                                `${npcName} ler och bugar lätt som svar.`
                            ];
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du bugar djupt för den tomma luften. Ingen imponeras.</div>`);
                        }
                        break;

                    case 'säg':
                        // Extrahera vad som sägs
                        const sayMatch = input.match(/(säg|ropa|skrik)\s+"?([^"]+)"?$/i);
                        const message = sayMatch ? sayMatch[2] : 'något ohörbart';

                        if (targetNPC) {
                            const responses = [
                                `${npcName} tittar på dig med ett förbryllat uttryck. "Jaså... mja."`,
                                `"Hmm," svarar ${npcName} och verkar osäker på hur hen ska reagera.`,
                                `${npcName} hör dig men verkar inte veta vad hen ska säga.`,
                                `${npcName} nickar långsamt, tydligt osäker på ditt ärende.`
                            ];
                            this.output(`<div class="narrator">Du säger "${message}".</div>`);
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du säger "${message}" högt. Orden ekar i rummet, men ingen svarar.</div>`);
                        }
                        break;

                    case 'le':
                        if (targetNPC) {
                            const responses = [
                                `${npcName} ler tillbaka, om än lite osäkert.`,
                                `Ditt leende besvaras med ett lika vänligt från ${npcName}.`,
                                `${npcName} ser ditt leende och verkar bli på bättre humör.`
                            ];
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du ler för dig själv. Det känns lite ensamt.</div>`);
                        }
                        break;

                    case 'tacka':
                        if (targetNPC) {
                            const responses = [
                                `"Äran är min!" svarar ${npcName} artigt.`,
                                `${npcName} nickar. "Ingen orsak."`,
                                `"Det var så lite," säger ${npcName} blygsamt.`,
                                `${npcName} ler. "Gärna!"`
                            ];
                            this.output(`<div class="narrator">Du tackar ${npcName}.</div>`);
                            this.output(`<div class="dialogue">${responses[Math.floor(Math.random() * responses.length)]}</div>`);
                        } else {
                            this.output(`<div class="narrator">Du tackar högt. Ingen svarar.</div>`);
                        }
                        break;

                    default:
                        this.output(`<div class="narrator">Du gör en vänlig gest. ${hasNPCs ? targetNPC.name + ' ser dig men reagerar inte.' : 'Ingen märker det.'}</div>`);
                }
            };

            console.log('   ✓ Social commands added (hälsa, nicka, säg, vinka, buga, le, tacka)');
        }

        console.log('');
        console.log('✅ CLOTHING SYSTEM LOADED!');
        console.log('   - "Vänster" exit to costume_room added');
        console.log('   - Dynamic painter dialogue (walking/painting, clothing reaction)');
        console.log('   - Dynamic costume_room (empty hanger after taking clothes)');
        console.log('   - NPC reactions to modern clothes (Back to the Future-style)');
        console.log('   - NPC compliments for period clothes (historically accurate)');
        console.log('');

    }, 1200); // Load after npc-conversations (1150ms)
});
