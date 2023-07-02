export const hentDokumentQuery = (dokumentType: string, dokumentApiNavn: string, maalform: string) => `
  *[_type == "${dokumentType}" && apiNavn == "${dokumentApiNavn}"][0]
    {..., ${maalform}[]
      { ...,
        _type == "block"=> {..., markDefs[]{
          ...,
          flettefeltReferanse->
          }
        },
        _type == "flettefelt" => {..., flettefeltReferanse->},
        _type == "delmal" => {..., 
          delmalReferanse->${hentDelmalQuery(maalform)}
        },
      }
    }
   `

export const hentDelmalQuery = (målform: string) => `
   {
      ..., ${målform}[]{
        ..., 
        _type == "block"=> {..., markDefs[]{
            ...,
            flettefeltReferanse->
          },
        _type == "flettefelt" => {..., flettefeltReferanse->}
        },
      }
   }
`

export const hentBegrunnelseTekstQuery = (apiNavn: string, målform: string) => `
 *[_type == "begrunnelse" && apiNavn=="${apiNavn}"][0].${målform}[]{...,children[]
   {..., 
   }
 }
`
