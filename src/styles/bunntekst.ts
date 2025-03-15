export function bunntekst(tekst: string) {
  //language=CSS
  return `
    @page {
      @bottom-right {
        font-family: Source Sans Pro, sans-serif;
        content: 'Side ' counter(page) ' av ' counter(pages);
      }

      @bottom-left {
        font-family: Source Sans Pro, sans-serif;
        content: '${tekst}';
      }
    }
  `
}
