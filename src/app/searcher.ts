export class Searcher {
    private __data: any[] = [];

    /**
     * Muda a base de busca, ou seja, a lista de dados sendo trabalhada.
     * @param data: array
     * @returns Searcher
     */
    on(data: any[]): this {
        this.__data = data;
        return this;
    };

    /**
     * Faz a busca do valor dentro da lista de dados sendo trabalhada.
     * @param tt: string
     * @returns array
     */
    search(tt: string): any[] {
        let doms: any[] = [];
        for (let i = 0; i < this.__data.length; i++) {
            let dat = this.__data[i];
            for (let key in dat) {
                if (key == tt) {
                    doms.push({ index: i, k: key, v: dat[key], relevance: 4 });
                } else if ((new RegExp('\\b'+tt+'\\b','gi')).test(key)) {
                    doms.push({ index: i, k: key, v: dat[key], relevance: 3 });
                } else if ((new RegExp('\\b'+tt,'gi')).test(key)) {
                    doms.push({ index: i, k: key, v: dat[key], relevance: 2 });
                } else if (key.indexOf(tt) > 0) {
                    doms.push({ index: i, k: key, v: dat[key], relevance: 1 });
                } else {
                    let rel = deepSearch(tt, dat[key]);
                    if (rel > 0) {
                        doms.push({ index: i, k: key, v: dat[key], relevance: (rel) });
                    }
                }
            }
        }
        return doms;
    }
}

//
/**
 * Objeto para busca de termos em Listas de objetos.
 */

/**
 * Verifica se o parâmetro passado é um object.
 * @param val: any 
 * @returns boolean
 */
function isObject(val: any): boolean {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
}

/**
 * Verifica se o parâmetro passado é uma string.
 * @param val: any 
 * @returns boolean
 */
function isString(val: any): boolean {
    return typeof val === 'string' || val instanceof String;
}

/**
 * Executa busca recursiva dentro de estruturas aninhadas.
 * @param term: string
 * @param data: array 
 * @returns number
 */
function deepSearch(term: string, data: any): number {
    if (isObject(data)) {
        for (let key in data) {
            let n = deepSearch(term, data[key]);
            if (n > 0) {
                return n;
            }
        }
    } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let n = deepSearch(term, data[i]);
            if (n > 0) {
                return n;
            }
        }
    } else if (isString(data)) {
        // exact term
        if (data == term) {
            return 4;
        }

        // exact term contained as a whole word
        if ((new RegExp('\\b'+term+'\\b','gi')).test(data)) {
            return 3;
        }

        // possible word derivates
        if ((new RegExp('\\b'+term,'gi')).test(data)) {
            return 2;
        }

        // just containing the term coincindentally... or not
        let pos = data.indexOf(term);

        return ((pos == 0) ? 2 : ((pos > 0) ? 1 : 0));
    } else if (data && (data == term)) {
        return 4;
    }
    return 0;
}

export function on(data: any) {
    return (new Searcher()).on(data);
}

