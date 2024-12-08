/**
 * A record mapping the aliases of all known components to their respective ids.
 *
 * Note: This record is automatically generated by the build process.
 */
const knownAliases: Readonly<Partial<Record<string, string>>> = /* aliases_placeholder[ */{}/* ] */;

export function resolveAlias(name: string): string {
	return knownAliases[name] || name;
}