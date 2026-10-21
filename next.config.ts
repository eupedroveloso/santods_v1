import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** Nada de cache no dev: o CSS do DS muda o tempo todo e o preview tem que refletir. */
const NO_STORE = [{ key: "Cache-Control", value: "no-store, must-revalidate" }];

const nextConfig: NextConfig = {
  // Dev pela rede local (o Pedro abre http://192.168.x.x:<porta> no celular e em outra máquina):
  // sem isto o Next bloqueia /_next/webpack-hmr de outra origem, o cliente não hidrata e
  // nada responde (alternador de tema, formulários). Só vale em `next dev`.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],

  // Ha um package-lock.json na pasta do usuario, acima do repo. Sem isto o
  // Turbopack infere a raiz errada e avisa a cada build.
  turbopack: {
    root: __dirname,
  },

  // So em desenvolvimento. O padrao do next dev (no-cache + ETag) ainda deixa a
  // pagina voltar do bfcache com o CSS antigo; no-store tira CSS e paginas de
  // qualquer cache. Em producao, o Next mantem o cache imutavel dos assets.
  async headers() {
    if (!isDev) return [];
    return [
      { source: "/_next/static/:path*", headers: NO_STORE },
      { source: "/:path*", headers: NO_STORE },
    ];
  },
};

export default nextConfig;
