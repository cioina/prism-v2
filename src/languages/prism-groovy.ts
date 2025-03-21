import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { LanguageProto } from '../types';

export default {
	id: 'groovy',
	require: clike,
	grammar({ extend }) {
		const interpolation = {
			pattern: /((?:^|[^\\$])(?:\\{2})*)\$(?:\w+|\{[^{}]*\})/,
			lookbehind: true,
			inside: {
				'interpolation-punctuation': {
					pattern: /^\$\{?|\}$/,
					alias: 'punctuation'
				},
				'expression': {
					pattern: /[\s\S]+/,
					inside: 'groovy'
				}
			}
		};

		const groovy = extend('clike', {
			'string': {
				// https://groovy-lang.org/syntax.html#_dollar_slashy_string
				pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
				greedy: true
			},
			'keyword': /\b(?:abstract|as|assert|boolean|break|byte|case|catch|char|class|const|continue|def|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|in|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
			'number': /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
			'operator': {
				pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
				lookbehind: true
			},
			'punctuation': /\.+|[{}[\];(),:$]/
		});

		insertBefore(groovy, 'string', {
			'shebang': {
				pattern: /#!.+/,
				alias: 'comment',
				greedy: true
			},
			'interpolation-string': {
				// TODO: Slash strings (e.g. /foo/) can contain line breaks but this will cause a lot of trouble with
				// simple division (see JS regex), so find a fix maybe?
				pattern: /"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
				greedy: true,
				inside: {
					'interpolation': interpolation,
					'string': /[\s\S]+/
				}
			}
		});

		insertBefore(groovy, 'punctuation', {
			'spock-block': /\b(?:and|cleanup|expect|given|setup|then|when|where):/
		});

		insertBefore(groovy, 'function', {
			'annotation': {
				pattern: /(^|[^.])@\w+/,
				lookbehind: true,
				alias: 'punctuation'
			}
		});

		return groovy;
	}
} as LanguageProto<'groovy'>;
