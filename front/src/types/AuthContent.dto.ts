import { Tokens } from "./Tokens.dto"

export type AuthContent = {
    auth: Tokens,
    setAuth:(c: Tokens) => void
}