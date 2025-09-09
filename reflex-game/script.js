(() => {
  const target = document.getElementById('target')
  const targetText = document.getElementById('targetText')
  const timeEl = document.getElementById('time')
  const bestEl = document.getElementById('best')
  const resetBtn = document.getElementById('resetBtn')
  const shareBtn = document.getElementById('shareBtn')

  let timeoutId = null
  let startTime = 0
  let state = 'idle' // idle -> waiting -> ready -> go -> result
  let best = Number(localStorage.getItem('reflex_best') || Infinity)
  if (best !== Infinity) bestEl.textContent = best

  function randDelay(min=1000, max=3000){
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function toWaiting(){
    state = 'waiting'
    target.className = 'target waiting'
    targetText.textContent = 'クリックしてスタート'
  }

  function startRound(){
    state = 'ready'
    target.className = 'target ready'
    targetText.textContent = '準備中...'

    const delay = randDelay(1000, 3000)
    timeoutId = setTimeout(() => {
      state = 'go'
      target.className = 'target go'
      targetText.textContent = 'クリック！'
      startTime = performance.now()
    }, delay)
  }

  function earlyPress(){
    clearTimeout(timeoutId)
    state = 'idle'
    target.className = 'target early'
    targetText.textContent = '早すぎます！早押しです'
    timeEl.textContent = '-'
    setTimeout(() => toWaiting(), 800)
  }

  function recordHit(){
    if (state !== 'go') return
    const reaction = Math.round(performance.now() - startTime)
    timeEl.textContent = reaction
    if (reaction < best){
      best = reaction
      localStorage.setItem('reflex_best', best)
      bestEl.textContent = best
    }
    state = 'result'
    target.className = 'target ready'
    targetText.textContent = '結果 — もう一度クリックで再挑戦'
  }

  target.addEventListener('click', () => {
    if (state === 'idle' || state === 'waiting'){
      startRound()
      return
    }
    if (state === 'ready'){
      earlyPress()
      return
    }
    if (state === 'go'){
      recordHit()
      return
    }
    if (state === 'result'){
      startRound()
      return
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space'){
      e.preventDefault()
      target.click()
    }
  })

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('reflex_best')
    best = Infinity
    bestEl.textContent = '-' 
    timeEl.textContent = '-'
    clearTimeout(timeoutId)
    toWaiting()
  })

  shareBtn.addEventListener('click', async () => {
    const text = `反射神経チャレンジ — 今回の反応: ${timeEl.textContent} ms / ベスト: ${bestEl.textContent} ms`
    try{
      await navigator.clipboard.writeText(text)
      shareBtn.textContent = 'コピーしました！'
      setTimeout(()=> shareBtn.textContent = 'コピーして共有',1200)
    }catch(e){
      alert('クリップボードにコピーできませんでした')
    }
  })

  toWaiting()
  target.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') target.click()
  })
})()
