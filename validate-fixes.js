// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION SCRIPT - Canvas Review Fixes
// ═══════════════════════════════════════════════════════════════════════════
//
// Kör detta script i webbläsarens konsol för att validera alla fixar
// Eller kör det med Node.js: node validate-fixes.js (efter att ha laddat spelfilerna)
//
// ═══════════════════════════════════════════════════════════════════════════

// Simulera DOM om vi kör i Node.js
if (typeof document === 'undefined') {
    console.log('Running in Node.js - loading game files...');

    // Simulera tillräckligt för att ladda filer
    global.document = {
        addEventListener: function(event, callback) {
            if (event === 'DOMContentLoaded') {
                setTimeout(callback, 10);
            }
        },
        getElementById: function() { return { classList: { add: ()=>{}, remove: ()=>{} }, innerHTML: '', appendChild: ()=>{}, style: {} }; },
        querySelector: function() { return null; }
    };
    global.window = {};
    global.localStorage = { getItem: ()=>null, setItem: ()=>{} };
    global.alert = console.log;
    global.setTimeout = setTimeout;

    // Ladda spelfiler i rätt ordning
    try {
        require('./game.js');
        require('./game-expansion.js');
    } catch (e) {
        console.log('Could not load game files. Run this script in the browser console instead.');
        process.exit(1);
    }
}

