export function pascalCaseToTitleCase(str: string): string {
    return str
        .replace(/[a-z][A-Z0-9]/g, (match) => {
            return `${match[0]} ${match[1]}`;
        })
        .replace(/[A-Z]{2,}[a-z0-9]/g, (match) => {
            return `${match.slice(0, match.length - 2)} ${match.slice(match.length - 2)}`;
        });
}
