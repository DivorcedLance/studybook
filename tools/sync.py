"""Sincroniza la navegación de Studybook a partir de tools/catalog.json y del contenido de cada página de unidad.

Reescribe solo los bloques marcados con <!-- sb:NOMBRE --> ... <!-- /sb:NOMBRE -->:
  docs/index.html                sb:courses       tarjetas de cursos
  docs/<curso>/index.html         sb:course-units  tarjetas de unidades (con conteos)
  docs/<curso>/unidad-N.html      sb:units         barra de unidades
y actualiza el «· N ejercicios» de cada botón de tema. No toca nada más.

Uso: python tools/sync.py          (desde la raíz del repo)
"""
import json, os, re, sys, html as H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, 'docs')
cat = json.load(open(os.path.join(ROOT, 'tools', 'catalog.json'), encoding='utf-8'))
changed = []

def read(p): return open(p, encoding='utf-8').read()
def write(p, s):
    if read(p) != s:
        open(p, 'w', encoding='utf-8', newline='\n').write(s); changed.append(os.path.relpath(p, ROOT))
def block(s, name, content, path):
    pat = re.compile(r'(<!-- sb:%s -->)(.*?)(<!-- /sb:%s -->)' % (name, name), re.S)
    if not pat.search(s): sys.exit('falta el bloque sb:%s en %s' % (name, path))
    return pat.sub(lambda m: m.group(1) + content + m.group(3), s, count=1)

def panel(s, pid):
    """Contenido del panel con id=pid (hasta el siguiente panel o el final del .wrap)."""
    m = re.search(r'<div class="panel" id="%s"' % re.escape(pid), s)
    if not m: return ''
    n = re.search(r'<div class="panel" id="|<div class="teo-card"', s[m.end():])
    return s[m.start(): m.end() + (n.start() if n else len(s))]

def stats(path):
    s = read(path)
    topics = re.findall(r'<button class="topic" data-topic="([^"]+)"[^>]*><span class="t-name">(.*?)</span>', s)
    out = []
    for tid, name in topics:
        out.append(dict(id=tid, name=name,
            ej=len(re.findall(r'<article class="ej"[ >]', panel(s, 'pn-%s-ejercicios' % tid))),
            ex=len(re.findall(r'<article class="ej ex[ "]', panel(s, 'pn-%s-ejemplos' % tid))),
            sl=len(re.findall(r'<article class="ej sl[ "]', panel(s, 'pn-%s-solucionarios' % tid))),
            iw=len(re.findall(r'<section class="iw"', panel(s, 'pn-%s-interactivo' % tid)))))
    return s, out

# ---------- índice de búsqueda ----------
def tex2txt(t):
    """LaTeX simple → texto legible (solo para buscar y mostrar fragmentos)."""
    t = re.sub(r'\\[()\[\]]', ' ', t)
    for _ in range(3):
        t = re.sub(r'\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}', r'\1/\2', t)
        t = re.sub(r'\\(?:az|na|mo|ve|ma|am|ce|text|mathrm|textbf|boldsymbol|underbrace|overline)\{([^{}]*)\}', r'\1', t)
        t = re.sub(r'\\sqrt\{([^{}]*)\}', r'√\1', t)
    rep = {r'\cdot': '·', r'\times': '×', r'\le': '≤', r'\ge': '≥', r'\lt': '<', r'\gt': '>', r'\ne': '≠', r'\in': '∈', r'\forall': '∀',
           r'\mathbb N': 'ℕ', r'\mathbb R': 'ℝ', r'\sum': 'Σ', r'\pi': 'π', r'\Delta': 'Δ', r'\%': '%', r'\infty': '∞', r'\dots': '…', r'\cdots': '…', r'\ldots': '…'}
    for a, b in rep.items(): t = t.replace(a, b)
    t = re.sub(r'\^\{?2\}?', '²', t); t = re.sub(r'\^\{?3\}?', '³', t)
    t = re.sub(r'\\(left|right|displaystyle|quad|qquad|,|;|!|\s)', ' ', t)
    t = re.sub(r'\\[a-zA-Z]+', ' ', t)
    t = t.replace('{', '').replace('}', '').replace('_', '')
    return re.sub(r'\s+', ' ', t).strip()
