export function GetAssetsFile(url) {
   return new URL(`../assets/`+url, import.meta.url).href
}

export function GamesGetAssetsFile(id,url) {
   return new URL(`../assets/Games/${id}/${url}`, import.meta.url).href
}

export function GetSystemEffectAssetsFile(url) {
   return new URL(`../assets/System/Effects/${url}`, import.meta.url).href
}

export function GetTheamsAssetsFile(TheamName) {
   return new URL(`../theams/${TheamName}`, import.meta.url).href
}