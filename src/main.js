import './style.css'
import { marked } from 'marked'
import droneImg from './assets/drone.png'

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <header>
      <div class="drone-illustration">
        <img src="${droneImg}" alt="Drone illustration" style="width: 100%; height: 100%; object-fit: contain;">
      </div>
      <h1>Drone <span>Planner</span></h1>
      <p>Planificación inteligente de rutas para drones agrícolas</p>
    </header>

    <div class="form-card">
      <p class="form-card-title">Datos del cultivo</p>
      <div class="form-grid">
        <div class="field">
          <div class="field-icon-label">
            <div class="field-icon">🌱</div>
            Tipo de cultivo
          </div>
          <input id="cultivo" type="text" placeholder="Ej: Maíz, Arroz, Café..." />
        </div>
        <div class="field">
          <div class="field-icon-label">
            <div class="field-icon">📐</div>
            Área (hectáreas)
          </div>
          <input id="area" type="number" min="0.5" max="100" step="0.5" placeholder="Ej: 5" />
        </div>
        <div class="field">
          <div class="field-icon-label">
            <div class="field-icon">🗺️</div>
            Forma del campo
          </div>
          <select id="forma">
            <option value="">Selecciona...</option>
            <option value="rectangular">Rectangular</option>
            <option value="irregular">Irregular</option>
            <option value="triangular">Triangular</option>
            <option value="en L">En L</option>
          </select>
        </div>
        <div class="field">
          <div class="field-icon-label">
            <div class="field-icon">💧</div>
            Insumo a aplicar
          </div>
          <select id="insumo">
            <option value="">Selecciona...</option>
            <option value="agua">Agua</option>
            <option value="fertilizante">Fertilizante</option>
            <option value="pesticida">Pesticida</option>
            <option value="fungicida">Fungicida</option>
          </select>
        </div>
        <div class="field full">
          <div class="field-icon-label">
            <div class="field-icon">🔍</div>
            Condición actual del cultivo
          </div>
          <select id="condicion">
            <option value="">Selecciona...</option>
            <option value="seco / necesita riego urgente">Seco / necesita riego urgente</option>
            <option value="con plagas visibles">Con plagas visibles</option>
            <option value="normal / mantenimiento">Normal / mantenimiento</option>
            <option value="post-siembra">Post-siembra</option>
            <option value="en floración">En floración</option>
          </select>
        </div>
      </div>
      <button class="btn-generar" id="btn-generar">Generar plan de ruta →</button>

      <div class="progress-bar-container" id="progress-container">
        <div class="progress-steps">
          <div class="progress-step" id="step-1">
            <div class="step-dot"></div>
            Analizando datos del cultivo...
          </div>
          <div class="progress-step" id="step-2">
            <div class="step-dot"></div>
            Calculando patrón de vuelo óptimo...
          </div>
          <div class="progress-step" id="step-3">
            <div class="step-dot"></div>
            Estimando insumos y tiempos...
          </div>
          <div class="progress-step" id="step-4">
            <div class="step-dot"></div>
            Generando plan final...
          </div>
        </div>
      </div>
    </div>

    <div class="result-card" id="result-card">
      <div class="result-header">
        <h2 id="result-title">Plan generado</h2>
        <span class="badge">✓ Listo</span>
      </div>
      <div class="result-body" id="result-body"></div>
      <div class="grid-section">
        <h3>Vista esquemática del campo</h3>
        <div id="field-grid"></div>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot" style="background:rgba(74,222,128,0.25);border:1px solid #4ade80"></div> Inicio
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background:rgba(26,74,42,0.8);border:1px solid rgba(74,222,128,0.3)"></div> Ruta
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.5)"></div> Fin
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background:rgba(45,122,69,0.2);border:1px solid rgba(45,122,69,0.3)"></div> Campo
          </div>
        </div>
      </div>
    </div>
  </div>
