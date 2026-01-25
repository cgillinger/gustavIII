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
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTalk) {
            const originalCmdTalk = GameEngine.cmdTalk;

            GameEngine.cmdTalk = function(target) {
                // Chans att NPC reagerar på kläder (30% för moderna, 20% för tidsenliga)
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const chance = hasModernClothes ? 0.35 : 0.15;

                // Kolla om vi redan visat kläd-reaktion i detta rum
                const roomKey = `clothing_reaction_${Game.player.currentRoom}`;
                const alreadyReacted = Game.player.knowledge && Game.player.knowledge.includes(roomKey);

                if (!alreadyReacted && Math.random() < chance) {
                    const reaction = getClothingReaction();

                    // Visa reaktion INNAN normal dialog
                    if (reaction.type === 'modern') {
                        this.output(`<div class="narrator">Innan samtalet börjar betraktar personen dina kläder med förvirrad min:</div>
<div class="dialogue whisper">${reaction.text}</div>
<div class="narrator">Men de skakar av sig det och fortsätter...</div>`);
                    } else {
                        this.output(`<div class="dialogue whisper">${reaction.text}</div>`);
                    }

                    // Markera att vi reagerat i detta rum
                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    Game.player.knowledge.push(roomKey);
                }

                // Anropa original
                return originalCmdTalk.call(this, target);
            };

            console.log('   ✓ NPC clothing reactions hooked into cmdTalk');
        }

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
        // TA BORT "DU STICKER UT" FRÅN INTRO
        // ═══════════════════════════════════════════════════════════════════

        // Vi behöver inte ändra intro-texten eftersom NPC-reaktionerna nu
        // förmedlar detta på ett bättre sätt. Kommentaren finns i
        // Rooms.norrmalmstorg.description i game.js.

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
