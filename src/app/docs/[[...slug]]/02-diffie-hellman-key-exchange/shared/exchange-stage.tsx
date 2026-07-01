"use client"

import { Eye } from "lucide-react"
import { useId, type ReactNode } from "react"

export type Tone = "indigo" | "amber" | "rose" | "emerald" | "muted"

export const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace"

export const SVG_TEXT_TONE: Record<Tone, string> = {
    indigo: "fill-indigo-700 dark:fill-indigo-300",
    amber: "fill-amber-700 dark:fill-amber-300",
    rose: "fill-rose-700 dark:fill-rose-300",
    emerald: "fill-emerald-600 dark:fill-emerald-400",
    muted: "fill-fd-muted-foreground",
}

export const SVG_CHIP_STROKE_TONE: Record<Tone, string> = {
    indigo: "stroke-indigo-500/50",
    amber: "stroke-amber-500/50",
    rose: "stroke-rose-500/50",
    emerald: "stroke-emerald-500/60",
    muted: "stroke-fd-border",
}

export const SVG_STROKE_TONE: Record<Tone, string> = {
    indigo: "stroke-indigo-500 dark:stroke-indigo-400",
    amber: "stroke-amber-500 dark:stroke-amber-400",
    rose: "stroke-rose-500 dark:stroke-rose-400",
    emerald: "stroke-emerald-600 dark:stroke-emerald-400",
    muted: "stroke-fd-muted-foreground",
}

export const SVG_DOT_TONE: Record<Tone, string> = {
    indigo: "fill-indigo-500 dark:fill-indigo-400",
    amber: "fill-amber-500 dark:fill-amber-400",
    rose: "fill-rose-500 dark:fill-rose-400",
    emerald: "fill-emerald-500 dark:fill-emerald-400",
    muted: "fill-fd-muted-foreground",
}

export const HTML_TEXT_TONE: Record<Tone, string> = {
    indigo: "text-indigo-700 dark:text-indigo-200",
    amber: "text-amber-700 dark:text-amber-200",
    rose: "text-rose-700 dark:text-rose-200",
    emerald: "text-emerald-600 dark:text-emerald-500",
    muted: "text-muted-foreground",
}

export const STAGE_WIDTH = 560
export const DEVICE_WIDTH = 140
export const DEVICE_HEIGHT = 118
export const LEFT_DEVICE_X = 28
export const RIGHT_DEVICE_X = STAGE_WIDTH - 28 - DEVICE_WIDTH

export interface ScreenLine {
    text: string
    tone?: Tone
}

interface DeviceProps {
    x: number
    y: number
    name: string
    tone: Tone
    lines?: ScreenLine[]
    hiddenRows?: number
    width?: number
    height?: number
}

export function Device({
    x,
    y,
    name,
    tone,
    lines = [],
    hiddenRows = 0,
    width = DEVICE_WIDTH,
    height = DEVICE_HEIGHT,
}: DeviceProps) {
    const rawId = useId()
    const id = rawId.replace(/:/g, "")
    const depthId = `device-depth-${id}`

    const screenX = x + 9
    const screenY = y + 26
    const screenWidth = width - 18
    const screenHeight = height - 35

    const hiddenBarWidths = [0.85, 0.6, 0.75, 0.5]

    return (
        <g>
            <defs>
                <radialGradient id={depthId} cx="38%" cy="28%" r="80%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.07" />
                </radialGradient>
            </defs>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={12}
                fill="var(--color-fd-border)"
            />
            <rect
                x={x + 3}
                y={y + 3}
                width={width - 6}
                height={height - 6}
                rx={9}
                fill="var(--color-fd-card)"
            />
            <rect
                x={x + 3}
                y={y + 3}
                width={width - 6}
                height={height - 6}
                rx={9}
                fill={`url(#${depthId})`}
            />
            <text
                x={x + 11}
                y={y + 18}
                fontSize={11}
                fontWeight={600}
                fill="var(--color-fd-foreground)"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
                {name}
            </text>
            <circle
                cx={x + width - 14}
                cy={y + 14}
                r={3}
                className={SVG_DOT_TONE[tone]}
            />
            <rect
                x={screenX}
                y={screenY}
                width={screenWidth}
                height={screenHeight}
                rx={6}
                fill="var(--color-fd-background)"
                stroke="var(--color-fd-border)"
                strokeWidth={1}
            />
            {lines.map((line, i) => (
                <text
                    key={i}
                    x={screenX + 8}
                    y={screenY + 18 + i * 18.5}
                    fontSize={9.5}
                    fontFamily={MONO_FONT}
                    className={SVG_TEXT_TONE[line.tone ?? "muted"]}
                >
                    {line.text}
                </text>
            ))}
            {Array.from({ length: hiddenRows }, (_, i) => (
                <rect
                    key={i}
                    x={screenX + 8}
                    y={screenY + 12 + i * 18.5}
                    width={(screenWidth - 16) * hiddenBarWidths[i % 4]}
                    height={7}
                    rx={3.5}
                    className="fill-fd-muted-foreground opacity-25"
                />
            ))}
        </g>
    )
}

