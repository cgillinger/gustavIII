// ═══════════════════════════════════════════════════════════════════════════
// SOUND ENHANCEMENTS - Context-sensitive listening system
// ═══════════════════════════════════════════════════════════════════════════
//
// Provides detailed audio descriptions for each location when player uses
// "lyssna" command. Makes the world feel more alive and immersive.
//
// Loading: After immersive-gameplay.js, before direction-fix.js
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        // ===== SOUND DATABASE =====
        // Room-specific audio descriptions for the "lyssna" command

        const SoundDatabase = {
            // Chapter 1 locations
            'norrmalmstorg': {
                default: `Du lyssnar noga...

Den melankoliska fiolmelodin svävar över torget - du känner igen den som en gammal folkvis om en förlorad kärlek.

Hästhovar klapprar mot kullerstenen. Röster vävar samman - en köpman som prutar om priset på ull, en kvinna som skrattar, barn som leker.

I fjärran hör du kyrkklockorna från Storkyrkan slå halv fem.`,

                with_musicians: `Fiolmelodin blir tydligare nu - den kommer från en gatumusikant som står vid kanten av torget.

Han spelar med slutna ögon, helt försjunken i musiken. Melodin är sorgsen men vacker.

Någon droppar ett mynt i hans hatt. Han nickar tack utan att sluta spela.`
            },

            'kungstradgarden': {
                default: `Trädens kala grenar knakar sakta i vinden.

Fåglar tjilpar svagt - sparvar som letar efter korn mellan snödrivorna.

I fjärran hör du stadens dova surr - röster, vagnshjul, kyrkklockorna som slår.

En tunn tystnad ligger över trädgården, som att världen håller andan.`
            },

            'stortorget': {
                default: `Torget EKAR av ljud!

"Färsk sill! Inlagd sill!" ropar sillförsäljarinnan.

"Fisk fångad i morse! Gädda, abborre!" svarar fiskhandlaren över torget.

Barn skrattar och skriker när de springer runt brunnen. Vatten plumsar när någon drar upp en hink.

Siris dragspel spelar en glad melodi, och du hör Mina dramatiskt deklamerade ord för barnen som samlats runt henne: "...och så reste Diana sig med båge i hand!"

Applåder och fniss från barnen.

Det är en symfoni av vardagsliv - marknaden i full gång.`,

                evening: `Torget har blivit tystare nu när kvällen fallit.

Försäljarna har packat ihop, men du hör fortfarande avlägsna röster från krogarna runt torget.

Siris dragspel ekar mjukt mellan husfasaderna - en kvällsvals, långsammare och mer melankolisk än tidigare.

En dörr slås igen någonstans. Fotsteg på kullerstenen. Någon viskar i mörkret.`
            },

            'köpmangatan': {
                default: `Den smala medeltidsgatan för ljudet konstigt - väggarna ekar och förstärker varje ljud.

Fotsteg klickar mot kullerstenen.

En dörr knarrar någonstans - någon som går in i en butik eller bostad.

I fjärran hör du marknadsröster från Stortorget.

Måsar skriker över hustaken - du är nära vattnet här.`
            },

            'västerlånggatan': {
                default: `Måsarnas SKRIK dominerar ljudbilden här.

De cirklar över Riddarfjärden och skriker gällt - ett vilt, fritt läte.

Vinden viskar mellan gränderna som leder ner mot vattnet. Du hör vatten som kluckar mot bryggor och båtsidor.

Avlägset hör du ett fartyg - ett skeppsklocka som ringer, rop från sjömän.

Staden känns nära havet här.`
            },

            'fredsgatan': {
                default: `Du hör stadens olika ljudlager här:

Från öster - Norrmalmstorgs livliga mummel.

Från väster - Blasieholmens herrgårdar, där du hör avlägsna röster, en hundrande hund, en vagn som rullar över grus.

Och under allt - havet. Båtar som gungat mot bryggor. Vatten som klappar. Sjömäns rop från hamnområdet.

Detta är gränsen mellan stadens hjärta och dess exklusiva utkant.`
            },

            'blasieholmen': {
                default: `Mycket tystare här än i stadskärnan.

Vinden susar genom träden i de välansade trädgårdarna.

En häst frustar någonstans bakom en herrgård. Hovar mot grus när någon rider förbi.

Avlägsna röster bakom höga staket - adelsfolk som pratar diskret.

Havet kluckar mot Blasieholmens stenbrygga.

Detta är de rikas värld - även ljudet är mer... behärskat.`,

                at_pechlin_house: `Du står utanför Pechlins palats och lyssnar...

Genom de tjocka murarna hör du SVAGA RÖSTER från övre våningen - du kan inte urskilja ord, men tonläget är allvarligt. Konspiratoriskt.

En dörr stängs tungt någonstans inuti huset.

Fotsteg på marmorgolv - någon går fram och tillbaka.

<em>Om du tar dig in och kommer närmare kanske du kan höra vad de säger...</em>`
            },

            'pechlin_house': {
                default: `Du står inuti det tysta palatset.

Marmorn för ljudet - varje litet ljud ekar.

OVANIFRÅN hör du RÖSTER - flera män som pratar intensivt. Du kan nästan höra orden nu...

"...Gustav måste..." - ordet försvinner.

"...vapnen är klara..." - en annan röst.

Fotsteg på träplankorna ovanifrån.

<span class="warning">Du behöver komma uppför trappan för att höra ordentligt.</span>`
            },

            'pechlin_salon': {
                conspiring: `Du trycker örat mot dörren och lyssnar...

Anckarströms röst, full av hat: "Jag har vapnen. Jag har modet. Ge mig bara tecknet så ska den tyrannens liv ta slut!"

Ribbings kalla svar: "Vid midnatt. När han kommer ner till balen. Vi omringar honom - och du skjuter."

Horns djupa stämma: "Vi måste vara försiktiga. von Essen är alltid vid hans sida. Vi måste separera dem."

Pechlin själv, den äldre konspiratören: "Allt är arrangerat. Masker gör oss anonyma. Ingen kommer veta vilka vi var förrän det är för sent."

En stol skrapar mot golvet.

<em>Du har hört allt du behöver. Detta är det konkreta beviset.</em>`,

                danger: `<span class="warning">FOTSTEG I TRAPPAN!</span>

Tunga steg. Någon kommer upp.

Du hör nycklar som rasslar.

En röst mumlar: "...trodde jag hörde något..."

<em>Du måste gömma dig eller fly - NU!</em>`
            },

            'opera_entrance': {
                default: `Operans entréhall ekar av steg och röster.

Portierns djupa stämma: "God afton, välkommen..."

Kappor som ruskar, snö som smälter på marmorgolvet och droppar.

INNIFRÅN operasalen hör du:
- Orkestern som spelar - stråkar som stämmer, en oboé som övar en passage
- Röster - sopraner som värmer upp
- Scenarbetare som ropar till varandra: "Flytta den kulissen åt vänster!"

Genom dörrarna hör du också musik och samtal från operasalarna.`
            },

            'opera_corridor': {
                default: `Korridoren ekar av ljud från köket:

SKRAMMEL av koppartallrikar och kastruller.

Röster - kockar som ropar order: "Var är det rostad köttet? Soppan kokar över!"

DOFTEN förstärker ljudbilden - rostat kött, timjan, rödvin, bröd som gräddas.

En dörr slängs upp och igen. En servitör rusar förbi med bricka.

"Ursäkta, ursäkta!" - han försvinner in i köket.

Bakom allt detta hör du avlägsen musik från operasalen - kontradansen som spelas om och om igen.`
            },

            'opera_foyer': {
                default: `Du står i foajén och hör operans hjärta slå:

MUSIK strömmar från huvudsalen - orkestern spelar. Violinerna sjunger, flöjterna dansar, pukor dunkar rytmen.

RÖSTER - hundratals samtals som väver samman: skratt, viskar, högljudd konversation.

FOTSTEG - maskeradens gäster som rör sig, dansar, promenerar.

Kristallkronornas prismor klirrar svagt när människor går förbi och skakar golvet.

Det är en symfoni av festlighet - men under det... ett läte av oro.`
            },

            'opera_main_hall': {
                default: `Operasalongen vibrerar av ljud!

ORKESTERN spelar den sjätte kontradansen - violiner, cello, flöjter, oboéer, horn - en komplex harmonisk väv.

FÖTTER som dansar - hundra par skor mot parkettgolvet i perfekt takt.

RÖSTER bakom masker - skratt, flirtar, komplimanger, viskar.

"Vem är du under masken?"
"En gåta, min vän, en gåta..."

Kjolar som fräser mot golvet. Parfym och svett och ljusvax.

Detta är Europas mest magnifika operapalats i full prakt.`,

                moment_of_murder: `Orkestern spelar fortfarande, men något har FÖRÄNDRATS.

SKRIK! Ett fruktansvärt skrik!

Musiken SLUTAR TVÄRT. Violiner skrapar dissonant.

DUNS - kropp mot golv.

"KUNGEN! DE HAR SKJUTIT KUNGEN!"

Kaos. Hundratals röster skriker samtidigt.

Fotsteg - folk som rusar, flyger, trampar varandra.

von Essens röst över kaoset: "VAKTERNA! STÄNG DÖRRARNA! INGEN SLÄPPS UT!"

Någon gråter. Någon ber en bön.

Historien har förändrats för evigt.`
            },

            'drabant_hall': {
                default: `Drabantsalen ekar av adligt sällskapsliv:

Sorl av röster - intima samtal mellan kungens närmaste vänner.

Klirr av glas och tallrikar - supén serveras på finaste porslinet.

von Essens djupa skratt: "Gustav, den där historien om kardinalen!"

Kungens ljusa, intelligenta svar: "Ah, men vänta tills jag berättat om när jag träffade Voltaire..."

Någon spelar klaver svagt i bakgrunden - en Mozart-sonat.

Detta är inte bara mat - det är kultur, konst, filosofi, vänskap.

<em>Om du lyssnar tillräckligt länge kanske du hör något speciellt...</em>`,

                skål: `Du trycker örat mot dörren och hör...

KLIRR av glas.

von Essens stämma reser sig: "En skål för kungen!"

Alla reser sig.

Hans djupa bas börjar sjunga:

"<em>Gustafs skål! Gustafs skål!
Bröderna honom hälsa,
alla de, som ej med svek,
vilja för hans frihet sälsa...</em>"

Alla stämmer in - en kraftfull manskör.

"<em>...Hör, I svenskar! detta blir
Edert glada lag:
Kärleks fakkel tändas här
Brinner för Gustav!</em>"

Den sista tonen ekar i salen.

Tystnad.

Sedan applåder och glada rop.

<em>Detta var mer än en sång - det var en lojalitetsförklaring.</em>`
            },

            'tavern': {
                default: `Krogen är full av ljud:

Sorl och mummel från drickande gäster.

KLONK när ölstop sätts hårt mot träbord.

Skratt - grovt, fylligt skratt från arbetare som slutat dagens arbete.

Den gamle soldatens röst mumlar över sitt brännvin: "...den där kapten Anckarström... bitter som galla..."

Värdinnans röst: "Mer öl? Mer brännvin?"

En grupp vid bordet spelar tärning - KLIRR när de kastas mot bordet, sedan rop och förbannelser när någon förlorar.

Dörren öppnas - kall vind blåser in, sedan stängs den med ett DUNK.

Detta är vanligt folks värld - rå, äkta, levande.`
            }
        };

        // ===== AMBIENT SOUNDS FOR ROOMS WITHOUT SPECIFIC AUDIO =====
        // Generic fallbacks that still feel better than "inget särskilt"

        const AmbientSounds = {
            indoor_palace: `Tystnad ligger över rummet - den typ av tystnad som bara finns i tjockmurade palats.

Avlägset hör du knarrande trägolv när någon går någon annanstans i byggnaden.

Vinden viskar utanför fönstren.

En klocka tickar någonstans.`,

            indoor_tavern: `Bakgrundssorl från andra gäster - mummel du inte kan urskilja ord från.

Klirr av glas och tallrikar.

Någon skrattar kort.

Fotsteg på trägolvet.`,

            outdoor_city: `Stadens allmänna surr omger dig:

Avlägsna röster - samtal du inte kan höra ord från.

Hästhovar mot kullersten någonstans i närheten.

En dörr som öppnas och stängs.

En hund som skäller i fjärran.

Kyrkklockorna från Storkyrkan slår timmen.`,

            outdoor_nature: `Vindens sus genom träden.

Fåglar som tjilrar svagt.

Avlägsna stadeljud - dova och långt borta.

Naturen andas omkring dig.`
        };

        // ===== OVERRIDE LYSSNA COMMAND =====
        // Make listening context-aware and meaningful

        if (typeof GameEngine !== 'undefined' && typeof Parser !== 'undefined') {

            // Ensure Parser handles "lyssna" and synonyms
            if (!Parser.synonyms) {
                Parser.synonyms = {};
            }

            Object.assign(Parser.synonyms, {
                'lyssna': ['listen', 'höra', 'hör'],
            });

            // Store original processCommand to wrap it
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const parsed = Parser.parse(input);

                // Check if this is a listen command
                if (parsed.verb === 'lyssna' || input.toLowerCase().includes('lyssna') ||
                    input.toLowerCase().includes('listen') || input.toLowerCase().includes('hör')) {

                    // Show command echo
                    this.output(`<span style="opacity: 0.6; font-style: italic;">(lyssnar)</span>`);

                    const roomId = Game.player.currentRoom;
                    const room = Rooms[roomId];

                    // Check if room has specific sound description
                    if (SoundDatabase[roomId]) {
                        const soundData = SoundDatabase[roomId];

                        // Check for conditional sound descriptions based on game state
                        if (soundData.conspiring && Game.flags.chapter2) {
                            this.output(soundData.conspiring);
                            return;
                        }

                        if (soundData.danger && Game.flags.pechlin_caught) {
                            this.output(soundData.danger);
                            return;
                        }

                        if (soundData.moment_of_murder && roomId === 'opera_ballroom' && Game.flags.chapter4) {
                            this.output(soundData.moment_of_murder);
                            return;
                        }

                        if (soundData.skål && roomId === 'drabant_hall' && room.specialActions && room.specialActions.listen_song) {
                            // This is the "Gustafs skål" easter egg - call original to maintain that functionality
                            return originalProcessCommand.call(this, input);
                        }

                        // Use default sound for this room
                        if (soundData.default) {
                            this.output(soundData.default);
                            return;
                        }
                    }

                    // Fallback to ambient sounds based on room type
                    if (room) {
                        // Determine room type by examining description
                        const desc = room.description ? room.description.toLowerCase() : '';

                        if (desc.includes('palats') || desc.includes('marmor') || desc.includes('kristall')) {
                            this.output(AmbientSounds.indoor_palace);
                        } else if (desc.includes('krog') || desc.includes('tavern')) {
                            this.output(AmbientSounds.indoor_tavern);
                        } else if (desc.includes('gata') || desc.includes('torg') || desc.includes('torget')) {
                            this.output(AmbientSounds.outdoor_city);
                        } else if (desc.includes('träd') || desc.includes('park') || desc.includes('trädgård')) {
                            this.output(AmbientSounds.outdoor_nature);
                        } else {
                            // Generic fallback - but better than "inget särskilt"
                            this.output(`Du lyssnar noga...

Rummet är relativt tyst. Du hör bara svaga ljud - avlägsna fotsteg, vinden utanför, stadens dova bakgrundssorl.`);
                        }
                    }

                    return; // Don't call original
                }

                // Not a listen command - call original
                return originalProcessCommand.call(this, input);
            };

            console.log('🔊 Sound enhancements loaded!');
            console.log('   - Context-sensitive audio descriptions');
            console.log('   - Room-specific soundscapes');
            console.log('   - Immersive listening experience');
        }

    }, 950); // Load after immersive-gameplay (900ms) but before direction-fix (1000ms)
});
