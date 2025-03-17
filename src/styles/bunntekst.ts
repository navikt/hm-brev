export function bunntekst(tekst: string) {
  //language=CSS
  return `
    @page {
      @bottom-right {
        font-family: 'Source Sans 3', sans-serif;
        content: 'Side ' counter(page) ' av ' counter(pages);
      }

      @bottom-left {
        font-family: 'Source Sans 3', sans-serif;
        content: '${tekst}';
      }
    }
  `
}