export function Channel({ x1, x2, y }: { x1: number; x2: number; y: number }) {
    return (
        <g>
            <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--color-fd-border)"
                strokeWidth={10}
                strokeLinecap="round"
            />
            <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--color-fd-background)"
                strokeWidth={6.5}
                strokeLinecap="round"
                opacity={0.9}
            />
        </g>
    )
}

export function chipWidth(text: string) {
    return text.length * 6.3 + 16
}

interface ChipProps {
    x: number
    y: number
    text: string
    tone?: Tone
    className?: string
    baseOpacity?: number
    children?: ReactNode
}

export function Chip({
    x,
    y,
    text,
    tone = "muted",
    className,
    baseOpacity,
    children,
}: ChipProps) {
    const width = chipWidth(text)
    return (
        <g transform={`translate(${x}, ${y})`}>
            <g className={className} opacity={baseOpacity}>
                <rect
                    x={-width / 2}
                    y={-11}
                    width={width}
                    height={22}
                    rx={11}
                    fill="var(--color-fd-card)"
                    strokeWidth={1}
                    className={SVG_CHIP_STROKE_TONE[tone]}
                />
                <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10.5}
                    fontFamily={MONO_FONT}
                    className={SVG_TEXT_TONE[tone]}
                >
                    {text}
                </text>
                {children}
            </g>
        </g>
    )
}

interface TapProps {
    x: number
    channelY: number
    eyeY: number
}

export function Tap({ x, channelY, eyeY }: TapProps) {
    return (
        <g>
            <line
                x1={x}
                y1={channelY}
                x2={x}
                y2={eyeY - 14}
                className="stroke-rose-500/70 dark:stroke-rose-400/70"
                strokeWidth={1.5}
                strokeDasharray="3 3"
            />
            <circle
                cx={x}
                cy={channelY}
                r={3}
                className="fill-rose-500 dark:fill-rose-400"
            />
            <circle
                cx={x}
                cy={eyeY}
                r={13}
                fill="var(--color-fd-card)"
                className="stroke-rose-500/70 dark:stroke-rose-400/70"
                strokeWidth={1.2}
            />
            <Eye
                x={x - 8}
                y={eyeY - 8}
                width={16}
                height={16}
                strokeWidth={1.8}
                className="text-rose-600 dark:text-rose-400"
            />
        </g>
    )
}

const WAVE_RADII = [7, 12, 17]

interface SpeakerWavesProps {
    x: number
    y: number
    facing: "right" | "left"
    tone: Tone
    baseOpacity?: number
    children?: ReactNode
}

export function SpeakerWaves({
    x,
    y,
    facing,
    tone,
    baseOpacity,
    children,
}: SpeakerWavesProps) {
    const scale = facing === "left" ? -1 : 1
    return (
        <g
            transform={`translate(${x}, ${y}) scale(${scale}, 1)`}
            opacity={baseOpacity}
        >
            {WAVE_RADII.map((r) => (
                <path
                    key={r}
                    d={`M ${(0.64 * r).toFixed(1)} ${(-0.77 * r).toFixed(1)} A ${r} ${r} 0 0 1 ${(0.64 * r).toFixed(1)} ${(0.77 * r).toFixed(1)}`}
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    className={SVG_STROKE_TONE[tone]}
                />
            ))}
            {children}
        </g>
    )
}

export function sideArcPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lift: number,
) {
    return `M ${x1} ${y1} C ${x1} ${y1 - lift}, ${x2} ${y2 - lift}, ${x2} ${y2}`
}

interface SideArcProps {
    x1: number
    y1: number
    x2: number
    y2: number
    lift: number
    className?: string
    baseOpacity?: number
    children?: ReactNode
}

export function SideArc({
    x1,
    y1,
    x2,
    y2,
    lift,
    className = "stroke-fd-muted-foreground/50",
    baseOpacity,
    children,
}: SideArcProps) {
    return (
        <path
            d={sideArcPath(x1, y1, x2, y2, lift)}
            fill="none"
            className={className}
            strokeWidth={1.5}
            opacity={baseOpacity}
        >
            {children}
        </path>
    )
}
