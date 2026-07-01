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

export const SVG_RING_TONE: Record<Tone, string> = {
    indigo: "stroke-indigo-500/45 dark:stroke-indigo-400/45",
    amber: "stroke-amber-500/45 dark:stroke-amber-400/45",
    rose: "stroke-rose-500/45 dark:stroke-rose-400/45",
    emerald: "stroke-emerald-500/45 dark:stroke-emerald-400/45",
    muted: "stroke-fd-border",
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
                strokeWidth={13}
                strokeLinecap="round"
            />
            <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--color-fd-background)"
                strokeWidth={9}
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
    ring?: Tone
    className?: string
    baseOpacity?: number
    children?: ReactNode
}

export function Chip({
    x,
    y,
    text,
    tone = "muted",
    ring,
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
                    strokeWidth={ring ? 1.6 : 1}
                    className={
                        ring ? SVG_RING_TONE[ring] : SVG_CHIP_STROKE_TONE[tone]
                    }
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

interface PulseRingProps {
    x: number
    y: number
    width: number
    height: number
    rx?: number
    grow?: number
    begin: string
    dur?: string
    activeFraction?: number
    repeatCount?: string
}

export function PulseRing({
    x,
    y,
    width,
    height,
    rx = 16,
    grow = 14,
    begin,
    dur = "1.1s",
    activeFraction = 1,
    repeatCount,
}: PulseRingProps) {
    const keyTimes = activeFraction < 1 ? `0;${activeFraction};1` : undefined
    const values = (from: number, to: number) =>
        activeFraction < 1 ? `${from};${to};${to}` : `${from};${to}`
    const timing = { begin, dur, repeatCount, keyTimes }
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={rx}
            fill="none"
            strokeWidth={1.5}
            opacity={0}
            className="stroke-rose-500 dark:stroke-rose-400"
        >
            <animate
                attributeName="x"
                values={values(x, x - grow)}
                {...timing}
            />
            <animate
                attributeName="y"
                values={values(y, y - grow)}
                {...timing}
            />
            <animate
                attributeName="width"
                values={values(width, width + grow * 2)}
                {...timing}
            />
            <animate
                attributeName="height"
                values={values(height, height + grow * 2)}
                {...timing}
            />
            <animate
                attributeName="opacity"
                values={values(0.7, 0)}
                {...timing}
            />
        </rect>
    )
}

export function ChannelGlow({
    x1,
    x2,
    y,
    children,
}: {
    x1: number
    x2: number
    y: number
    children?: ReactNode
}) {
    return (
        <line
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={children ? 0 : 0.4}
            className="stroke-rose-400/60 dark:stroke-rose-400/50"
        >
            {children}
        </line>
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
