# Skill SEO — asal-usul & imbasan keselamatan

- Sumber: https://github.com/AgriciDaniel/claude-seo (MIT, lihat `LICENSE-claude-seo.txt`)
- Commit: `468ed5b0d9e3249394783710e54abb02837e326b` (2026-11-15), v2.6.2
- Dipasang: 25 Nov 2026

## Yang dipasang (fail `.md` sahaja)

`seo` (rujukan), `seo-local`, `seo-maps`, `seo-page`, `seo-schema`,
`seo-content`, `seo-technical`, `seo-sitemap`

Tidak dipasang: skrip Python (`scripts/`), hooks, agents, extensions, dan
sub-skill lain. Arahan dalam skill yang memanggil
`scripts/claude-seo run ...` tidak akan berfungsi — semak secara manual.

## Pengubahsuaian tempatan

- `${CLAUDE_PLUGIN_ROOT}/skills/` → `.claude/skills/` supaya rujukan boleh dibaca.
- Bahagian "Community Footer" (iklan skool.com) dibuang dari `seo/SKILL.md`.

## Imbasan — NVIDIA SkillSpector v2.13.7 (`--no-llm`)

- Repo penuh (29 skill): DO_NOT_INSTALL kerana seo-agentic (67), seo-cluster (71),
  seo-google (57), seo-image-gen (53), seo-bing (33) — semua itu TIDAK dipasang.
- Selepas pasang (8 skill): skor maksimum 15/100 LOW. Penemuan hanya contoh
  dokumentasi (URL API Moz/WordPress, `npx lighthouse`), tiada exfiltration.
- `seo-local` "CAUTION" dengan 0 penemuan: dicetuskan oleh huruf "ü" dalam
  "Türkiye" (bukan obfuskasi).
- Semakan manual: setiap fail dibaca; tiada unicode tersembunyi, tiada arahan
  suntikan prompt.

Imbas semula sebelum kemas kini:
`~/.local/bin/skillspector scan .claude/skills --recursive --no-llm`
