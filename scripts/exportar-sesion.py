"""
Exporta la transcripción de una sesión de opencode a Markdown.

La sesión se guarda en la base de datos local de opencode
(`~/.local/share/opencode/opencode.db`). El script la exporta a un Markdown
legible: los mensajes, el razonamiento y las llamadas a herramientas con su
salida.

Uso:

    python3 scripts/exportar-sesion.py <session_id> <salida.md>

Para saber el `session_id` de la sesión en curso:

    sqlite3 ~/.local/share/opencode/opencode.db \
      "SELECT id, title, time_created FROM session_v2 ORDER BY time_created DESC LIMIT 5"
"""

import json
import os
import sqlite3
import sys
from datetime import datetime, timezone

DB = os.path.expanduser('~/.local/share/opencode/opencode.db')


def cargar(session_id):
    con = sqlite3.connect(f'file:{DB}?mode=ro', uri=True)
    cur = con.cursor()
    cur.execute(
        'SELECT seq, type, data FROM session_message WHERE session_id=? ORDER BY seq',
        (session_id,),
    )
    return cur.fetchall()


def hora(ms):
    if not ms:
        return ''
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).astimezone().strftime(
        '%H:%M:%S'
    )


def texto_herramienta(state):
    """Extrae el comando o la llamada de una herramienta."""
    entrada = state.get('input') or {}
    if isinstance(entrada, dict):
        for clave in ('command', 'filePath', 'path', 'pattern', 'query', 'url', 'prompt'):
            if clave in entrada:
                valor = entrada[clave]
                return f'{clave}: {valor}' if not isinstance(valor, str) else valor
        return json.dumps(entrada, ensure_ascii=False)
    return str(entrada)


def salida_herramienta(state):
    contenido = state.get('content')
    if contenido is None:
        return ''
    if isinstance(contenido, str):
        return contenido
    if isinstance(contenido, list):
        partes = []
        for pieza in contenido:
            if isinstance(pieza, dict):
                partes.append(pieza.get('text') or json.dumps(pieza, ensure_ascii=False))
            else:
                partes.append(str(pieza))
        return '\n'.join(partes)
    return json.dumps(contenido, ensure_ascii=False)


def main():
    session_id = sys.argv[1]
    salida = sys.argv[2]

    mensajes = cargar(session_id)
    lineas = []
    lineas.append(f'# Transcripción de la sesión `{session_id}`')
    lineas.append('')
    lineas.append(
        f'Generada el {datetime.now().strftime("%Y-%m-%d %H:%M")} desde el historial de '
        'opencode. Incluye los mensajes, las llamadas a herramientas y su salida.'
    )
    lineas.append('')
    lineas.append('---')
    lineas.append('')

    for seq, tipo, datos in mensajes:
        d = json.loads(datos)
        creado = (d.get('time') or {}).get('created')

        if tipo == 'user':
            texto = (d.get('text') or '').strip()
            if not texto:
                continue
            lineas.append(f'## 👤 Usuario · {hora(creado)}')
            lineas.append('')
            lineas.append(texto)
            lineas.append('')
            continue

        if tipo == 'assistant':
            for parte in d.get('content', []):
                tipo_parte = parte.get('type')

                if tipo_parte == 'text':
                    texto = (parte.get('text') or '').strip()
                    if not texto:
                        continue
                    lineas.append(f'## 🤖 Asistente · {hora(creado)}')
                    lineas.append('')
                    lineas.append(texto)
                    lineas.append('')

                elif tipo_parte == 'reasoning':
                    texto = (parte.get('text') or '').strip()
                    if not texto:
                        continue
                    lineas.append(f'<details><summary>💭 Razonamiento · {hora(creado)}</summary>')
                    lineas.append('')
                    lineas.append('```text')
                    lineas.append(texto)
                    lineas.append('```')
                    lineas.append('')
                    lineas.append('</details>')
                    lineas.append('')

                elif tipo_parte == 'tool':
                    state = parte.get('state') or {}
                    meta = state.get('metadata') or {}
                    nombre = (parte.get('name') or 'herramienta').strip()
                    estado = meta.get('status', state.get('status', '?'))
                    invocacion = texto_herramienta(state)
                    resultado = salida_herramienta(state)
                    recortado = ' (salida recortada)' if meta.get('truncated') else ''

                    lineas.append(f'### 🔧 {nombre} · {estado} · {hora(creado)}')
                    lineas.append('')
                    lineas.append('```text')
                    lineas.append(invocacion)
                    lineas.append('```')
                    if resultado:
                        lineas.append('')
                        lineas.append('```text')
                        lineas.append(resultado.rstrip())
                        lineas.append('```')
                    if recortado:
                        lineas.append('')
                        lineas.append(f'_Salida recortada por la herramienta.{recortado}')
                    lineas.append('')

    with open(salida, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lineas) + '\n')

    print(f'Escrita {salida} ({len(mensajes)} mensajes, {os.path.getsize(salida)/1024:.0f} kB)')


if __name__ == '__main__':
    main()
