"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dices } from "lucide-react"
import { useMemo, useState } from "react"
import {
    Channel,
    Chip,
    Device,
    DEVICE_WIDTH,
    HTML_TEXT_TONE,
    LEFT_DEVICE_X,
    RIGHT_DEVICE_X,
    SpeakerWaves,
    STAGE_WIDTH,
} from "./shared/exchange-stage"
import { modPow } from "./shared/mod-math"

const STAGE_HEIGHT = 170
const DEVICE_Y = 36
const CHANNEL_Y = DEVICE_Y + 59
const CENTER_X = STAGE_WIDTH / 2

// RFC 3526, group 14: 2048-bit MODP safe prime
const P = BigInt(
    "0x" +
        "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74" +
        "020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F1437" +
        "4FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED" +
        "EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF05" +
        "98DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB" +
        "9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B" +
        "E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF695581718" +
        "3995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF",
)
const G = 2n

const DEFAULT_SECRET_A = BigInt(
    "0x5e8b0f3a9c47d2261b90e4f7a3c8d5512f6e9b04c7a2d8e13f5a60b9d4c72e81",
)
const DEFAULT_SECRET_B = BigInt(
    "0x9d24c6f1a7e08b3552c9f4d0e6a1b78c3e5d92f04a6b1c8d7e30f9a25b4c6d1e",
)

function randomSecret(): bigint {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    let value = 0n
    for (const byte of bytes) {
        value = (value << 8n) | BigInt(byte)
    }
    return value < 2n ? 2n : value
}

function hexShort(value: bigint, head = 8, tail = 6): string {
    const hex = value.toString(16)
    if (hex.length <= head + tail) return `0x${hex}`
    return `0x${hex.slice(0, head)}…${hex.slice(-tail)}`
}

interface RealisticDiffieHellmanProps {
    partyA?: string
    partyB?: string
}

export function RealisticDiffieHellman({
    partyA = "Frank",
    partyB = "Jesse",
}: RealisticDiffieHellmanProps) {
    const [secretA, setSecretA] = useState(DEFAULT_SECRET_A)
    const [secretB, setSecretB] = useState(DEFAULT_SECRET_B)

    const { publicA, publicB, sharedKey } = useMemo(() => {
        const A = modPow(G, secretA, P)
        const B = modPow(G, secretB, P)
        return { publicA: A, publicB: B, sharedKey: modPow(B, secretA, P) }
    }, [secretA, secretB])

    const pDigits = useMemo(() => P.toString(10).length, [])
    const keyDigits = useMemo(() => sharedKey.toString(10).length, [sharedKey])
    const secretDigits = secretA.toString(10).length

    const handleRandomize = () => {
        setSecretA(randomSecret())
        setSecretB(randomSecret())
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>The real thing</CardTitle>
                <CardDescription>
                    Same exchange, but with numbers nobody can brute-force
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`Realistic Diffie-Hellman exchange between ${partyA} and ${partyB} with a 2048-bit prime modulus`}
                >
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <SpeakerWaves
                        x={LEFT_DEVICE_X + DEVICE_WIDTH + 10}
                        y={CHANNEL_Y}
                        facing="right"
                        tone="indigo"
                        baseOpacity={0.4}
                    >
                        <animate
                            attributeName="opacity"
                            values="0.3;0.8;0.3"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </SpeakerWaves>
                    <SpeakerWaves
                        x={RIGHT_DEVICE_X - 10}
                        y={CHANNEL_Y}
                        facing="left"
                        tone="amber"
                        baseOpacity={0.4}
                    >
                        <animate
                            attributeName="opacity"
                            values="0.3;0.8;0.3"
                            dur="3s"
                            begin="1.5s"
                            repeatCount="indefinite"
                        />
                    </SpeakerWaves>

                    <Chip
                        x={CENTER_X - 52}
                        y={CHANNEL_Y - 44}
                        text={`g = 2`}
                        tone="rose"
                    />
                    <Chip
                        x={CENTER_X + 42}
                        y={CHANNEL_Y - 44}
                        text={`p = ${pDigits} digits`}
                        tone="rose"
                    />

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        lines={[
                            {
                                text: `a = ${hexShort(secretA, 6, 4)}`,
                                tone: "indigo",
                            },
                            { text: `A = ${hexShort(publicA, 6, 4)}` },
                            {
                                text: `K = ${hexShort(sharedKey, 6, 4)}`,
                                tone: "emerald",
                            },
                        ]}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        lines={[
                            {
                                text: `b = ${hexShort(secretB, 6, 4)}`,
                                tone: "amber",
                            },
                            { text: `B = ${hexShort(publicB, 6, 4)}` },
                            {
                                text: `K = ${hexShort(sharedKey, 6, 4)}`,
                                tone: "emerald",
                            },
                        ]}
                    />

                    <Chip
                        key={`a-${publicA}`}
                        x={CENTER_X - 30}
                        y={CHANNEL_Y - 16}
                        text={`A = ${hexShort(publicA, 6, 4)}`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-left-8 duration-500"
                    />
                    <Chip
                        key={`b-${publicB}`}
                        x={CENTER_X + 30}
                        y={CHANNEL_Y + 16}
                        text={`B = ${hexShort(publicB, 6, 4)}`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-right-8 duration-500"
                    />
                </svg>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center justify-center gap-3 md:w-2/3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRandomize}
                        >
                            <Dices data-icon="inline-start" />
                            Randomize secrets
                        </Button>
                        <span className="text-muted-foreground text-center font-mono text-xs">
                            p: {pDigits} digits · secrets: ~{secretDigits}{" "}
                            digits · K: {keyDigits} digits
                        </span>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            shared key K
                        </span>
                        <span
                            className={`font-mono text-lg font-bold ${HTML_TEXT_TONE.emerald}`}
                        >
                            {hexShort(sharedKey)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            same on both devices
                        </span>
                    </div>
                </div>
                <details className="w-full">
                    <summary className="text-muted-foreground cursor-pointer text-xs">
                        full shared key
                    </summary>
                    <div className="text-muted-foreground mt-2 font-mono text-xs break-all">
                        0x{sharedKey.toString(16)}
                    </div>
                </details>
            </CardFooter>
        </Card>
    )
}
