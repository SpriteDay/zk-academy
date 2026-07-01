"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KeyRound } from "lucide-react"
import {
    Channel,
    ChannelGlow,
    Chip,
    Device,
    DEVICE_HEIGHT,
    DEVICE_WIDTH,
    LEFT_DEVICE_X,
    PulseRing,
    RIGHT_DEVICE_X,
    sideArcPath,
    SideArc,
    STAGE_WIDTH,
} from "./shared/exchange-stage"

const STAGE_HEIGHT = 224
const DEVICE_Y = 92
const CHANNEL_Y = DEVICE_Y + 59
const ARC_LIFT = 64
const ARC_Y = DEVICE_Y - 4

const LEFT_TOP_X = LEFT_DEVICE_X + DEVICE_WIDTH / 2
const RIGHT_TOP_X = RIGHT_DEVICE_X + DEVICE_WIDTH / 2

const CIPHER_A = "9#4∆7%"
const CIPHER_B = "3§8×5?"

/**
 * All animations share one fixed cycle so they stay phase-locked:
 *   key travels the alley  0.8s – 3.4s
 *   message A → B          4.3s – 6.3s
 *   message B → A          7.0s – 9.0s
 * The emitter box fires a single pulse as its message departs.
 */
const CYCLE = 12
const PULSE_DUR = 1.2

const pct = (t: number) => Number((t / CYCLE).toFixed(4))
const kt = (...times: number[]) => times.map(pct).join(";")

const cycleTiming = {
    begin: "0s",
    dur: `${CYCLE}s`,
    repeatCount: "indefinite",
} as const

interface KeyExchangeMeetupProps {
    partyA?: string
    partyB?: string
}

export function KeyExchangeMeetup({
    partyA = "Jeffrey",
    partyB = "Bill",
}: KeyExchangeMeetupProps) {
    const arcPath = sideArcPath(LEFT_TOP_X, ARC_Y, RIGHT_TOP_X, ARC_Y, ARC_LIFT)
    const msg1Path = `M ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y} L ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y}`
    const msg2Path = `M ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y} L ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y}`

    return (
        <Card>
            <CardHeader>
                <CardTitle>Key exchange, the old way</CardTitle>
                <CardDescription>
                    Meet in private, then talk in public
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`${partyA} and ${partyB} exchange a secret key over a private side channel, then send encrypted messages over a public channel`}
                >
                    {/* Private side channel: grey when idle, green while the key travels */}
                    <SideArc
                        x1={LEFT_TOP_X}
                        y1={ARC_Y}
                        x2={RIGHT_TOP_X}
                        y2={ARC_Y}
                        lift={ARC_LIFT}
                    />
                    <SideArc
                        x1={LEFT_TOP_X}
                        y1={ARC_Y}
                        x2={RIGHT_TOP_X}
                        y2={ARC_Y}
                        lift={ARC_LIFT}
                        className="stroke-emerald-600 dark:stroke-emerald-400"
                        baseOpacity={0}
                    >
                        <animate
                            attributeName="opacity"
                            values="0;0;1;1;0;0"
                            keyTimes={kt(0, 0.7, 1.0, 3.2, 3.5, CYCLE)}
                            {...cycleTiming}
                        />
                    </SideArc>
                    <text
                        x={STAGE_WIDTH / 2}
                        y={ARC_Y - ARC_LIFT * 0.75 - 12}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                        className="fill-fd-muted-foreground"
                    >
                        dark alley
                    </text>

                    {/* Public channel: lights up red while a message travels */}
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <ChannelGlow
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    >
                        <animate
                            attributeName="opacity"
                            values="0;0;1;1;0;0;1;1;0;0"
                            keyTimes={kt(
                                0,
                                4.2,
                                4.5,
                                6.1,
                                6.4,
                                6.9,
                                7.2,
                                8.8,
                                9.1,
                                CYCLE,
                            )}
                            {...cycleTiming}
                        />
                    </ChannelGlow>
                    <text
                        x={STAGE_WIDTH / 2}
                        y={CHANNEL_Y + 24}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                        className="fill-fd-muted-foreground"
                    >
                        public channel
                    </text>

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        hiddenRows={3}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        hiddenRows={3}
                    />

                    {/* Emitter box fires a single pulse as its message departs */}
                    <PulseRing
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        width={DEVICE_WIDTH}
                        height={DEVICE_HEIGHT}
                        begin="4.3s"
                        dur={`${CYCLE}s`}
                        activeFraction={pct(PULSE_DUR)}
                        repeatCount="indefinite"
                    />
                    <PulseRing
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        width={DEVICE_WIDTH}
                        height={DEVICE_HEIGHT}
                        begin="7s"
                        dur={`${CYCLE}s`}
                        activeFraction={pct(PULSE_DUR)}
                        repeatCount="indefinite"
                    />

                    {/* Secret key traveling the private side channel */}
                    <g opacity="0">
                        <circle
                            r={9}
                            className="fill-emerald-600 dark:fill-emerald-500"
                        />
                        <KeyRound
                            x={-5.5}
                            y={-5.5}
                            width={11}
                            height={11}
                            strokeWidth={2.2}
                            className="text-white"
                        />
                        <animateMotion
                            path={arcPath}
                            calcMode="linear"
                            keyPoints="0;0;1;1"
                            keyTimes={kt(0, 0.8, 3.4, CYCLE)}
                            {...cycleTiming}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;0;1;1;0;0"
                            keyTimes={kt(0, 0.8, 0.95, 3.25, 3.4, CYCLE)}
                            {...cycleTiming}
                        />
                    </g>

                    {/* Encrypted messages over the public channel */}
                    <Chip x={0} y={0} text={CIPHER_A} baseOpacity={0}>
                        <animateMotion
                            path={msg1Path}
                            calcMode="linear"
                            keyPoints="0;0;1;1"
                            keyTimes={kt(0, 4.3, 6.3, CYCLE)}
                            {...cycleTiming}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;0;1;1;0;0"
                            keyTimes={kt(0, 4.3, 4.45, 6.15, 6.3, CYCLE)}
                            {...cycleTiming}
                        />
                    </Chip>
                    <Chip x={0} y={0} text={CIPHER_B} baseOpacity={0}>
                        <animateMotion
                            path={msg2Path}
                            calcMode="linear"
                            keyPoints="0;0;1;1"
                            keyTimes={kt(0, 7.0, 9.0, CYCLE)}
                            {...cycleTiming}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;0;1;1;0;0"
                            keyTimes={kt(0, 7.0, 7.15, 8.85, 9.0, CYCLE)}
                            {...cycleTiming}
                        />
                    </Chip>
                </svg>
            </CardContent>
        </Card>
    )
}
