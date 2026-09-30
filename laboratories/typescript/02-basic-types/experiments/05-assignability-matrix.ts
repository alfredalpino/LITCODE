/**
 * 05 — assignability matrix (study file)
 *
 * Instructions:
 * 1. Fill challenges/C01-assignability-worksheet.md FIRST
 * 2. Uncomment ONE line at a time
 * 3. Run npm run typecheck (or tsc on this file)
 * 4. Mark YES/NO
 *
 * Keep failing lines commented so the lab typechecks cleanly.
 */

declare let anyV: any;
declare let unknownV: unknown;
declare let neverV: never;
declare let voidV: void;
declare let nullV: null;
declare let undefV: undefined;
declare let objV: object;
declare let emptyV: {};
declare let strV: string;
declare let numV: number;

// --- Try assigning TO string ---
// strV = anyV;      // ?
// strV = unknownV;  // ?
// strV = neverV;    // ?
// strV = nullV;     // ? (strictNullChecks)
// strV = undefV;    // ?
// strV = numV;      // ?

// --- Try assigning unknown FROM others ---
// unknownV = anyV;
// unknownV = strV;
// unknownV = nullV;
// unknownV = objV;

// --- object / {} ---
// objV = {};
// objV = strV;      // ?
// emptyV = strV;    // ?
// emptyV = nullV;   // ?
// emptyV = objV;

// --- never ---
// neverV = strV;    // ?
// strV = neverV;    // ?

void anyV;
void unknownV;
void neverV;
void voidV;
void nullV;
void undefV;
void objV;
void emptyV;
void strV;
void numV;

export {};
