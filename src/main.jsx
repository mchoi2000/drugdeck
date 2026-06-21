import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RotateCcw, Shuffle, Check, X, Sparkles, SlidersHorizontal, Layers } from 'lucide-react'
import drugs from './data/top200.json'
import quizBank from './data/top200_quiz.json'
import meta from './data/drugdeck_metadata.json'
import './styles.css'

const BrandName = ({ name, className = '' }) => (
  <span className={className}>{name}<sup className="ml-0.5 align-super text-[0.36em] leading-none">®</sup></span>
)
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const uniq = (arr) => [...new Set(arr)].filter(Boolean)

function App() {
  const areas = useMemo(() => uniq(drugs.map((d) => d.area)).sort(), [])
  const [selectedAreas, setSelectedAreas] = useState(areas)
  const classesForAreas = useMemo(() => {
    return uniq(drugs.filter((d) => selectedAreas.includes(d.area)).map((d) => d.class)).sort()
  }, [selectedAreas])
  const [selectedClasses, setSelectedClasses] = useState(() => uniq(drugs.map((d) => d.class)).sort())
  const activeClasses = selectedClasses.filter((c) => classesForAreas.includes(c))

  const scopedDrugs = useMemo(() => {
    return drugs.filter((d) => selectedAreas.includes(d.area) && activeClasses.includes(d.class))
  }, [selectedAreas, activeClasses])
  const scopedQuizzes = useMemo(() => {
    return quizBank.filter((q) => selectedAreas.includes(q.area) && activeClasses.includes(q.class))
  }, [selectedAreas, activeClasses])

  const [mode, setMode] = useState('cards')
  const [cardFrontKind, setCardFrontKind] = useState('generic')

  return (
    <main className="min-h-screen bg-eleo-soft text-eleo-ink">
      <Header />
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-16 pt-4 md:grid-cols-[320px_1fr] md:px-6 lg:px-8">
        <ScopePanel
          areas={areas}
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          classes={classesForAreas}
          selectedClasses={activeClasses}
          setSelectedClasses={setSelectedClasses}
          scopedCount={scopedDrugs.length}
          quizCount={scopedQuizzes.length}
        />
        <section className="space-y-4">
          <ModeTabs mode={mode} setMode={setMode} />
          {mode === 'cards' ? (
            <Flashcards scopedDrugs={scopedDrugs} frontKind={cardFrontKind} setFrontKind={setCardFrontKind} />
          ) : (
            <Quiz scopedQuizzes={scopedQuizzes} />
          )}
        </section>
      </section>
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-5 md:px-6 lg:px-8">
      <nav className="flex items-center justify-between border-b pb-4 text-sm text-eleo-muted">
        <a href="https://www.eleolabs.com" className="font-serif text-xl font-normal tracking-tight text-eleo-ink">Eleo<span className="text-eleo-green">Labs</span></a>
        <a href="/" className="rounded-md border border-eleo-green/30 bg-white px-3 py-1.5 hover:border-eleo-green hover:text-eleo-ink">Home</a>
      </nav>
      <div className="rounded-2xl border border-eleo-line bg-eleo-card p-6 shadow-soft md:p-8">
        <h1 className="mt-5 max-w-5xl font-serif text-3xl font-light leading-tight tracking-[-0.03em] md:text-5xl">Master top 200 drugs by <em className="text-eleo-green">therapeutic scope</em>.</h1>
        <p className="mt-4 max-w-1xl text-base font-light leading-7 text-eleo-muted md:text-lg">Start with generic names and progress to brand names. Learn 'more' about each drug.</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-eleo-muted">
        </div>
      </div>
    </header>
  )
}

function Pill({ children }) {
  return <span className="rounded-full border border-eleo-green/20 bg-white/70 px-3 py-1">{children}</span>
}

function ScopePanel({ areas, selectedAreas, setSelectedAreas, classes, selectedClasses, setSelectedClasses, scopedCount, quizCount }) {
  const toggle = (value, selected, setter) => {
    setter(selected.includes(value) ? selected.filter((x) => x !== value) : [...selected, value])
  }
  return (
    <aside className="h-fit rounded-2xl border border-eleo-line bg-eleo-card p-4 shadow-soft md:sticky md:top-8">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-eleo-green" />
        <h2 className="text-lg font-medium">Study scope</h2>
      </div>
      <ScopeGroup title="Therapeutic Area" items={areas} selected={selectedAreas} onToggle={(v) => toggle(v, selectedAreas, setSelectedAreas)} onAll={() => setSelectedAreas(areas)} onNone={() => setSelectedAreas([])} />
      <ScopeGroup title="Class" items={classes} selected={selectedClasses} onToggle={(v) => toggle(v, selectedClasses, setSelectedClasses)} onAll={() => setSelectedClasses(classes)} onNone={() => setSelectedClasses([])} />
    </aside>
  )
}

