export const CAPTCHA_LENGTH = 4
export const CAPTCHA_CANVAS = { width: 210, height: 210 } as const

const BG_TOKENS = ['--capt-bg-1', '--capt-bg-2', '--capt-bg-3', '--capt-bg-4'] as const

const NOISE_CURVE_COUNT = 40
const DIGIT_FONT = 'bold 64px sans-serif'
const DIGIT_START_X = 30
const DIGIT_STEP_X = 40
const DIGIT_BASE_Y = 105
const MAX_DIGIT_SHIFT_Y = 10
const MAX_DIGIT_ROTATION = 0.2

export const newCaptchaAnswer = (): string => String(Math.floor(1000 + Math.random() * 9000))

const token = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

function fillBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height)
  const bg = BG_TOKENS[Math.floor(Math.random() * BG_TOKENS.length)] ?? BG_TOKENS[0]
  ctx.fillStyle = token(bg)
  ctx.fillRect(0, 0, width, height)
}

function drawNoise(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.strokeStyle = token('--capt-line')
  ctx.lineWidth = 1
  const rx = () => randomBetween(0, width)
  const ry = () => randomBetween(0, height)
  for (let i = 0; i < NOISE_CURVE_COUNT; i += 1) {
    ctx.beginPath()
    ctx.moveTo(rx(), ry())
    ctx.bezierCurveTo(rx(), ry(), rx(), ry(), rx(), ry())
    ctx.stroke()
  }
}

function drawDigits(ctx: CanvasRenderingContext2D, answer: string): void {
  ctx.fillStyle = token('--black')
  ctx.font = DIGIT_FONT
  ctx.textBaseline = 'middle'
  ;[...answer].forEach((digit, index) => {
    ctx.save()
    ctx.translate(
      DIGIT_START_X + index * DIGIT_STEP_X,
      DIGIT_BASE_Y + randomBetween(-MAX_DIGIT_SHIFT_Y, MAX_DIGIT_SHIFT_Y),
    )
    ctx.rotate(randomBetween(-MAX_DIGIT_ROTATION, MAX_DIGIT_ROTATION))
    ctx.fillText(digit, 0, 0)
    ctx.restore()
  })
}

export function drawCaptcha(canvas: HTMLCanvasElement, answer: string): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas

  fillBackground(ctx, width, height)
  drawNoise(ctx, width, height)
  drawDigits(ctx, answer)
}
