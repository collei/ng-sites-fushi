export class FushiString {
	/**
	 *	Constants for string handling.
	 */
	private static readonly VOWEL = 'aiueo';
	private static readonly CONSONANT_START = 'bcčdfghjklmnňprsštvzž';
	private static readonly CONSONANT_FINISH = 'bcčdfghjklmnňprsštvzž';
	private static readonly SEMIVOWEL_START = 'ył';
	private static readonly SEMIVOWEL_FINISH = 'îł';

	/**
	 *	Tells Fushi words' syllables apart according Fushi phonotatics.
	 *
	 *	@param string $term
	 *	@param string $separator
	 *	@return string
	 */
	syllablesOf(term: string, separator: string = '.'): string {
        return this.syllablesAsArray(term).join(separator);
    }

	/**
	 *	Tells Fushi words' syllables apart according Fushi phonotatics.
	 *
	 *	@param string $term
	 *	@param string $separator
	 *	@return array
	 */
	syllablesAsArray(term: string): string[] {
		let syllables = [],
            syllable = '',
            letras = [],
            len = 0;
        term = (term.slice(-2) == 'ch') ? (term.slice(0,-2) + 'h') : term;
        letras = term.split('');
        len = letras.length;

        this.debugStep('START ' + term);
        
        for (let i=0; i<len; i++) {
            let letra = letras[i],
                lookahead : any = false,
                la = i+1;

            if (la < len) {
                lookahead = letras[la];
            }

            if ('' == syllable) {
                syllable = letra;
                continue;
            }

            if (
                FushiString.CONSONANT_START.indexOf(syllable) >= 0 &&
                (FushiString.SEMIVOWEL_START + FushiString.VOWEL).indexOf(letra) >= 0
            ) {
                this.debugStep('R1', [syllable, letra]);
                syllable += letra;
                continue;
            }


			//	mb_stripos(self::SEMIVOWEL_START, mb_substr($syllable,-1)) !== false &&
			//	mb_stripos(self::VOWEL, $letra) !== false
            if (
                FushiString.SEMIVOWEL_START.indexOf(syllable.slice(-1)) >= 0 &&
                FushiString.VOWEL.indexOf(letra) >= 0
            ) {
                this.debugStep('R2', [syllable, letra]);
                syllable += letra;
                continue;
            }

			//	mb_stripos(self::VOWEL, mb_substr($syllable,-1)) !== false &&
			//	mb_stripos(self::SEMIVOWEL_FINISH, $letra) !== false
            if (
                FushiString.VOWEL.indexOf(syllable.slice(-1)) >= 0 &&
                FushiString.SEMIVOWEL_FINISH.indexOf(letra) >= 0
            ) {
                this.debugStep('R3', [syllable, letra]);
                syllable += letra;
                continue;
            }


			//	mb_stripos(self::VOWEL, mb_substr($syllable,-1)) !== false &&
			//	mb_stripos(self::CONSONANT_FINISH.self::SEMIVOWEL_FINISH, $letra) !== false
			if (
                FushiString.VOWEL.indexOf(syllable.slice(-1)) >= 0 &&
                (FushiString.CONSONANT_FINISH + FushiString.SEMIVOWEL_FINISH).indexOf(letra) >= 0
			) {
                if ((lookahead !== false) && ((FushiString.VOWEL + FushiString.SEMIVOWEL_START).indexOf(lookahead)<0)) {
                    this.debugStep('R4a', [syllable, letra, lookahead]);
                    syllable += letra;
                    continue;
                } else if (lookahead == false) {
                    this.debugStep('R4b', [syllable, letra, lookahead]);
                    syllable += letra;
                    continue;
                }
			}

            syllables.push(syllable);
            syllable = letra;
        }

		syllables.push(syllable);
		
		return syllables;
	}

    private debugLines : string[] = [];

	private debugStep(label: string, parameters: string[] = [])
	{
		let line = '» ' + label + ' [' + parameters.join(',') + ']';
		this.debugLines.push(line);
	}

	clearDebugInfo(): void {
		this.debugLines = [];
	}

	getDebugInfo(): string[] {
		return this.debugLines;
	}

	getDebugInfoAndClear(): string[] {
		let debug = this.getDebugInfo();
		this.clearDebugInfo();
		return debug;
	}    
}
