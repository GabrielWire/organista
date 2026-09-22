import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fase1 = [2, 15, 20, 22, 23, 39, 48, 49, 62, 64, 75, 81, 102, 116, 131, 132, 135, 144, 158, 164, 165, 189, 211, 213, 221, 235, 247, 256, 258, 262, 266, 271, 274, 276, 278, 288, 293, 323, 332, 351, 373, 374, 383, 385, 388, 389, 399, 402, 410, 412, 414, 416, 421, 428, 431, 434, 437, 438, 443, 447, 454, 458, 460, 461, 468, 471];
const fase2 = [1, 4, 7, 8, 12, 14, 18, 27, 28, 32, 38, 47, 52, 56, 61, 63, 72, 73, 80, 103, 104, 105, 106, 109, 113, 123, 150, 153, 154, 169, 170, 172, 178, 183, 193, 195, 201, 215, 219, 220, 234, 244, 246, 248, 252, 260, 263, 269, 272, 280, 284, 292, 299, 310, 314, 316, 321, 327, 338, 341, 345, 346, 347, 352, 354, 358, 362, 363, 367, 371, 376, 382, 393, 395, 396, 397, 400, 411, 418, 427, 430, 432, 435, 444, 445, 453, 456, 457, 459, 464, 474, 475, 476, 480];
const fase3 = [5, 9, 10, 11, 13, 19, 21, 30, 34, 40, 42, 44, 46, 55, 58, 59, 60, 66, 70, 77, 79, 87, 92, 93, 96, 97, 108, 112, 114, 117, 121, 126, 127, 134, 137, 139, 141, 146, 147, 148, 151, 152, 155, 157, 162, 166, 175, 176, 179, 181, 182, 184, 186, 194, 196, 199, 207, 208, 210, 214, 216, 222, 227, 230, 239, 240, 249, 250, 251, 254, 255, 261, 283, 290, 295, 296, 301, 303, 304, 308, 315, 317, 319, 320, 325, 326, 330, 335, 336, 340, 350, 353, 355, 357, 361, 365, 369, 375, 378, 379, 390, 391, 401, 405, 406, 408, 413, 423, 424, 426, 433, 442, 448, 449, 450, 451, 465, 467, 472, 473, 477, 478, 479];
const fase4 = [3, 6, 16, 17, 24, 25, 29, 36, 57, 65, 68, 69, 74, 78, 83, 84, 85, 90, 91, 98, 100, 101, 107, 110, 111, 115, 118, 120, 122, 124, 125, 128, 133, 140, 142, 143, 145, 156, 159, 160, 161, 163, 174, 185, 190, 191, 192, 197, 203, 204, 206, 209, 212, 223, 224, 228, 229, 232, 233, 238, 242, 243, 253, 264, 265, 268, 273, 277, 279, 286, 287, 297, 302, 306, 311, 313, 318, 324, 328, 329, 331, 333, 334, 339, 343, 344, 348, 349, 360, 370, 380, 386, 387, 392, 420, 422, 425, 436, 441, 462, 463, 466, 469, 470];
const fase5 = [26, 31, 33, 35, 37, 41, 43, 45, 50, 51, 53, 54, 67, 71, 76, 82, 86, 88, 89, 94, 95, 99, 119, 129, 130, 136, 138, 149, 167, 168, 171, 173, 177, 180, 187, 188, 198, 200, 202, 205, 217, 218, 225, 226, 231, 236, 237, 241, 245, 257, 259, 267, 270, 275, 281, 282, 285, 289, 291, 294, 298, 300, 305, 307, 309, 312, 322, 337, 342, 356, 359, 364, 366, 368, 372, 377, 381, 384, 394, 398, 403, 404, 407, 409, 415, 417, 419, 429, 439, 440, 446, 452, 455];

const f1Set = new Set(fase1);
const f2Set = new Set(fase2);
const f3Set = new Set(fase3);
const f4Set = new Set(fase4);
const f5Set = new Set(fase5);

const getFase = (num) => {
  if (f1Set.has(num)) return 1;
  if (f2Set.has(num)) return 2;
  if (f3Set.has(num)) return 3;
  if (f4Set.has(num)) return 4;
  if (f5Set.has(num)) return 5;
  return 1;
};

const jsonPath = path.resolve(__dirname, '../src/data/hinosData.json');
const tsPath = path.resolve(__dirname, '../src/data/hinosData.ts');

const raw = fs.readFileSync(jsonPath, 'utf8');
const hinos = JSON.parse(raw);

console.log(`Total hinos lidos: ${hinos.length}`);

let count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0;
let countCoros = 0;

const updatedHinos = hinos.map((h) => {
  if (h.numero > 480) {
    countCoros++;
    return {
      ...h,
      faseDificuldade: 1,
      isCoro: true,
      maoDireita: true,
      maoEsquerda: true,
      pedaleira: true,
    };
  }

  const fase = getFase(h.numero);
  if (fase === 1) count1++;
  if (fase === 2) count2++;
  if (fase === 3) count3++;
  if (fase === 4) count4++;
  if (fase === 5) count5++;

  return {
    ...h,
    faseDificuldade: fase,
    isCoro: false,
    maoDireita: true,
    maoEsquerda: true,
    pedaleira: true,
  };
});

console.log(`Contagem dos 480 hinos por fase:`);
console.log(`Fase 1: ${count1} (esperado: 66)`);
console.log(`Fase 2: ${count2} (esperado: 94)`);
console.log(`Fase 3: ${count3} (esperado: 123)`);
console.log(`Fase 4: ${count4} (esperado: 104)`);
console.log(`Fase 5: ${count5} (esperado: 93)`);
console.log(`Total 480 Hinos: ${count1 + count2 + count3 + count4 + count5}`);
console.log(`Coros adicionais (481-486): ${countCoros}`);

fs.writeFileSync(jsonPath, JSON.stringify(updatedHinos, null, 2), 'utf8');
console.log(`Salvo em ${jsonPath}`);

const tsContent = `import type { Hino } from '../types';

export const HINOS_DATA: Hino[] = ${JSON.stringify(updatedHinos, null, 2)};
`;
fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log(`Salvo em ${tsPath}`);