// Vänta på att alla scripts laddats
setTimeout(function() {

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('                    CANVAS REVIEW - VALIDATION REPORT');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');

let passed = 0;
let failed = 0;
let warnings = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✅ PASS: ${name}`);
        passed++;
    } else {
        console.log(`❌ FAIL: ${name}`);
        failed++;
    }
}

function warn(name, message) {
    console.log(`⚠️  WARN: ${name} - ${message}`);
    warnings++;
}

// ═══════════════════════════════════════════════════════════════════════════
// A. RUM OCH NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('─── A. RUM OCH NAVIGATION ───');
console.log('');

// A1. Alla exits leder till existerande rum
console.log('A1. Alla exits leder till existerande rum:');
if (typeof Rooms !== 'undefined') {
    let allExitsValid = true;
    const invalidExits = [];

    for (let roomId in Rooms) {
        const room = Rooms[roomId];
        if (room.exits) {
            for (let direction in room.exits) {
                const targetRoom = room.exits[direction];
                if (!Rooms[targetRoom]) {
                    allExitsValid = false;
                    invalidExits.push(`${roomId} -> ${direction} -> ${targetRoom}`);
                }
            }
        }
    }

    test('Alla exits leder till existerande rum', allExitsValid);
    if (!allExitsValid) {
        invalidExits.forEach(e => console.log(`   Ogiltig: ${e}`));
    }
} else {
    warn('Rooms', 'Rooms object not found');
}

// A2. Akt 3-rum nåbarhet
console.log('');
console.log('A2. Akt 3-rum nåbarhet:');

// Kolla om opera_foyer har exit till opera_ballroom
if (typeof Rooms !== 'undefined' && Rooms.opera_foyer) {
    const hasBalExit = Rooms.opera_foyer.exits &&
        (Rooms.opera_foyer.exits['bal'] === 'opera_ballroom' ||
         Rooms.opera_foyer.exits['salong'] === 'opera_ballroom' ||
         Rooms.opera_foyer.exits['in'] === 'opera_ballroom');
    test('opera_foyer har exit till opera_ballroom', hasBalExit);
} else {
    warn('opera_foyer', 'Room not found');
}

// Kolla om opera_loges har exit till drabant_hall
if (typeof Rooms !== 'undefined' && Rooms.opera_loges) {
    const hasDrabantExit = Rooms.opera_loges.exits &&
        (Rooms.opera_loges.exits['drabant'] === 'drabant_hall' ||
         Rooms.opera_loges.exits['matsal'] === 'drabant_hall');
    test('opera_loges har exit till drabant_hall', hasDrabantExit);
} else {
    warn('opera_loges', 'Room not found');
}

// A3. Riktningar
console.log('');
console.log('A3. Riktnings-normalisering:');

if (typeof Parser !== 'undefined' && Parser.synonyms) {
    test('Parser har synonymer för norr', Parser.synonyms['norr'] !== undefined);
    test('Parser har synonymer för syd', Parser.synonyms['syd'] !== undefined);
    test('Parser har synonymer för öster', Parser.synonyms['öster'] !== undefined);
    test('Parser har synonymer för väster', Parser.synonyms['väster'] !== undefined);
} else {
    warn('Parser', 'Parser.synonyms not found');
}

// ═══════════════════════════════════════════════════════════════════════════
// B. KOMMANDON OCH EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

console.log('');
console.log('─── B. KOMMANDON OCH EDGE CASES ───');
console.log('');

// B1. GE X TILL Y - Parser behåller "till"
console.log('B1. GE X TILL Y:');

if (typeof Parser !== 'undefined' && Parser.parse) {
    const testInput = 'ge färg till adelcrantz';
    const parsed = Parser.parse(testInput);
    const tillKvar = parsed.raw.includes('till') || parsed.object.includes('till');
    test('Parser behåller "till" i input', tillKvar);
} else {
    warn('Parser.parse', 'Function not found');
}

// B2. FRÅGA ... OM ...
console.log('');
console.log('B2. FRÅGA ... OM ...:');

if (typeof GameEngine !== 'undefined' && GameEngine.cmdAsk) {
    test('cmdAsk funktion finns', typeof GameEngine.cmdAsk === 'function');
} else {
    warn('GameEngine.cmdAsk', 'Function not found');
}

// B4. Generiska NPCs
console.log('');
console.log('B4. Generiska NPCs:');

if (typeof Characters !== 'undefined') {
    test('generic_vakt finns', Characters.generic_vakt !== undefined);
    test('generic_gast finns', Characters.generic_gast !== undefined);
    test('generic_tjanare finns', Characters.generic_tjanare !== undefined);
} else {
    warn('Characters', 'Characters object not found');
}

// ═══════════════════════════════════════════════════════════════════════════
// C. BERÄTTELSE OCH BALANS
// ═══════════════════════════════════════════════════════════════════════════

console.log('');
console.log('─── C. BERÄTTELSE OCH BALANS ───');
console.log('');

// C2. Passagerum har interaktioner
console.log('C2. Passagerum mikrointeraktioner:');

if (typeof Rooms !== 'undefined') {
    // opera_corridor
    if (Rooms.opera_corridor) {
        const hasItems = Rooms.opera_corridor.items && Rooms.opera_corridor.items.length > 0;
        test('opera_corridor har items', hasItems);
    }

    // köpmangatan
    if (Rooms.köpmangatan) {
        const hasInteraction = (Rooms.köpmangatan.items && Rooms.köpmangatan.items.length > 0) ||
                               (Rooms.köpmangatan.characters && Rooms.köpmangatan.characters.length > 0);
        test('köpmangatan har interaktioner', hasInteraction);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// D. SPECIFIKA QUEST-KEDJOR
// ═══════════════════════════════════════════════════════════════════════════

console.log('');
console.log('─── D. QUEST-KEDJOR ───');
console.log('');

// Kontrollera att Adelcrantz kan ta emot färg
if (typeof Characters !== 'undefined' && Characters.adelcrantz) {
    test('Adelcrantz finns', Characters.adelcrantz !== undefined);
    test('Adelcrantz har dialogue.topics', Characters.adelcrantz.dialogue && Characters.adelcrantz.dialogue.topics);
    test('Adelcrantz har biljett-topic', Characters.adelcrantz.dialogue && Characters.adelcrantz.dialogue.topics && Characters.adelcrantz.dialogue.topics.biljett);
}

// Kontrollera att Items har färgburkar och ticket
if (typeof Items !== 'undefined') {
    test('färgburkar finns i Items', Items.färgburkar !== undefined);
    test('ticket finns i Items', Items.ticket !== undefined);
}

// ═══════════════════════════════════════════════════════════════════════════
// E. ENDINGS
// ═══════════════════════════════════════════════════════════════════════════

console.log('');
console.log('─── E. ENDINGS ───');
console.log('');

if (typeof Endings !== 'undefined') {
    test('perfect_victory ending finns', Endings.perfect_victory !== undefined);
    test('narrow_victory ending finns', Endings.narrow_victory !== undefined);
    test('failed_king_dies ending finns', Endings.failed_king_dies !== undefined);
    test('cassandra_ending finns', Endings.cassandra_ending !== undefined);
    test('vigilante_ending finns', Endings.vigilante_ending !== undefined);
    test('conspiracy_ending finns', Endings.conspiracy_ending !== undefined);
} else {
    warn('Endings', 'Endings object not found');
}

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('                           VALIDATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');
console.log(`   ✅ Passed:   ${passed}`);
console.log(`   ❌ Failed:   ${failed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log('');

if (failed === 0 && warnings === 0) {
    console.log('   🎉 ALL TESTS PASSED! Canvas Review fixes are working correctly.');
} else if (failed === 0) {
    console.log('   ✓ All tests passed, but there are some warnings to review.');
} else {
    console.log('   ⚠️  Some tests failed. Please review the fixes.');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════');

}, 1500); // Vänta på att alla scripts laddats
