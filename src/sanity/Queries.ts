export const hentDokumentQuery = (
  dokumentType: string,
  dokumentApiNavn: string,
  maalform: string,
) => `
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

export const hentDelmalQuery = (maalform: string) =>
  `{
      ..., ${maalform}[]{
        ..., 
        _type == "block"=> {..., markDefs[]{
            ...,
            flettefeltReferanse->
          },
        _type == "flettefelt" => {..., flettefeltReferanse->}
        },
      }
    }`



    export const hentBegrunnelseTekstQuery = (apiNavn: string, maalform: string) => `
 *[_type == "begrunnelse" && apiNavn=="${apiNavn}"][0].${maalform}[]{...,children[]
   {..., 
   }
 }

`;
