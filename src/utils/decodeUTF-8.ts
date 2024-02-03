export const decodeUtf8 = (text: string) => {
    return new TextDecoder("utf-8").decode(new Uint8Array(text.split('').map(c => c.charCodeAt(0))));
}