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
            sl=len(re.findall(r'<article class="ej sl[ "]', panel(s, 'pn-%s-solucionarios' % tid)))))
    return s, out

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
            ej, ex, sl = (sum(t[k] for t in st) for k in ('ej', 'ex', 'sl'))
            tot['ej'] += ej; tot['ex'] += ex; tot['sl'] += sl
            chips = ''.join('<li><a href="%s#%s">%s</a></li>' % (u['page'], t['id'], t['name']) for t in st)
            meta = ' · '.join(x for x in (plural(ej, 'ejercicio resuelto', 'ejercicios resueltos') if ej else '',
                                          plural(ex, 'ejemplo', 'ejemplos') if ex else '',
                                          plural(sl, 'problema de solucionario', 'problemas de solucionario') if sl else '') if x)
            cards.append('<li class="ucard"><a class="ucard-main" href="%s"><span class="u-n">Unidad %d</span><span class="u-title">%s</span><span class="u-meta">%s</span></a><ul class="u-topics">%s</ul></li>' % (
                u['page'], u['n'], H.escape(u['title']), meta, chips))
        else:
            chips = ''.join('<li><span>%s</span></li>' % H.escape(t) for t in u.get('topics', []))
            cards.append('<li class="ucard soon"><div class="ucard-main"><span class="u-n">Unidad %d</span><span class="u-title">%s</span><span class="u-meta">Aún sin material en la página</span></div><ul class="u-topics">%s</ul></li>' % (
                u['n'], H.escape(u['title']), chips))
    cp = os.path.join(cdir, 'index.html')
    write(cp, block(read(cp), 'course-units', '<ol class="ucards">' + ''.join(cards) + '</ol>', cp))
    first = avail[0]['page'] if avail else 'index.html'
    course_cards.append('<li class="ccard"><a href="%s/index.html"><span class="label">%s · %s</span><span class="c-name">%s</span><span class="c-full">%s</span><span class="c-meta">%s · %s · %s</span></a></li>' % (
        c['id'], H.escape(c['school']), c['term'], H.escape(c['name']), H.escape(c['full']),
        plural(len(avail), 'unidad disponible', 'unidades disponibles'),
        plural(tot['ej'], 'ejercicio resuelto', 'ejercicios resueltos'),
        plural(tot['sl'], 'problema de solucionario', 'problemas de solucionario')))
hp = os.path.join(WEB, 'index.html')
write(hp, block(read(hp), 'courses', '<ul class="ccards">' + ''.join(course_cards) + '</ul>', hp))
print('cambiados:', ', '.join(changed) if changed else 'ninguno')