def plain(h): return tex2txt(H.unescape(re.sub(r'<[^>]+>', ' ', h)))

KIND = {'teoria': 'Teoría', 'ejercicios': 'Ejercicio', 'ejemplos': 'Ejemplo', 'solucionarios': 'Solucionario', 'interactivo': 'Interactivo'}
def index_page(s, href, where_unit, topic_names):
    items = []
    panels = [(m.start(), m.group(1), m.group(2)) for m in re.finditer(r'<div class="panel" id="pn-([a-z-]+)-(teoria|ejercicios|ejemplos|solucionarios|interactivo)"', s)]
    def at(i):
        cur = None
        for p in panels:
            if p[0] <= i: cur = p
        return cur
    for m in re.finditer(r'<article class="ej([^"]*)" id="([^"]+)">(.*?)</article>', s, re.S):
        p = at(m.start());  body = m.group(3)
        if not p: continue
        num = re.search(r'<span class="num">(.*?)</span>', body); tit = re.search(r'<h3>(.*?)</h3>', body, re.S)
        en = re.search(r'<div class="enun">(.*?)</div>', body, re.S)
        src = re.search(r'<span class="chip src">(.*?)</span>', body)
        items.append(dict(u=href + '#' + m.group(2), k=KIND[p[2]], n=plain(num.group(1)) if num else '', t=plain(tit.group(1)) if tit else '',
                          w=where_unit + ' · ' + topic_names.get(p[1], ''), s=plain(src.group(1)) if src else '', x=plain(en.group(1))[:260] if en else ''))
    for m in re.finditer(r'<div class="box" id="(t-[^"]+)">\s*<h2[^>]*>(.*?)</h2>(.*?)</div>', s, re.S):
        p = at(m.start())
        if not p: continue
        items.append(dict(u=href + '#' + m.group(1), k='Teoría', n='', t=plain(m.group(2)), w=where_unit + ' · ' + topic_names.get(p[1], ''), s='', x=plain(m.group(3))[:200]))
    for m in re.finditer(r'<section class="iw" data-iw="[^"]+" id="([^"]+)">\s*<h2[^>]*>(.*?)</h2>\s*<p class="iw-lead">(.*?)</p>', s, re.S):
        p = at(m.start())
        items.append(dict(u=href + '#' + m.group(1), k='Interactivo', n='', t=plain(m.group(2)), w=where_unit + ' · ' + topic_names.get(p[1], '') if p else where_unit, s='', x=plain(m.group(3))[:200]))
    ids = re.findall(r'<article class="ej[^"]*" id="([^"]+)">', s)
    return items, ids
SEARCH = {'items': [], 'units': {}}

def plural(n, uno, varios): return '%d %s' % (n, uno if n == 1 else varios)

