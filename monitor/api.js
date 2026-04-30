import express from 'express'
import Docker from 'dockerode'
import { execSync, exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.static(__dirname))

const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN || 'deploy-secret-2026'
const PROJECT_DIR = '/app/project'

function execCmd(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 10000, ...options })
  } catch (e) {
    return e.stdout || e.stderr || e.message
  }
}

function parseDockerPs(text) {
  const lines = text.trim().split('\n').slice(1)
  return lines.map(line => {
    const parts = line.trim().split(/\s{2,}/)
    if (parts.length < 6) return null
    return {
      id: parts[0],
      image: parts[1],
      command: parts[2],
      created: parts[3],
      status: parts[4],
      name: parts[5],
      healthy: parts[4].includes('healthy') || parts[4].includes('Up')
    }
  }).filter(Boolean)
}

app.get('/api/metrics', async (req, res) => {
  const metrics = {}

  try {
    const containers = await docker.listContainers({ all: true })
    metrics.containers = containers.map(c => ({
      id: c.Id.slice(0, 12),
      name: c.Names[0].replace('/', ''),
      image: c.Image,
      state: c.State,
      status: c.Status,
      created: c.Created,
    }))
  } catch (e) {
    metrics.containersError = e.message
  }

  try {
    const stats = await Promise.all(
      (metrics.containers || []).map(async (c) => {
        try {
          const container = docker.getContainer(c.id)
          const statsData = await container.stats({ stream: false })
          return {
            name: c.name,
            cpu: calculateCPU(statsData),
            memory: formatMemory(statsData),
          }
        } catch {
          return { name: c.name, cpu: 0, memory: 'N/A' }
        }
      })
    )
    metrics.containerStats = stats
  } catch (e) {
    metrics.containerStatsError = e.message
  }

  try {
    metrics.tailscaleStatus = execCmd('tailscale status 2>/dev/null | head -5')
  } catch (e) {
    metrics.tailscaleStatus = 'unavailable'
  }

  try {
    metrics.funnelStatus = execCmd('tailscale funnel status 2>/dev/null')
  } catch (e) {
    metrics.funnelStatus = 'unavailable'
  }

  try {
    const df = execCmd('df -h / | tail -1')
    const parts = df.trim().split(/\s+/)
    metrics.disk = {
      total: parts[1],
      used: parts[2],
      available: parts[3],
      percent: parts[4],
    }
  } catch (e) {
    metrics.disk = null
  }

  try {
    const loadavg = fs.readFileSync('/proc/loadavg', 'utf8').trim().split(' ')
    metrics.load = {
      '1min': loadavg[0],
      '5min': loadavg[1],
      '15min': loadavg[2],
    }
    const totalMem = parseInt(loadavg[3])
    metrics.memory = {
      total: formatBytes(totalMem),
    }
  } catch (e) {
    metrics.load = null
  }

  try {
    const uptimeSecs = parseFloat(fs.readFileSync('/proc/uptime', 'utf8').split(' ')[0])
    metrics.uptime = formatUptime(uptimeSecs)
  } catch (e) {
    metrics.uptime = 'unknown'
  }

  try {
    const netDev = fs.readFileSync('/proc/net/dev', 'utf8')
    const ethLine = netDev.split('\n').find(l => l.includes('enp0s3') || l.includes('eth0'))
    if (ethLine) {
      const parts = ethLine.trim().split(/[\s:]+/).slice(1)
      metrics.network = {
        rxBytes: formatBytes(parseInt(parts[0])),
        txBytes: formatBytes(parseInt(parts[8])),
      }
    }
  } catch (e) {
    metrics.network = null
  }

  metrics.timestamp = new Date().toISOString()
  res.json(metrics)
})

app.post('/api/deploy', async (req, res) => {
  const { token } = req.body
  if (token !== DEPLOY_TOKEN) {
    return res.status(403).json({ error: 'Invalid deploy token' })
  }

  res.json({ started: true, message: 'Deploy started from dev branch' })

  try {
    execCmd(`cd ${PROJECT_DIR} && git fetch origin dev`, { timeout: 30000 })
    execCmd(`cd ${PROJECT_DIR} && git reset --hard origin/dev`, { timeout: 10000 })
    execCmd(`cd ${PROJECT_DIR} && docker compose down`, { timeout: 60000 })
    execCmd(`cd ${PROJECT_DIR} && docker compose up -d --build`, { timeout: 300000 })
  } catch (e) {
    console.error('Deploy failed:', e.message)
  }
})

app.post('/api/restart', async (req, res) => {
  const { token } = req.body
  if (token !== DEPLOY_TOKEN) {
    return res.status(403).json({ error: 'Invalid deploy token' })
  }

  res.json({ started: true, message: 'Restart initiated' })

  try {
    execCmd(`cd ${PROJECT_DIR} && docker compose restart`, { timeout: 60000 })
    execCmd('tailscale funnel --bg 80 2>/dev/null')
  } catch (e) {
    console.error('Restart failed:', e.message)
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

function calculateCPU(stats) {
  if (!stats.cpu_stats || !stats.precpu_stats) return 0
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
  const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
  if (systemDelta === 0) return 0
  return ((cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100).toFixed(1)
}

function formatMemory(stats) {
  if (!stats.memory_stats) return 'N/A'
  const usage = stats.memory_stats.usage - (stats.memory_stats.stats?.cache || 0)
  const limit = stats.memory_stats.limit
  if (limit === 0) return 'N/A'
  return `${formatBytes(usage)} / ${formatBytes(limit)}`
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatUptime(secs) {
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

const PORT = 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Monitor API running on port ${PORT}`)
})
