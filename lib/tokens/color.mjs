/**
 * Cor: sRGB <-> OKLCH, luminancia e contraste WCAG 2.x.
 *
 * Modulo puro (sem disco, sem Node): roda no scripts/ e no browser. Fonte unica
 * da matematica de cor do SantoDS — brand-ramp.mjs, contrast-audit.mjs e o
 * Estudio importam daqui.
 *
 * Hex aceito: `#rrggbb` ou `#rrggbbaa` (o alfa e ignorado onde nao faz sentido;
 * `contrast` compoe o alfa sobre o fundo).
 *
 * DETERMINISTICO ENTRE MOTORES. Math.cbrt, cos, sin, atan2, hypot e `**` nao sao
 * corretamente arredondados pela especificacao: V8 (Node) e JSC (Safari) divergem
 * no ultimo bit, e as buscas binarias das rampas amplificavam isso ate 1/255 num
 * canal (o preview no Safari nao batia com o salvo pelo servidor). Aqui so se usa
 * + - * / e Math.sqrt, que o IEEE 754 obriga a arredondar corretamente — o mesmo
 * resultado bit a bit em qualquer motor. Nao troque por Math.cbrt/Math.cos/`**`.
 */

/* ------------------------------------------- aritmetica deterministica */

const PI = 3.141592653589793;

/** Raiz n-esima de x >= 0 por Newton, partindo de cima (converge monotonica). */
function root(x, n) {
  if (x === 0) return 0;
  let g = x > 1 ? x : 1;
  for (let i = 0; i < 400; i++) {
    let p = g;
    for (let k = 2; k < n; k++) p *= g; // g^(n-1)
    const next = g - (p * g - x) / (n * p);
    if (next >= g) break; // parou de descer: convergiu
    g = next;
  }
  return g;
}
const cbrt = (x) => (x < 0 ? -root(-x, 3) : root(x, 3));
const cube = (x) => x * x * x;

/** Seno e cosseno de um angulo em radianos: reducao a [-pi, pi] e serie de Taylor. */
function sinCos(r) {
  const x = r - 2 * PI * Math.round(r / (2 * PI));
  const x2 = x * x;
  let sin = 0;
  let cos = 0;
  let ts = x;
  let tc = 1;
  for (let k = 0; k < 30; k++) {
    sin += ts;
    cos += tc;
    ts *= -x2 / ((2 * k + 2) * (2 * k + 3));
    tc *= -x2 / ((2 * k + 1) * (2 * k + 2));
  }
  return [sin, cos];
}

/** atan(x): duas reducoes atan(x) = 2 atan(x / (1 + sqrt(1 + x^2))) e serie de Taylor. */
function atan(x) {
  let y = x;
  for (let i = 0; i < 2; i++) y = y / (1 + Math.sqrt(1 + y * y));
  const y2 = y * y;
  let sum = 0;
  let t = y;
  for (let k = 0; k < 40; k++) {
    sum += t / (2 * k + 1);
    t *= -y2;
  }
  return 4 * sum;
}

/** atan2 em radianos, (-pi, pi]. */
function atan2(b, a) {
  if (a === 0 && b === 0) return 0;
  if (Math.abs(a) >= Math.abs(b)) {
    const t = atan(b / a);
    return a > 0 ? t : b >= 0 ? t + PI : t - PI;
  }
  const t = atan(a / b);
  return b > 0 ? PI / 2 - t : -PI / 2 - t;
}

/** [r, g, b] em 0..1 (sem o alfa). */
export const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** Alfa de um hex em 0..1 (1 quando nao ha canal alfa). */
export const alphaOf = (hex) => (hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1);

/** [r, g, b] em 0..1 -> `#rrggbb`, cortando fora do intervalo. */
export const rgbToHex = (c) =>
  '#' + c.map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0')).join('');

/** v^2.4 = v^2 * (v^(1/5))^2. */
const pow24 = (v) => {
  const r5 = root(v, 5);
  return v * v * r5 * r5;
};
/** v^(1/2.4) = v^(5/12) = (v^(1/12))^5. */
const pow1over24 = (v) => {
  const r12 = root(v, 12);
  return r12 * r12 * r12 * r12 * r12;
};
export const srgbToLinear = (x) => (x <= 0.04045 ? x / 12.92 : pow24((x + 0.055) / 1.055));
export const linearToSrgb = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * pow1over24(x) - 0.055);

/** Luminancia relativa WCAG (Y) de um hex opaco. */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** `fg` (com alfa) composto sobre `bg` (opaco), em espaco sRGB como o browser faz. */
export function composite(fg, bg) {
  const a = alphaOf(fg);
  if (a === 1) return fg.slice(0, 7);
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  return rgbToHex(f.map((x, i) => x * a + b[i] * (1 - a)));
}

/** Razao de contraste WCAG 2.x. `fg` pode ter alfa; `bg` e tratado como opaco. */
export function contrast(fg, bg) {
  const solidBg = bg.slice(0, 7);
  const [x, y] = [luminance(composite(fg, solidBg)), luminance(solidBg)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Hex -> [L, C, H] em OKLCH (H em graus, 0..360). */
export function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    Math.sqrt(A * A + B * B),
    ((atan2(B, A) * 180) / PI + 360) % 360,
  ];
}

/** [L, C, H] -> [r, g, b] em 0..1, sem cortar (pode sair do gamut). */
export function oklchToRgb([L, C, H]) {
  const [sin, cos] = sinCos((H * PI) / 180);
  const a = C * cos;
  const b = C * sin;
  const l = cube(L + 0.3963377774 * a + 0.2158037573 * b);
  const m = cube(L - 0.1055613458 * a - 0.0638541728 * b);
  const s = cube(L - 0.0894841775 * a - 1.291485548 * b);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(linearToSrgb);
}

export const inGamut = (rgb) => rgb.every((x) => x >= -1e-4 && x <= 1 + 1e-4);

/** Maior croma <= C que cabe no sRGB, mantendo L e H. Devolve hex. */
export function fitGamut([L, C, H]) {
  let lo = 0;
  let hi = C;
  if (inGamut(oklchToRgb([L, C, H]))) lo = C;
  else {
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToRgb([L, mid, H]))) lo = mid;
      else hi = mid;
    }
  }
  return rgbToHex(oklchToRgb([L, lo, H]));
}

/** Cor de matiz H e croma C (cortado no sRGB) cuja luminancia WCAG e Y (busca binaria em L). */
export function matchLuminance(Y, C, H) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (luminance(fitGamut([mid, C, H])) < Y) lo = mid;
    else hi = mid;
  }
  return fitGamut([(lo + hi) / 2, C, H]);
}

/** Cinza puro (#vvvvvv) de luminancia mais proxima de Y — sem ruido de croma. */
export function grayOfLuminance(Y) {
  let best = '#000000';
  for (let v = 0; v < 256; v++) {
    const hex = '#' + v.toString(16).padStart(2, '0').repeat(3);
    if (Math.abs(luminance(hex) - Y) < Math.abs(luminance(best) - Y)) best = hex;
  }
  return best;
}
