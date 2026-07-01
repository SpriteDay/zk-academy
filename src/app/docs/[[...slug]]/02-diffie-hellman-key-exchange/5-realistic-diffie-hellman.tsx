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
import { useMemo, useState, type ReactNode } from "react"
import { HTML_TEXT_TONE } from "./shared/exchange-stage"
import { modPow } from "./shared/mod-math"
import {
    ExchangeScene,
    StagePanel,
    StageStepper,
} from "./shared/staged-exchange"

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

const STEP_LABELS = [
    "Public numbers",
    "Private secrets",
    "Mix and send",
    "Shared key",
]

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
    partyA = "Walter",
    partyB = "Jesse",
}: RealisticDiffieHellmanProps) {
    const [secretA, setSecretA] = useState(DEFAULT_SECRET_A)
    const [secretB, setSecretB] = useState(DEFAULT_SECRET_B)
    const [step, setStep] = useState(0)
    const [replays, setReplays] = useState(0)

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

    const titles = [
        "Standardized public numbers",
        "Secrets too big to guess",
        "Same mixing, giant numbers",
        "A key nobody else can compute",
    ]

    const descriptions: ReactNode[] = [
        <p key="0">
            In practice nobody picks{" "}
            <span className={HTML_TEXT_TONE.rose}>g</span> and{" "}
            <span className={HTML_TEXT_TONE.rose}>p</span> by hand — protocols
            ship standardized groups. This one is RFC 3526 group 14: g = 2 and a
            2048-bit prime p, {pDigits} digits long.
        </p>,
        <p key="1">
            Each device rolls 256 random bits — a number around {secretDigits}{" "}
            digits. The space of possible secrets is so large that trying them
            one by one is hopeless.
        </p>,
        <p key="2">
            Exactly the dance you just stepped through, at full size: A = g
            <sup>a</sup> mod p. Even holding A, g and p, no computer on Earth
            digs the secret back out of a number like this.
        </p>,
        <p key="3">
            Both devices land on the same {keyDigits}-digit{" "}
            <span className={HTML_TEXT_TONE.emerald}>K</span> without it ever
            touching the wire. This is essentially what your browser did to open
            a secure channel before this page even loaded.
        </p>,
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>The real thing</CardTitle>
                <CardDescription>
                    Same exchange, but with numbers nobody can brute-force
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-2">
                    <ExchangeScene
                        step={step}
                        playKey={`${step}-${replays}-${secretA.toString(16).slice(0, 12)}`}
                        partyA={partyA}
                        partyB={partyB}
                        ariaLabel={`Realistic Diffie-Hellman exchange, step ${step + 1} of 4: ${partyA} and ${partyB} with a 2048-bit prime modulus`}
                        gChip="g = 2"
                        pChip={`p = ${pDigits} digits`}
                        secretA={`a = ${hexShort(secretA, 4, 4)}`}
                        secretB={`b = ${hexShort(secretB, 4, 4)}`}
                        mixA={`A = ${hexShort(publicA, 4, 4)}`}
                        mixB={`B = ${hexShort(publicB, 4, 4)}`}
                        keyText={`K = ${hexShort(sharedKey, 4, 4)}`}
                        keyChip={`K = ${hexShort(sharedKey, 4, 4)} — never sent`}
                    />
                    <StageStepper
                        labels={STEP_LABELS}
                        step={step}
                        onStepChange={setStep}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 text-sm">
                <StagePanel
                    step={step}
                    title={titles[step]}
                    onStepChange={setStep}
                    onReplay={() => setReplays((n) => n + 1)}
                >
                    {descriptions[step]}
                </StagePanel>
                {step === 1 && (
                    <div className="flex w-full flex-col items-center gap-2">
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
                            digits
                        </span>
                    </div>
                )}
                {step === 3 && (
                    <details className="w-full">
                        <summary className="text-muted-foreground cursor-pointer text-xs">
                            full shared key ({keyDigits} digits)
                        </summary>
                        <div className="text-muted-foreground mt-2 font-mono text-xs break-all">
                            0x{sharedKey.toString(16)}
                        </div>
                    </details>
                )}
            </CardFooter>
        </Card>
    )
}