function ScopeGroup({ title, items, selected, onToggle, onAll, onNone }) {
  return (
    <div className="border-t border-eleo-line py-4 first:border-t-0 first:pt-0">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-eleo-muted">{title}</h3>
        <div className="flex gap-2 text-xs text-eleo-green">
          <button onClick={onAll} className="hover:underline">select all</button>
          <button onClick={onNone} className="hover:underline">deselect all</button>
        </div>
      </div>
      <div className="max-h-56 space-y-1 overflow-auto pr-1">
        {items.map((item) => (
          <label key={item} className="flex cursor-pointer items-start gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-eleo-sage">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} className="mt-1 accent-eleo-green" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ModeTabs({ mode, setMode }) {
  return (
    <div className="flex rounded-full border border-eleo-green/25 bg-eleo-card p-1 shadow-soft">
      <button onClick={() => setMode('cards')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'cards' ? 'bg-eleo-green text-white' : 'text-eleo-muted hover:text-eleo-green'}`}>Generic ↔ Brand</button>
      <button onClick={() => setMode('quiz')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'quiz' ? 'bg-eleo-muted text-white' : 'text-eleo-muted hover:text-eleo-green'}`}>Test</button>
    </div>
  )
}

function Flashcards({ scopedDrugs, frontKind, setFrontKind }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [order, setOrder] = useState([])

  const cards = useMemo(() => {
    if (frontKind === 'brand') {
      return scopedDrugs.flatMap((drug) => drug.brands.map((brand) => ({ drug, front: brand, kind: 'brand' })))
    }
    return scopedDrugs.map((drug) => ({ drug, front: drug.generic, kind: 'generic' }))
  }, [scopedDrugs, frontKind])
  const list = useMemo(() => (order.length ? order.map((i) => cards[i]).filter(Boolean) : cards), [cards, order])
  const item = list[index % Math.max(list.length, 1)]

  const next = () => { setIndex((i) => (i + 1) % Math.max(list.length, 1)); setFlipped(false); setShowMore(false) }
  const randomize = () => { setOrder(shuffle(cards.map((_, i) => i))); setIndex(0); setFlipped(false); setShowMore(false) }
  const setFront = (kind) => { setFrontKind(kind); setIndex(0); setOrder([]); setFlipped(false); setShowMore(false) }

  if (!item) return <EmptyState />

  return (
    <div className="rounded-2xl border border-eleo-line bg-eleo-card p-4 shadow-soft md:p-6">
      <div className="mb-4 flex flex-col gap-3 text-sm text-eleo-muted md:flex-row md:items-center md:justify-between">
        <span>{index + 1} / {list.length}</span>
        <div className="flex flex-wrap items-center gap-2">
          <FrontKindToggle frontKind={frontKind} setFront={setFront} />
          <button onClick={randomize} className="inline-flex items-center gap-1 rounded-full border border-eleo-green/30 px-3 py-1 hover:border-eleo-green hover:text-eleo-ink"><Shuffle className="h-3.5 w-3.5" /> shuffle</button>
        </div>
      </div>
      <button onClick={() => { setFlipped((v) => !v); if (flipped) setShowMore(false) }} className={`min-h-[420px] w-full rounded-[1.4rem] border border-eleo-green/25 p-8 text-center transition ${flipped ? 'bg-eleo-green/20' : 'bg-gradient-to-b from-white to-eleo-soft'} hover:-translate-y-0.5 hover:border-eleo-green/50 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-eleo-green/20`}>
        {!flipped ? (
          <FrontCard item={item} />
        ) : (
          <BackCard item={item} showMore={showMore} setShowMore={setShowMore} />
        )}
      </button>
      <div className="mt-4 flex gap-3">
        {/* <button onClick={() => { setFlipped(false); setShowMore(false) }} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-eleo-green/30 px-4 py-3 text-sm font-medium hover:border-eleo-green hover:text-eleo-green"><RotateCcw className="h-4 w-4" /> back</button> */}
        <button onClick={next} className="flex flex-1 items-center justify-center rounded-full bg-eleo-green px-4 py-3 text-sm font-medium text-white hover:bg-[#0B7D5C]">next</button>
      </div>
    </div>
  )
}

function FrontKindToggle({ frontKind, setFront }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-eleo-green/30 bg-white p-1">
      <span className="hidden items-center gap-1 px-2 text-xs text-eleo-muted sm:inline-flex"><Layers className="h-3.5 w-3.5" /> front:</span>
      <button onClick={() => setFront('generic')} className={`rounded-full px-3 py-1 text-xs font-medium ${frontKind === 'generic' ? 'bg-eleo-green text-white' : 'text-eleo-muted hover:text-eleo-ink'}`}>generic</button>
      <button onClick={() => setFront('brand')} className={`rounded-full px-3 py-1 text-xs font-medium ${frontKind === 'brand' ? 'bg-eleo-green text-white' : 'text-eleo-muted hover:text-eleo-ink'}`}>brand</button>
    </div>
  )
}

function FrontCard({ item }) {
  return (
    <div className="relative h-[360px] w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        {item.kind === 'brand' ? (
          <BrandName
            name={item.front}
            className="text-4xl font-medium tracking-tight md:text-4xl"
          />
        ) : (
          <p className="text-4xl font-medium tracking-tight md:text-4xl">
            {item.front}
          </p>
        )}
      </div>
      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm text-eleo-muted">
        tap to flip
      </p>
    </div>
  )
}

