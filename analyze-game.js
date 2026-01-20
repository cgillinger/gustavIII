#!/usr/bin/env node

const fs = require('fs');

// More robust extraction using balanced brace matching
function extractRooms(content, objectName) {
    const rooms = {};
    const pattern = new RegExp(`const ${objectName}\\s*=\\s*\\{`, 'g');
    const match = pattern.exec(content);
    
    if (!match) return rooms;
    
    let pos = match.index + match[0].length;
    let braceCount = 1;
    let objContent = '';
    
    // Find the matching closing brace
    while (pos < content.length && braceCount > 0) {
        const char = content[pos];
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount > 0) objContent += char;
        pos++;
    }
    
    // Now parse individual rooms - updated regex to handle UTF-8 characters
    let currentPos = 0;
    const roomIdPattern = /^\s*([\wÀ-ÿ]+):\s*\{/gmu;
    
    while (currentPos < objContent.length) {
        roomIdPattern.lastIndex = currentPos;
        const roomMatch = roomIdPattern.exec(objContent);
        
        if (!roomMatch) break;
        
        const roomId = roomMatch[1];
        let roomStart = roomMatch.index + roomMatch[0].length;
        let roomBraces = 1;
        let roomEnd = roomStart;
        
        // Find the end of this room object
        while (roomEnd < objContent.length && roomBraces > 0) {
            const char = objContent[roomEnd];
            if (char === '{') roomBraces++;
            if (char === '}') roomBraces--;
            roomEnd++;
        }
        
        const roomContent = objContent.substring(roomStart, roomEnd - 1);
        
        // Extract room properties
        const nameMatch = roomContent.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const name = nameMatch ? nameMatch[1] : 'Unknown';
        
        // Extract exits - updated to handle UTF-8
        const exitsMatch = roomContent.match(/exits:\s*\{([^}]*)\}/);
        let exits = {};
        if (exitsMatch) {
            const exitsStr = exitsMatch[1];
            const exitPattern = /['"`]?([\wÀ-ÿ]+)['"`]?:\s*['"`]([\wÀ-ÿ]+)['"`]/gu;
            let exitMatch;
            while ((exitMatch = exitPattern.exec(exitsStr)) !== null) {
                exits[exitMatch[1]] = exitMatch[2];
            }
        }
        
        // Extract characters array - updated to handle UTF-8
        const charsMatch = roomContent.match(/characters:\s*\[([^\]]*)\]/);
        let characters = [];
        if (charsMatch) {
            const charsStr = charsMatch[1];
            const charPattern = /['"`]([\wÀ-ÿ]+)['"`]/gu;
            let charMatch;
            while ((charMatch = charPattern.exec(charsStr)) !== null) {
                characters.push(charMatch[1]);
            }
        }
        
        // Extract items array - updated to handle UTF-8
        const itemsMatch = roomContent.match(/items:\s*\[([^\]]*)\]/);
        let items = [];
        if (itemsMatch) {
            const itemsStr = itemsMatch[1];
            const itemPattern = /['"`]([\wÀ-ÿ]+)['"`]/gu;
            let itemMatch;
            while ((itemMatch = itemPattern.exec(itemsStr)) !== null) {
                items.push(itemMatch[1]);
            }
        }
        
        // Extract unlock condition
        const unlockMatch = roomContent.match(/unlockCondition:\s*['"`]([^'"`]+)['"`]/);
        const unlockCondition = unlockMatch ? unlockMatch[1] : null;
        
        rooms[roomId] = {
            name,
            exits,
            characters,
            items,
            unlockCondition
        };
        
        currentPos = roomMatch.index + roomMatch[0].length + (roomEnd - roomStart);
    }
    
    return rooms;
}

function extractCharacters(content, objectName) {
    const characters = {};
    const pattern = new RegExp(`const ${objectName}\\s*=\\s*\\{`, 'g');
    const match = pattern.exec(content);
    
    if (!match) return characters;
    
    let pos = match.index + match[0].length;
    let braceCount = 1;
    let objContent = '';
    
    while (pos < content.length && braceCount > 0) {
        const char = content[pos];
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount > 0) objContent += char;
        pos++;
    }
    
    // Extract character entries - updated to handle UTF-8
    const charPattern = /([\wÀ-ÿ]+):\s*\{[^}]*name:\s*['"`]([^'"`]+)['"`]/gu;
    let charMatch;
    while ((charMatch = charPattern.exec(objContent)) !== null) {
        characters[charMatch[1]] = {
            name: charMatch[2]
        };
    }
    
    return characters;
}

function extractItems(content, objectName) {
    const items = {};
    const pattern = new RegExp(`const ${objectName}\\s*=\\s*\\{`, 'g');
    const match = pattern.exec(content);
    
    if (!match) return items;
    
    let pos = match.index + match[0].length;
    let braceCount = 1;
    let objContent = '';
    
    while (pos < content.length && braceCount > 0) {
        const char = content[pos];
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount > 0) objContent += char;
        pos++;
    }
    
    // Extract item entries - updated to handle UTF-8
    const itemPattern = /([\wÀ-ÿ]+):\s*\{[^}]*name:\s*['"`]([^'"`]+)['"`]/gu;
    let itemMatch;
    while ((itemMatch = itemPattern.exec(objContent)) !== null) {
        items[itemMatch[1]] = {
            name: itemMatch[2]
        };
    }
    
    return items;
}

function analyzeGame() {
    const gameJsPath = '/home/user/gustavIII/game.js';
    const expansionJsPath = '/home/user/gustavIII/game-expansion.js';
    
    let report = [];
    report.push('='.repeat(80));
    report.push('GUSTAV III TEXT ADVENTURE - BUG ANALYSIS REPORT');
    report.push('Generated: ' + new Date().toISOString());
    report.push('='.repeat(80));
    report.push('');
    
    try {
        const gameContent = fs.readFileSync(gameJsPath, 'utf-8');
        const expansionContent = fs.readFileSync(expansionJsPath, 'utf-8');
        
        // Extract all data
        const rooms = extractRooms(gameContent, 'Rooms');
        const newRooms = extractRooms(expansionContent, 'NewRooms');
        const allRooms = { ...rooms, ...newRooms };
        
        const characters = extractCharacters(gameContent, 'Characters');
        const newCharacters = extractCharacters(expansionContent, 'NewCharacters');
        const allCharacters = { ...characters, ...newCharacters };
        
        const items = extractItems(gameContent, 'Items');
        const newItems = extractItems(expansionContent, 'NewItems');
        const allItems = { ...items, ...newItems };
        
        report.push(`INVENTORY SUMMARY:`);
        report.push(`  Total Rooms: ${Object.keys(allRooms).length} (Base: ${Object.keys(rooms).length}, Expansion: ${Object.keys(newRooms).length})`);
        report.push(`  Total Characters: ${Object.keys(allCharacters).length} (Base: ${Object.keys(characters).length}, Expansion: ${Object.keys(newCharacters).length})`);
        report.push(`  Total Items: ${Object.keys(allItems).length} (Base: ${Object.keys(items).length}, Expansion: ${Object.keys(newItems).length})`);
        report.push('');
        
        // Analysis 1: Check room exits
        report.push('='.repeat(80));
        report.push('1. ROOM EXIT VALIDATION');
        report.push('='.repeat(80));
        report.push('');
        
        let missingExits = [];
        let validExits = 0;
        
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (roomData.exits && Object.keys(roomData.exits).length > 0) {
                for (const [direction, targetRoom] of Object.entries(roomData.exits)) {
                    if (!allRooms[targetRoom]) {
                        missingExits.push({
                            room: roomId,
                            roomName: roomData.name,
                            direction: direction,
                            target: targetRoom
                        });
                    } else {
                        validExits++;
                    }
                }
            }
        }
        
        if (missingExits.length > 0) {
            report.push(`❌ FOUND ${missingExits.length} BROKEN EXIT(S):`);
            report.push('');
            missingExits.forEach(exit => {
                report.push(`  Room: "${exit.roomName}" (${exit.room})`);
                report.push(`    Direction: ${exit.direction} → Target: "${exit.target}" [MISSING]`);
                report.push('');
            });
        } else {
            report.push(`✅ All ${validExits} room exits are valid!`);
        }
        report.push('');
        
        // Analysis 2: Check character references
        report.push('='.repeat(80));
        report.push('2. CHARACTER REFERENCE VALIDATION');
        report.push('='.repeat(80));
        report.push('');
        
        let missingCharacters = [];
        let validCharRefs = 0;
        
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (roomData.characters && roomData.characters.length > 0) {
                for (const charId of roomData.characters) {
                    if (!allCharacters[charId]) {
                        missingCharacters.push({
                            room: roomId,
                            roomName: roomData.name,
                            character: charId
                        });
                    } else {
                        validCharRefs++;
                    }
                }
            }
        }
        
        if (missingCharacters.length > 0) {
            report.push(`❌ FOUND ${missingCharacters.length} MISSING CHARACTER(S):`);
            report.push('');
            missingCharacters.forEach(ref => {
                report.push(`  Room: "${ref.roomName}" (${ref.room})`);
                report.push(`    Character: "${ref.character}" [NOT DEFINED]`);
                report.push('');
            });
        } else {
            report.push(`✅ All ${validCharRefs} character references are valid!`);
        }
        report.push('');
        
        // Analysis 3: Check item references
        report.push('='.repeat(80));
        report.push('3. ITEM REFERENCE VALIDATION');
        report.push('='.repeat(80));
        report.push('');
        
        let missingItems = [];
        let validItemRefs = 0;
        
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (roomData.items && roomData.items.length > 0) {
                for (const itemId of roomData.items) {
                    if (!allItems[itemId]) {
                        missingItems.push({
                            room: roomId,
                            roomName: roomData.name,
                            item: itemId
                        });
                    } else {
                        validItemRefs++;
                    }
                }
            }
        }
        
        if (missingItems.length > 0) {
            report.push(`❌ FOUND ${missingItems.length} MISSING ITEM(S):`);
            report.push('');
            missingItems.forEach(ref => {
                report.push(`  Room: "${ref.roomName}" (${ref.room})`);
                report.push(`    Item: "${ref.item}" [NOT DEFINED]`);
                report.push('');
            });
        } else {
            report.push(`✅ All ${validItemRefs} item references are valid!`);
        }
        report.push('');
        
        // Analysis 4: List unlock conditions
        report.push('='.repeat(80));
        report.push('4. UNLOCK CONDITIONS AND REQUIREMENTS');
        report.push('='.repeat(80));
        report.push('');
        
        let lockedRooms = [];
        
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (roomData.unlockCondition) {
                lockedRooms.push({
                    room: roomId,
                    roomName: roomData.name,
                    condition: roomData.unlockCondition
                });
            }
        }
        
        if (lockedRooms.length > 0) {
            report.push(`Found ${lockedRooms.length} room(s) with unlock conditions:`);
            report.push('');
            lockedRooms.forEach(room => {
                report.push(`  Room: "${room.roomName}" (${room.room})`);
                report.push(`    Unlock Condition: ${room.condition}`);
                report.push('');
            });
        } else {
            report.push('No rooms with unlock conditions found.');
        }
        report.push('');
        
        // Analysis 5: Additional checks
        report.push('='.repeat(80));
        report.push('5. ADDITIONAL CHECKS');
        report.push('='.repeat(80));
        report.push('');
        
        // Check for rooms without exits (dead ends)
        let deadEnds = [];
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (!roomData.exits || Object.keys(roomData.exits).length === 0) {
                deadEnds.push({ room: roomId, name: roomData.name });
            }
        }
        
        if (deadEnds.length > 0) {
            report.push(`⚠️  Found ${deadEnds.length} room(s) with NO EXITS (potential dead ends):`);
            report.push('');
            deadEnds.forEach(room => {
                report.push(`  - "${room.name}" (${room.room})`);
            });
            report.push('');
        } else {
            report.push('✅ All rooms have at least one exit.');
            report.push('');
        }
        
        // Check for orphaned rooms (not reachable from any other room)
        let reachableRooms = new Set();
        for (const [roomId, roomData] of Object.entries(allRooms)) {
            if (roomData.exits) {
                for (const targetRoom of Object.values(roomData.exits)) {
                    reachableRooms.add(targetRoom);
                }
            }
        }
        
        // Add starting room
        reachableRooms.add('norrmalmstorg');
        
        let orphanedRooms = [];
        for (const roomId of Object.keys(allRooms)) {
            if (!reachableRooms.has(roomId) && roomId !== 'norrmalmstorg') {
                orphanedRooms.push({ room: roomId, name: allRooms[roomId].name });
            }
        }
        
        if (orphanedRooms.length > 0) {
            report.push(`⚠️  Found ${orphanedRooms.length} ORPHANED ROOM(S) (not reachable from any other room):`);
            report.push('');
            orphanedRooms.forEach(room => {
                report.push(`  - "${room.name}" (${room.room})`);
            });
            report.push('');
        } else {
            report.push('✅ All rooms are reachable from other rooms.');
            report.push('');
        }
        
        // Check for characters not assigned to any room
        let assignedCharacters = new Set();
        for (const roomData of Object.values(allRooms)) {
            if (roomData.characters) {
                roomData.characters.forEach(char => assignedCharacters.add(char));
            }
        }
        
        let unassignedCharacters = [];
        for (const charId of Object.keys(allCharacters)) {
            if (!assignedCharacters.has(charId)) {
                unassignedCharacters.push({ 
                    id: charId, 
                    name: allCharacters[charId].name 
                });
            }
        }
        
        if (unassignedCharacters.length > 0) {
            report.push(`⚠️  Found ${unassignedCharacters.length} character(s) NOT ASSIGNED to any room:`);
            report.push('');
            unassignedCharacters.forEach(char => {
                report.push(`  - "${char.name}" (${char.id})`);
            });
            report.push('');
        } else {
            report.push('✅ All characters are assigned to rooms.');
            report.push('');
        }
        
        // Summary
        report.push('='.repeat(80));
        report.push('SUMMARY');
        report.push('='.repeat(80));
        report.push('');
        
        const totalIssues = missingExits.length + missingCharacters.length + missingItems.length;
        const totalWarnings = deadEnds.length + orphanedRooms.length + unassignedCharacters.length;
        
        if (totalIssues === 0 && totalWarnings === 0) {
            report.push('🎉 NO CRITICAL BUGS OR WARNINGS FOUND!');
            report.push('The game codebase appears to be well-structured and consistent.');
        } else {
            report.push(`Critical Bugs Found: ${totalIssues}`);
            report.push(`  - Missing room exits: ${missingExits.length}`);
            report.push(`  - Missing characters: ${missingCharacters.length}`);
            report.push(`  - Missing items: ${missingItems.length}`);
            report.push('');
            report.push(`Warnings: ${totalWarnings}`);
            report.push(`  - Dead-end rooms: ${deadEnds.length}`);
            report.push(`  - Orphaned rooms: ${orphanedRooms.length}`);
            report.push(`  - Unassigned characters: ${unassignedCharacters.length}`);
        }
        
        report.push('');
        report.push('='.repeat(80));
        report.push('END OF REPORT');
        report.push('='.repeat(80));
        
        // Write report to file
        const reportText = report.join('\n');
        fs.writeFileSync('/home/user/gustavIII/bug-analysis.txt', reportText);
        
        console.log(reportText);
        console.log('\n✅ Analysis complete! Report saved to: bug-analysis.txt');
        
    } catch (error) {
        console.error('Error during analysis:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run analysis
analyzeGame();