course_cards = []
for c in cat['courses']:
    cdir = os.path.join(WEB, c['id'])
    units = c['units']
    avail = [u for u in units if u.get('page')]
    info = {}
    for u in avail:
        p = os.path.join(cdir, u['page'])
        s, st = stats(p)
        # «· N ejercicios» en los botones de tema
        for t in st:
            s = re.sub(r'(<button class="topic" data-topic="%s"[^>]*>.*?<span class="t-sub">[^<]*?)(?: · \d+ ejercicios?)?(</span>)' % re.escape(t['id']),
                       lambda m: m.group(1) + (' · ' + plural(t['ej'], 'ejercicio', 'ejercicios') if t['ej'] else '') + m.group(2), s, count=1, flags=re.S)
        info[u['n']] = (p, s, st)
        href = c['id'] + '/' + u['page']
        items, ids = index_page(s, href, '%s · Unidad %d' % (c['name'], u['n']), {t['id']: H.unescape(t['name']) for t in st})
        SEARCH['items'] += items
        SEARCH['units'][href[:-5]] = dict(course=c['id'], n=u['n'], total=len(ids), ej=sum(t['ej'] for t in st))
    # barra de unidades (solo las que ya tienen página)
    for u in avail:
        p, s, st = info[u['n']]
        bar = '<nav class="units" aria-label="Unidades">' + ''.join(
            '<a class="unit" href="%s"%s><span class="u-n">Unidad %d</span><span class="u-t">%s</span></a>' % (
                v['page'], ' aria-current="page"' if v is u else '', v['n'], H.escape(v.get('short', v['title'])))
            for v in avail) + '</nav>'
        write(p, block(s, 'units', bar, p))
    # tarjetas de unidades en la página del curso
    cards = []
    tot = dict(ej=0, ex=0, sl=0)
    for u in units:
        if u.get('page'):
            _, _, st = info[u['n']]
            ej, ex, sl, iw = (sum(t[k] for t in st) for k in ('ej', 'ex', 'sl', 'iw'))
            tot['ej'] += ej; tot['ex'] += ex; tot['sl'] += sl
            chips = ''.join('<li><a href="%s#%s">%s</a></li>' % (u['page'], t['id'], t['name']) for t in st)
            meta = ' · '.join(x for x in (plural(ej, 'ejercicio resuelto', 'ejercicios resueltos') if ej else '',
                                          plural(ex, 'ejemplo', 'ejemplos') if ex else '',
                                          plural(sl, 'problema de solucionario', 'problemas de solucionario') if sl else '',
                                          plural(iw, 'elemento interactivo', 'elementos interactivos') if iw else '') if x)
            cards.append('<li class="ucard"><a class="ucard-main" href="%s"><span class="u-n">Unidad %d</span><span class="u-title">%s</span><span class="u-meta">%s</span></a><div class="prog" data-unit="%s/%s" hidden></div><ul class="u-topics">%s</ul></li>' % (
                u['page'], u['n'], H.escape(u['title']), meta, c['id'], u['page'][:-5], chips))
        else:
            chips = ''.join('<li><span>%s</span></li>' % H.escape(t) for t in u.get('topics', []))
            cards.append('<li class="ucard soon"><details><summary class="ucard-main"><span class="u-n">Unidad %d · aún sin material</span><span class="u-title">%s</span></summary><ul class="u-topics">%s</ul></details></li>' % (
                u['n'], H.escape(u['title']), chips))
    cp = os.path.join(cdir, 'index.html')
    write(cp, block(read(cp), 'course-units', '<ol class="ucards">' + ''.join(cards) + '</ol>', cp))
    first = avail[0]['page'] if avail else 'index.html'
    course_cards.append('<li class="ccard"><a href="%s/index.html"><span class="label">%s · %s</span><span class="c-name">%s</span><span class="c-full">%s</span><span class="c-meta">%s · %s · %s</span><span class="prog" data-course="%s" hidden></span></a></li>' % (
        c['id'], H.escape(c['school']), c['term'], H.escape(c['name']), H.escape(c['full']),
        plural(len(avail), 'unidad disponible', 'unidades disponibles'),
        plural(tot['ej'], 'ejercicio resuelto', 'ejercicios resueltos'),
        plural(tot['sl'], 'problema de solucionario', 'problemas de solucionario'), c['id']))
hp = os.path.join(WEB, 'index.html')
write(hp, block(read(hp), 'courses', '<ul class="ccards">' + ''.join(course_cards) + '</ul>', hp))
# índice de búsqueda (script clásico: funciona también abriendo los archivos en local)
ip = os.path.join(WEB, 'js', 'search-index.js')
js = '/* Generado por tools/sync.py: no editar a mano. */\nwindow.SB_INDEX=' + json.dumps(SEARCH, ensure_ascii=False, separators=(',', ':')) + ';\n'
if not os.path.exists(ip) or read(ip) != js:
    open(ip, 'w', encoding='utf-8', newline='\n').write(js); changed.append(os.path.relpath(ip, ROOT))
print('índice: %d entradas' % len(SEARCH['items']))
print('cambiados:', ', '.join(changed) if changed else 'ninguno')
