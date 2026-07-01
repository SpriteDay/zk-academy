"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KeyRound } from "lucide-react"
import { useId } from "react"
import {
    Channel,
    Chip,
    Device,
    DEVICE_WIDTH,
    LEFT_DEVICE_X,
    MONO_FONT,
    RIGHT_DEVICE_X,
    sideArcPath,
    SideArc,
    STAGE_WIDTH,
    SVG_TEXT_TONE,
    Tap,
} from "./shared/exchange-stage"

const STAGE_HEIGHT = 262
const DEVICE_Y = 92
const CHANNEL_Y = DEVICE_Y + 59
const TAP_X = STAGE_WIDTH / 2
const EYE_Y = 238
const ARC_LIFT = 64

const LEFT_TOP_X = LEFT_DEVICE_X + DEVICE_WIDTH / 2
const RIGHT_TOP_X = RIGHT_DEVICE_X + DEVICE_WIDTH / 2

const CIPHER_A = "#9f!a2"
const CIPHER_B = "b3?e0x"

interface KeyExchangeMeetupProps {
    partyA?: string
    partyB?: string
}

export function KeyExchangeMeetup({
    partyA = "Jeffrey",
    partyB = "Bill",
}: KeyExchangeMeetupProps) {
    const rawId = useId()
    const id = rawId.replace(/:/g, "")
    const keyAnimId = `key-${id}`
    const msg1AnimId = `msg1-${id}`
    const msg2AnimId = `msg2-${id}`

    const keyBegin = `0.8s;${msg2AnimId}.end+2.6s`
    const msg1Begin = `${keyAnimId}.end+0.9s`
    const msg2Begin = `${msg1AnimId}.end+0.7s`

    const arcPath = sideArcPath(
        LEFT_TOP_X,
        DEVICE_Y - 4,
        RIGHT_TOP_X,
        DEVICE_Y - 4,
        ARC_LIFT,
    )

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
                    aria-label="Two devices exchange a secret key over a private side channel, then send encrypted messages over a public channel watched by an eavesdropper"
                >
                    <SideArc
                        x1={LEFT_TOP_X}
                        y1={DEVICE_Y - 4}
                        x2={RIGHT_TOP_X}
                        y2={DEVICE_Y - 4}
                        lift={ARC_LIFT}
                    />
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <Tap x={TAP_X} channelY={CHANNEL_Y} eyeY={EYE_Y} />
                    <Chip
                        x={TAP_X + 50}
                        y={EYE_Y}
                        text={CIPHER_A}
                        tone="rose"
                    />

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
                            id={keyAnimId}
                            begin={keyBegin}
                            dur="2.6s"
                            path={arcPath}
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1"
                            keyTimes="0;1"
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={keyBegin}
                            dur="2.6s"
                        />
                    </g>

                    {/* Encrypted packets over the public channel */}
                    <g opacity="0">
                        <rect
                            x={-27}
                            y={-10}
                            width={54}
                            height={20}
                            rx={10}
                            fill="var(--color-fd-card)"
                            strokeWidth={1}
                            className="stroke-fd-border"
                        />
                        <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={9.5}
                            fontFamily={MONO_FONT}
                            className={SVG_TEXT_TONE.muted}
                        >
                            {CIPHER_A}
                        </text>
                        <animateMotion
                            id={msg1AnimId}
                            begin={msg1Begin}
                            dur="2s"
                            path={`M ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y} L ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y}`}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={msg1Begin}
                            dur="2s"
                        />
                    </g>
                    <g opacity="0">
                        <rect
                            x={-27}
                            y={-10}
                            width={54}
                            height={20}
                            rx={10}
                            fill="var(--color-fd-card)"
                            strokeWidth={1}
                            className="stroke-fd-border"
                        />
                        <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={9.5}
                            fontFamily={MONO_FONT}
                            className={SVG_TEXT_TONE.muted}
                        >
                            {CIPHER_B}
                        </text>
                        <animateMotion
                            id={msg2AnimId}
                            begin={msg2Begin}
                            dur="2s"
                            path={`M ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y} L ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y}`}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={msg2Begin}
                            dur="2s"
                        />
                    </g>

                    {/* Eavesdropper ping when a packet passes the tap */}
                    <circle
                        cx={TAP_X}
                        cy={CHANNEL_Y}
                        r={3}
                        opacity={0}
                        className="fill-rose-500 dark:fill-rose-400"
                    >
                        <animate
                            attributeName="r"
                            values="3;12"
                            begin={`${msg1AnimId}.begin+1s;${msg2AnimId}.begin+1s`}
                            dur="0.8s"
                        />
                        <animate
                            attributeName="opacity"
                            values="0.8;0"
                            begin={`${msg1AnimId}.begin+1s;${msg2AnimId}.begin+1s`}
                            dur="0.8s"
                        />
                    </circle>
                </svg>
            </CardContent>
        </Card>
    )
}