function BackCard({ item, showMore, setShowMore }) {
  const card = item.drug
  const isBrandFront = item.kind === 'brand'
  return (
    <div className="mx-auto flex min-h-[360px] max-w-xl flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold tracking-tight text-eleo-muted md:text-base">
        {isBrandFront ? <BrandName name={item.front} /> : card.generic}
      </p>
      <div className="mt-7 space-y-3">
        {isBrandFront ? (
          <p className="text-4xl font-medium tracking-tight md:text-4xl">{card.generic}</p>
        ) : (
          card.brands.map((brand) => <p key={brand}><BrandName name={brand} className="text-4xl font-medium tracking-tight md:text-4xl" /></p>)
        )}
      </div>
      {!showMore && <button onClick={(e) => { e.stopPropagation(); setShowMore(true) }} className="mt-10 text-sm lowercase text-eleo-muted underline-offset-4 hover:text-eleo-green hover:underline">more</button>}
      {showMore && <DrugProfile card={card} />}
    </div>
  )
}

function DrugProfile({ card }) {
  const ses = [...card.side_effects.common, ...card.side_effects.serious]
  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-8 w-full rounded-3xl bg-white/80 p-5 text-left text-sm md:text-base">
      <div className="grid gap-3 md:grid-cols-3">
        <Mini label="Area" value={card.area} />
        <Mini label="Category" value={card.category || '—'} />
        <Mini label="Class" value={card.class} />
      </div>
      <Info title="MOA" value={card.moa.short} />
      <Info title="Side effects" value={ses.join(' • ')} />
      <Info title="Interactions" value={card.interactions.map((i) => `${i.with}: ${i.effect}`).join(' • ')} />
    </div>
  )
}

function Mini({ label, value }) {
  return <div className="rounded-2xl bg-eleo-sage p-3"><p className="text-xs uppercase tracking-[0.16em] text-eleo-muted">{label}</p><p className="mt-1 font-medium">{value}</p></div>
}
function Info({ title, value }) {
  return <div className="mt-4"><p className="text-xs font-medium uppercase tracking-[0.16em] text-eleo-muted">{title}</p><p className="mt-1 leading-7 text-eleo-ink">{value}</p></div>
}

function Quiz({ scopedQuizzes }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [pool, setPool] = useState(() => shuffle(scopedQuizzes))
  React.useEffect(() => { setPool(shuffle(scopedQuizzes)); setIdx(0); setSelected(null) }, [scopedQuizzes])
  const q = pool[idx % Math.max(pool.length, 1)]
  if (!q) return <EmptyState />
  const isDone = selected !== null
  const next = () => { setIdx((i) => (i + 1) % Math.max(pool.length, 1)); setSelected(null) }
  return (
    <div className="rounded-2xl border border-eleo-line bg-eleo-card p-5 shadow-soft md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm text-eleo-muted">
        <span>{idx + 1} / {pool.length}</span>
        <span className="rounded-full bg-eleo-sage px-3 py-1">{q.type.replaceAll('_', ' ')}</span>
      </div>
      <div className="rounded-[1.4rem] border border-eleo-line bg-white/75 p-6">
        <p className="text-sm text-eleo-muted">{q.area} · {q.class}</p>
        <h2 className="mt-3 text-2xl font-medium leading-snug md:text-4xl">{q.prompt}</h2>
        <div className="mt-7 grid gap-3">
          {q.choices.map((c) => {
            const correct = c === q.answer
            const chosen = c === selected
            let style = 'border-eleo-green/25 bg-white hover:border-eleo-green'
            if (isDone && correct) style = 'border-green-500 bg-green-50'
            if (isDone && chosen && !correct) style = 'border-red-400 bg-red-50'
            return <button key={c} onClick={() => !isDone && setSelected(c)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition md:text-base ${style}`}><span>{c}</span>{isDone && correct && <Check className="h-4 w-4 text-green-600" />}{isDone && chosen && !correct && <X className="h-4 w-4 text-red-500" />}</button>
          })}
        </div>
        {isDone && <div className="mt-5 rounded-2xl bg-eleo-sage p-4 text-sm leading-6 text-eleo-ink"><Sparkles className="mb-2 h-4 w-4 text-eleo-green" />{q.explanation}</div>}
      </div>
      <button onClick={next} className="mt-5 w-full rounded-full bg-eleo-muted px-4 py-3 text-sm font-medium text-white hover:bg-eleo-green">next question</button>
    </div>
  )
}

function EmptyState() {
  return <div className="rounded-2xl border border-eleo-line bg-eleo-card p-8 text-center text-eleo-muted shadow-soft">Select at least one area and one class to start.</div>
}

function Footer() {
  return <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-6 text-eleo-muted md:px-6 lg:px-8">Study aid only. Eleo Labs © 2026. info@eleolabs.com</footer>
}

createRoot(document.getElementById('root')).render(<App />)