`

document.getElementById('btn-generar').addEventListener('click', generarPlan)

let stepInterval = null

function startProgress() {
  const steps = ['step-1', 'step-2', 'step-3', 'step-4']
  let current = 0
  document.getElementById('progress-container').classList.add('visible')

  steps.forEach(s => {
    document.getElementById(s).className = 'progress-step'
  })

  document.getElementById(steps[0]).classList.add('active')

  stepInterval = setInterval(() => {
    document.getElementById(steps[current]).classList.remove('active')
    document.getElementById(steps[current]).classList.add('done')
    current++
    if (current < steps.length) {
      document.getElementById(steps[current]).classList.add('active')
    } else {
      clearInterval(stepInterval)
    }
  }, 7000)
}

function stopProgress() {
  clearInterval(stepInterval)
  const steps = ['step-1', 'step-2', 'step-3', 'step-4']
  steps.forEach(s => {
    const el = document.getElementById(s)
    el.classList.remove('active')
    el.classList.add('done')
  })
  setTimeout(() => {
    document.getElementById('progress-container').classList.remove('visible')
  }, 500)
}

async function generarPlan() {
  const cultivo = document.getElementById('cultivo').value.trim()
  const area = document.getElementById('area').value
  const forma = document.getElementById('forma').value
  const insumo = document.getElementById('insumo').value
  const condicion = document.getElementById('condicion').value

  if (!cultivo || !area || !forma || !insumo || !condicion) {
    alert('Por favor completa todos los campos.')
    return
  }

  const btn = document.getElementById('btn-generar')
  const resultCard = document.getElementById('result-card')
  const resultBody = document.getElementById('result-body')
  const resultTitle = document.getElementById('result-title')

  btn.disabled = true
  btn.textContent = 'Generando...'
  resultCard.classList.remove('visible')
  startProgress()

  const prompt = `Eres un experto en agricultura de precisión y operación de drones agrícolas.
Un agricultor necesita un plan de rociado con estos datos:
- Cultivo: ${cultivo}
- Área: ${area} hectáreas
- Forma del campo: ${forma}
- Insumo a aplicar: ${insumo}
- Condición actual: ${condicion}

Genera un plan de ruta detallado que incluya:
1. Patrón de vuelo recomendado y por qué
2. Altura de vuelo en metros
3. Velocidad de vuelo en km/h
4. Cantidad estimada de ${insumo} necesaria
5. Número estimado de franjas
6. Zonas prioritarias
7. Tiempo estimado de operación
8. 2 recomendaciones específicas para este cultivo

Sé concreto con números reales. **Responde SIEMPRE en español.** Usa markdown para formato.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Drone Planner'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const texto = data.choices[0].message.content

    stopProgress()
    resultTitle.textContent = `Plan — ${cultivo} · ${area} ha`
    resultBody.innerHTML = marked.parse(texto)
    resultCard.classList.add('visible')
    buildGrid(forma, parseFloat(area))

  } catch (e) {
    stopProgress()
    resultBody.innerHTML = '<p style="color:#f87171">Error al conectar con la IA. Intenta de nuevo.</p>'
    resultCard.classList.add('visible')
  }

  btn.disabled = false
  btn.textContent = 'Generar plan de ruta →'
}

function buildGrid(forma, area) {
  const cols = Math.min(14, Math.max(6, Math.round(Math.sqrt(area) * 3)))
  const rows = Math.round(cols * 0.6)
  const grid = document.getElementById('field-grid')
  grid.style.gridTemplateColumns = `repeat(${cols}, 28px)`
  grid.innerHTML = ''

  const routeSeq = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let inField = true
      if (forma === 'triangular') inField = c <= cols - 1 - r * (cols / rows)
      if (forma === 'en L') inField = !(r < Math.floor(rows / 2) && c > Math.floor(cols / 2))
      if (forma === 'irregular') inField = !((r === 0 && c >= cols - 2) || (r === rows - 1 && c <= 1))
      if (inField) routeSeq.push(`${r},${c}`)
    }
  }

  const boustro = []
  for (let r = 0; r < rows; r++) {
    const rowCells = routeSeq.filter(k => k.startsWith(`${r},`))
    if (r % 2 === 1) rowCells.reverse()
    rowCells.forEach(k => boustro.push(k))
  }

  const routeSet = new Set(boustro)
  const startKey = boustro[0]
  const endKey = boustro[boustro.length - 1]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`
      const cell = document.createElement('div')
      cell.classList.add('cell')

      if (!routeSet.has(key)) {
        cell.style.background = 'transparent'
      } else if (key === startKey) {
        cell.classList.add('cell-start')
        cell.textContent = 'S'
      } else if (key === endKey) {
        cell.classList.add('cell-end')
        cell.textContent = 'E'
      } else {
        cell.classList.add('cell-route')
      }

      grid.appendChild(cell)
    }
  }
}