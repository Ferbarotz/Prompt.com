# AGENTS.md — Prompt.com

Contexto para los agentes de IA de OpenCode que trabajen en este repositorio.

## Qué es este proyecto
**Prompt.com** es una guía web de métodos de *prompting*. Es un sitio **estático**:
- `index.html` — página única que contiene TODO: el HTML, el CSS (dentro de `<style>`) y el JavaScript (dentro de `<script>`). No hay framework, no hay build.
- `README.md` — descripción del repositorio.

## Cómo trabajar aquí
- No hay `package.json` ni proceso de build. Para verlo, basta abrir `index.html` en el navegador.
- Todo el estilo vive en el bloque `<style>` dentro de `index.html`, usando variables CSS definidas en `:root`.
- Mantén el idioma **español** en todo el contenido visible para el usuario.
- Conserva la estética actual (paleta de colores en `:root`, tarjetas con `--radius` y `--shadow`).
- No introduzcas dependencias ni herramientas de build salvo que se pida explícitamente.

## Convenciones
- Código y comentarios del proyecto: en español para el contenido, nombres técnicos en inglés cuando sea natural.
- Cambios pequeños y enfocados; no reescribas el archivo entero sin necesidad.
